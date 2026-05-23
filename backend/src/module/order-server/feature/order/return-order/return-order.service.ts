import { BadRequestException, Injectable } from "@nestjs/common";
import { UserEntity } from "src/module/user-server/domain/user/user.entity";
import { ReturnOrderDto } from "./return-order.dto";
import { OrderRepository } from "src/module/order-server/infrastructure/repository/order.repo";
import { ExchangeNameEnum, RoutingKeyEnum } from "src/module/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.enum";
import { OutboxRepository } from "src/module/order-server/infrastructure/repository/outbox.repo";
import { OrderPaymentStatusEnum, OrderStatusEnum } from "src/module/order-server/domain/order/order.enum";

@Injectable()
export class ReturnOrderService {
    constructor(
        private readonly orderRepo: OrderRepository,
        private readonly outboxRepo: OutboxRepository,
    ) { }

    async returnOrder(user: UserEntity, body: ReturnOrderDto) {
        const { order_uuid } = body;

        const order = await this.orderRepo.findByUserUuidAndOrderUuid(user.uuid, order_uuid);
        if (!order) {
            throw new BadRequestException("Your Order not found");
        }
        if (order.order_status == OrderStatusEnum.RETURNED && order.payment_status == OrderPaymentStatusEnum.REFUND) {
            throw new BadRequestException("Your Order already returned");
        } else if (order.order_status == OrderStatusEnum.RETURNED && order.payment_status !== OrderPaymentStatusEnum.REFUND) {
            throw new BadRequestException("Your Order returned and refund of money is in process");
        }

        await this.orderRepo.updateOrderStatus(order_uuid, OrderStatusEnum.RETURNED);
        await this.orderRepo.updateOrderPaymentStatus(order_uuid, OrderPaymentStatusEnum.REFUND);

        // not publish direct to mq-queue
        // await this.rabbitMQService.publishToExchange(
        //     ExchangeNameEnum.ORDER_EXCHANGE,
        //     RoutingKeyEnum.ORDER_CREATED,
        //     {
        //         order_uuid: order.uuid,
        //         cart_uuid,
        //         user_uuid: user.uuid,
        //         total_price,
        //         created_at: new Date(),
        //     }
        // );

        // make entry of publish exchange
        await this.outboxRepo.createOutboxntry({
            exchange_name: ExchangeNameEnum.ORDER_EXCHANGE,
            routing_key: RoutingKeyEnum.ORDER_RETURNED,
            message_payload: {
                order: order
            },
        });

        return {
            message: "Order Returnled Successfully",
        };
    }
}