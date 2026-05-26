import { BadRequestException, Injectable } from "@nestjs/common";
import { OrderStatusChangedEventPayload } from "src/module/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.type";
import { OrderRepository } from "src/module/order-module/infrastructure/repository/order.repository";

@Injectable()
export class OrderStatusChangedService {
    constructor(
        private readonly repository: OrderRepository,
    ) { }

    async OrderStatusChanged(payload: OrderStatusChangedEventPayload) {
        await this.repository.updateOrderStatus(payload.order_uuid, payload.nextStatus)

        return;
    }
}