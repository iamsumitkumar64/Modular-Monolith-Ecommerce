import { BadRequestException, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RabbitMQService } from 'src/module/common/infrastruture/rabbit-mq/rabbit-mq.service';
import { ExchangeNameEnum, ExchangeTypeEnum, QueueEnum, RoutingKeyEnum } from 'src/module/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.enum';
import { InboxRepository } from '../../../repository/inbox.repo';
import { SocketService } from 'src/module/common/socket/socket.service';
import { SocketEventNameEnum } from 'src/module/common/socket/socket.enum';
import { FinanceRepository } from '../../../repository/finance.repo';
import { PaymentHistoryTypeEnum } from 'src/module/finance-server/domain/payment-history/payment.enum';

@Injectable()
export class FinanceOrderReturnConsumer implements OnModuleInit {
    private readonly logger = new Logger(FinanceOrderReturnConsumer.name);

    constructor(
        private readonly rabbitMQService: RabbitMQService,
        private readonly inboxRepo: InboxRepository,
        private readonly socketService: SocketService,
        private readonly financeRepo: FinanceRepository,
    ) { }

    async onModuleInit() {
        await this.rabbitMQService.consumeMessages(
            QueueEnum.FINANCE_ORDER_RETURNED_QUEUE,
            async (data) => {
                const { outbox_uuid, payload } = data;

                this.logger.log(`Processing Order returned and payment return: ${outbox_uuid} \n ${JSON.stringify(payload)}`);

                const alreadyProcessed = await this.inboxRepo.findByOutboxUuid(outbox_uuid);
                if (alreadyProcessed) {
                    this.logger.warn(`Duplicate skipped: ${outbox_uuid}`);
                    return;
                }

                const order = payload.order;

                if (!order || !order.items) {
                    this.logger.error(`Order data missing or invalid for outbox: ${outbox_uuid}`);
                    return;
                }

                // make payment returned 
                let account = await this.financeRepo.findAccount(order.user.uuid);
                if (!account) {
                    throw new BadRequestException("Account not found for return");
                }

                const returnAmount = Number(order.total_price);
                account.balance += returnAmount;

                await this.financeRepo.saveAccount(account);
                await this.financeRepo.createHistory({
                    user_uuid: order.user.uuid,
                    amount: returnAmount,
                    type: PaymentHistoryTypeEnum.REFUND,
                    description: 'Order return And Money Refund',
                });

                await this.inboxRepo.createEntry({ outbox_uuid });
            },
        );
    }
}