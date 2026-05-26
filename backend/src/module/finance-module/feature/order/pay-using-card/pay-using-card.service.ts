import { BadRequestException, Injectable } from "@nestjs/common";
import { FinanceRepository } from "src/module/finance-module/infrastructure/repository/finance.repository";
import { UserEntity } from "src/module/finance-module/domain/user/user.entity";
import { PayUsingCardDto } from "./pay-using-card-dto";
import { PaymentHistoryTypeEnum } from "src/module/finance-module/domain/payment-history/payment.enum";
import { OutboxRepository } from "src/module/finance-module/infrastructure/repository/outbox.repository";
import { ExchangeNameEnum, RoutingKeyEnum } from "src/module/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.enum";
import { SocketService } from "src/module/common/infrastruture/socket/socket.service";
import { SocketEventNameEnum } from "src/module/common/infrastruture/socket/socket.enum";

@Injectable()
export class PayUsingCardService {
    constructor(
        private readonly financeRepository: FinanceRepository,
        private readonly outboxRepository: OutboxRepository,
        private readonly socketService: SocketService,
    ) { }

    async payUsingCard(user: UserEntity, body: PayUsingCardDto) {
        const amount = Number(body.amount);
        // amount should be reasonlabe
        if (!amount || amount <= 0) {
            throw new BadRequestException("Amount must be greater than zero");
        }

        // check is card exists with user
        const isCardExists = await this.financeRepository.findCard(user.uuid, body.card_uuid);
        if (!isCardExists) {
            throw new BadRequestException("Card not found");
        }

        let account = await this.financeRepository.findAccount(user.uuid);
        if (!account) {
            account = await this.financeRepository.createAccount({ user_uuid: user.uuid, balance: 0 });
        }

        // amount is too much to PayUsingCard than in user account
        if (account.balance < amount) {
            throw new BadRequestException("Insufficient balance in account");
        }

        // deduct amount from account
        account.balance -= amount;
        const saved = await this.financeRepository.saveAccount(account);

        // make PayUsingCardment history
        await this.financeRepository.createHistory({
            user_uuid: user.uuid,
            order_uuid: body.order_uuid,
            amount,
            type: PaymentHistoryTypeEnum.PAYMENT_USING_CARD,
            card_uuid: isCardExists.uuid,
            description: `Paid with card '${isCardExists.name_on_card}'-'${Number(isCardExists.card_number) % 10000}'`,
        });

        // not publish direct to mq-queue
        // await this.rabbitMQService.publishToExchange(
        //     ExchangeNameEnum.ORDER_EXCHANGE,
        //     RoutingKeyEnum.ORDER_PAID,
        //     {
        //        order_uuid: body.order_uuid,
        //     }
        // );

        // make entry of publish exchange
        await this.outboxRepository.createOutboxntry({
            exchange_name: ExchangeNameEnum.ORDER_EXCHANGE,
            routing_key: RoutingKeyEnum.ORDER_PAID,
            message_payload: {
                order_uuid: body.order_uuid,
            },
        });

        await this.socketService.emitToUser(user.uuid, SocketEventNameEnum.ORDER_PAID, { order_uuid: body.order_uuid });

        return {
            data: saved,
            message: "PayUsingCardment processed and account updated"
        };
    }
}