import { BadRequestException, Injectable } from "@nestjs/common";
import { UserEntity } from "src/module/user-server/domain/user/user.entity";
import { CreateOrderDto } from "./create-order.dto";
import { OrderRepository } from "src/module/order-server/infrastructure/repository/order.repo";
import { OrderItemRepository } from "src/module/order-server/infrastructure/repository/order.item.repo";

@Injectable()
export class CreateOrderService {
    constructor(
        private readonly orderRepo: OrderRepository,
        private readonly orderItemRepo: OrderItemRepository,
    ) { }

    async createOrder(user: UserEntity, body: CreateOrderDto) {
        const { cart_uuid, items, total_price } = body;

        const order = await this.orderRepo.createOrder({
            cart_uuid,
            total_price,
            user_uuid: user.uuid
        });

        const orderItems = await Promise.all(
            items.map(item =>
                this.orderItemRepo.createOrderItem({
                    order_uuid: order.uuid,
                    name: item.name,
                    description: item.description,
                    image_url: item.image_url,
                    price: item.price,
                    quantity: item.quantity
                })
            )
        );

        order.items = orderItems;

        return {
            data: order,
            message: "Order Created Successfully",
        };
    }
}