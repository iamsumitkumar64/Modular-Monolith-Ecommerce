import { BadRequestException, Injectable } from "@nestjs/common";
import { UserEntity } from "src/module/user-server/domain/user/user.entity";
import { ExchangeNameEnum, RoutingKeyEnum } from "src/module/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.enum";
import { OrderPaymentStatusEnum, OrderStatusEnum } from "src/module/shipment-server/domain/order/order.enum";
import { OrderRepository } from "src/module/shipment-server/infrastructure/repository/order.repo";
import { OutboxRepository } from "src/module/shipment-server/infrastructure/repository/outbox.repo";
import { ReturnOrderDto } from "./return-order.dto";

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

        const returnedFromStatus = order.order_status;

        await this.orderRepo.updateReturnedFromStatus(order_uuid, returnedFromStatus);
        await this.orderRepo.updateOrderStatus(order_uuid, OrderStatusEnum.RETURNED);
        await this.orderRepo.updateOrderPaymentStatus(order_uuid, OrderPaymentStatusEnum.REFUND);

        order.returned_from_status = returnedFromStatus;
        order.order_status = OrderStatusEnum.RETURNED;
        order.payment_status = OrderPaymentStatusEnum.REFUND;

        await this.outboxRepo.createOutboxntry({
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
