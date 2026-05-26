import { BadRequestException, Injectable } from "@nestjs/common";
import { UserEntity } from "src/module/user-module/domain/user/user.entity";
import { ExchangeNameEnum, RoutingKeyEnum } from "src/module/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.enum";
import { OrderPaymentStatusEnum, OrderStatusEnum } from "src/module/shipment-module/domain/order/order.enum";
import { OrderRepository } from "src/module/shipment-module/infrastructure/repository/order.repository";
import { OutboxRepository } from "src/module/shipment-module/infrastructure/repository/outbox.repository";
import { ReturnOrderDto } from "./return-order.dto";
import isReturnPolicyExpired from "src/module/common/infrastruture/services/return.policy.service";

@Injectable()
export class ReturnOrderService {
    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly outboxRepository: OutboxRepository,
    ) { }

    async returnOrder(user: UserEntity, body: ReturnOrderDto) {
        const { order_uuid } = body;

        const order = await this.orderRepository.findByUserUuidAndOrderUuid(user.uuid, order_uuid);
        if (!order) {
            throw new BadRequestException("Your Order not found");
        }
        if (order.order_status == OrderStatusEnum.RETURNED && order.payment_status == OrderPaymentStatusEnum.REFUND) {
            throw new BadRequestException("Your Order already returned");
        } else if (order.order_status == OrderStatusEnum.RETURNED && order.payment_status !== OrderPaymentStatusEnum.REFUND) {
            throw new BadRequestException("Your Order returned and refund of money is in process");
        } else if (isReturnPolicyExpired(order.created_at)) {
            throw new BadRequestException(`Returning policy is for only ${process.env.MAX_RETURN_ORDER_DAYS_POLICY} days`);
        }

        const returnedFromStatus = order.order_status;

        await this.orderRepository.updateReturnedFromStatus(order_uuid, returnedFromStatus);
        await this.orderRepository.updateOrderStatus(order_uuid, OrderStatusEnum.RETURNED);
        await this.orderRepository.updateOrderPaymentStatus(order_uuid, OrderPaymentStatusEnum.REFUND);

        order.returned_from_status = returnedFromStatus;
        order.order_status = OrderStatusEnum.RETURNED;
        order.payment_status = OrderPaymentStatusEnum.REFUND;

        await this.outboxRepository.createOutboxntry({
            exchange_name: ExchangeNameEnum.ORDER_EXCHANGE,
            routing_key: RoutingKeyEnum.ORDER_RETURNED,
            message_payload: {
                order,
            },
        });

        return {
            message: "Order Returned Successfully",
        };
    }
}
