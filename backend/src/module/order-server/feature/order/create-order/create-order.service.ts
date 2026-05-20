import { BadRequestException, Injectable, Inject } from "@nestjs/common";
import { UserEntity } from "src/module/user-server/domain/user/user.entity";
import { CreateOrderDto } from "./create-order.dto";
import { OrderRepository } from "src/module/order-server/infrastructure/repository/order.repo";
import { OrderItemRepository } from "src/module/order-server/infrastructure/repository/order.item.repo";
import { RabbitMQService } from "src/module/common/infrastruture/rabbit-mq/rabbit-mq.service";
import { ExchangeNameEnum, RoutingKeyEnum } from "src/module/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.enum";
import { CartRepository } from "src/module/cart-server/infrastructure/repository/cart.repo";

@Injectable()
export class CreateOrderService {
    constructor(
        private readonly orderRepo: OrderRepository,
        private readonly orderItemRepo: OrderItemRepository,
        private readonly rabbitMQService: RabbitMQService,
        @Inject(CartRepository) private readonly cartRepo: CartRepository,
    ) { }

    async createOrder(user: UserEntity, body: CreateOrderDto) {
        const { cart_uuid, items, total_price, order_address } = body;

        const order = await this.orderRepo.createOrder({
            cart_uuid,
            total_price,
            user_uuid: user.uuid,
            order_address,
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

        // Publish order_created event to RabbitMQ
        await this.rabbitMQService.publishToExchange(
            ExchangeNameEnum.ORDER_EXCHANGE,
            RoutingKeyEnum.ORDER_CREATED,
            {
                order_uuid: order.uuid,
                cart_uuid,
                user_uuid: user.uuid,
                total_price,
                created_at: new Date(),
            }
        );

        // Delete old cart and create new one for user
        await this.cartRepo.deleteCart(cart_uuid);
        await this.cartRepo.createCart({ user_uuid: user.uuid });

        return {
            data: order,
            message: "Order Created Successfully",
        };
    }
}