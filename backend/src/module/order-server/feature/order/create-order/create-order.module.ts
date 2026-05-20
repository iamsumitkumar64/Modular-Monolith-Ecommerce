import { Module } from "@nestjs/common";
import { CreateOrderController } from "./create-order.controller";
import { CreateOrderService } from "./create-order.service";
import { OrderRepository } from "src/module/order-server/infrastructure/repository/order.repo";
import { OrderItemRepository } from "src/module/order-server/infrastructure/repository/order.item.repo";
import { RabbitMQService } from "src/module/common/infrastruture/rabbit-mq/rabbit-mq.service";
import { CartRepository } from "src/module/cart-server/infrastructure/repository/cart.repo";

@Module({
    imports: [],
    controllers: [CreateOrderController],
    providers: [CreateOrderService, OrderRepository, OrderItemRepository, RabbitMQService, CartRepository],
    exports: [],
})
export class CreateOrderModule { }
