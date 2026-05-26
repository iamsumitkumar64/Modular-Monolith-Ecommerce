import { BadRequestException, Injectable, } from "@nestjs/common";
import { ExchangeNameEnum, RoutingKeyEnum } from "src/module/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.enum";
import { OrderPaymentStatusEnum } from "src/module/order-module/domain/order/order.enum";
import { OrderRepository } from "src/module/order-module/infrastructure/repository/order.repository";
import { OutboxRepository } from "src/module/order-module/infrastructure/repository/outbox.repository";

@Injectable()
export class OrderPaidService {
    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly outboxRepository: OutboxRepository,
    ) { }

    async orderPaid(payload: any) {

        const isOrderExists = await this.orderRepository.findByUuid(payload.order_uuid);
        if (!isOrderExists) {
            console.warn(`Order not found so skipped: ${payload.order_uuid}`);
            return;
        }

        await this.orderRepository.updateOrderPaymentStatus(payload.order_uuid, OrderPaymentStatusEnum.PAID)

        await this.outboxRepository.createOutboxntry({
            exchange_name: ExchangeNameEnum.ORDER_EXCHANGE,
            routing_key: RoutingKeyEnum.ORDER_PAID_DEDUCT_STOCK,
            message_payload: {
                order_uuid: payload.order_uuid,
                order: isOrderExists
            }
        });

        return;
    }
}