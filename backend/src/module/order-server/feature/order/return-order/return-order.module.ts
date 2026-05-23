import { Module } from "@nestjs/common";
import { ReturnOrderController } from "./return-order.controller";
import { ReturnOrderService } from "./return-order.service";
import { OrderRepository } from "src/module/order-server/infrastructure/repository/order.repo";
import { OutboxRepository } from "src/module/order-server/infrastructure/repository/outbox.repo";

@Module({
    imports: [],
    controllers: [ReturnOrderController],
    providers: [ReturnOrderService, OrderRepository, OutboxRepository],
    exports: [],
})
export class ReturnOrderModule { }
