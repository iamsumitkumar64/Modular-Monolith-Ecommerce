import { BadRequestException, Injectable, } from "@nestjs/common";
import { OrderPaidEventPayload } from "src/module/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.type";
import { OrderPaymentStatusEnum } from "src/module/shipment-module/domain/order/order.enum";
import { OrderRepository } from "src/module/shipment-module/infrastructure/repository/order.repository";

@Injectable()
export class OrderPaidService {
    constructor(
        private readonly repository: OrderRepository,
    ) { }

    async orderPaid(payload: OrderPaidEventPayload) {
        await this.repository.updateOrderPaymentStatus(payload.order_uuid, OrderPaymentStatusEnum.PAID)

        return;
    }
}