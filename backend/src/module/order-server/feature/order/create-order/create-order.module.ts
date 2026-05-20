import { Module } from "@nestjs/common";
import { CreateOrderController } from "./create-order.controller";
import { CreateOrderService } from "./create-order.service";
import { OrderRepository } from "src/module/order-server/infrastructure/repository/order.repo";
import { OrderItemRepository } from "src/module/order-server/infrastructure/repository/order.item.repo";

@Module({
    imports: [],
    controllers: [CreateOrderController],
    providers: [CreateOrderService, OrderRepository, OrderItemRepository],
    exports: [],
})
export class CreateOrderModule { }
