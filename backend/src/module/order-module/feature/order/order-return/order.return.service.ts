import { BadRequestException, Injectable } from "@nestjs/common";
import { OrderEventPayload } from "src/module/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.type";
import { OrderPaymentStatusEnum, OrderStatusEnum } from "src/module/order-module/domain/order/order.enum";
import { OrderRepository } from "src/module/order-module/infrastructure/repository/order.repository";

@Injectable()
export class OrderReturnService {
    constructor(
        private readonly repository: OrderRepository,
    ) { }

    async orderReturn(order: OrderEventPayload) {
        if (order.returned_from_status) {
            await this.repository.updateReturnedFromStatus(order.uuid, order.returned_from_status);
        }
        await this.repository.updateOrderStatus(order.uuid, OrderStatusEnum.RETURNED);
        await this.repository.updateOrderPaymentStatus(order.uuid, OrderPaymentStatusEnum.REFUND);

        return;
    }
}