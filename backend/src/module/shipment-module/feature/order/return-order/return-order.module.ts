import { Module } from "@nestjs/common";
import { ReturnOrderController } from "./return-order.controller";
import { ReturnOrderService } from "./return-order.service";
import { OrderRepository } from "src/module/shipment-module/infrastructure/repository/order.repository";
import { OutboxRepository } from "src/module/shipment-module/infrastructure/repository/outbox.repository";

@Module({
    imports: [],
    controllers: [ReturnOrderController],
    providers: [ReturnOrderService, OrderRepository, OutboxRepository],
    exports: [],
})
export class ReturnOrderModule { }
