import { BadRequestException, Injectable } from "@nestjs/common";
import { OrderRepository } from "src/module/order-module/infrastructure/repository/order.repository";

@Injectable()
export class OrderStatusChangedService {
    constructor(
        private readonly repository: OrderRepository,
    ) { }

    async OrderStatusChanged(payload: any) {
        await this.repository.updateOrderStatus(payload.order_uuid, payload.nextStatus)

        return;
    }
}