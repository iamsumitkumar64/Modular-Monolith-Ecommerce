import { BadRequestException, Injectable } from "@nestjs/common";
import { UserEntity } from "src/module/user-module/domain/user/user.entity";
import { CreateOrderDto } from "./create-order.dto";
import { OrderRepository } from "src/module/order-module/infrastructure/repository/order.repository";
import { OrderItemRepository } from "src/module/order-module/infrastructure/repository/order.item.repository";
import { ExchangeNameEnum, RoutingKeyEnum } from "src/module/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.enum";
import { OutboxRepository } from "src/module/order-module/infrastructure/repository/outbox.repository";

@Injectable()
export class CreateOrderService {
    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly orderItemRepository: OrderItemRepository,
        private readonly outboxRepository: OutboxRepository,
    ) { }

    async createOrder(user: UserEntity, body: CreateOrderDto) {
        const { cart_uuid, items, total_price, order_address } = body;

        const order = await this.orderRepository.createOrder({
            cart_uuid,
            total_price,
            user_uuid: user.uuid,
            order_address,
        });

        const orderItems = await Promise.all(
            items.map(item =>
                this.orderItemRepository.createOrderItem({
                    order_uuid: order.uuid,
                    product_uuid: item.product_uuid,
                    name: item.name,
                    description: item.description,
                    image_url: item.image_url,
                    price: item.price,
                    quantity: item.quantity
                })
            )
        );

        order.items = orderItems;

        // not publish direct to mq-queue
        // await this.rabbitMQService.publishToExchange(
        //     ExchangeNameEnum.ORDER_EXCHANGE,
        //     RoutingKeyEnum.ORDER_CREATED,
        //     {
        //         order_uuid: order.uuid,
        //         cart_uuid,
        //         user_uuid: user.uuid,
        //         total_price,
        //         created_at: new Date(),
        //     }
        // );

        // make entry of publish exchange
        await this.outboxRepository.createOutboxntry({
            exchange_name: ExchangeNameEnum.ORDER_EXCHANGE,
            routing_key: RoutingKeyEnum.ORDER_CREATED,
            message_payload: {
                order_uuid: order.uuid,
                cart_uuid,
                user_uuid: user.uuid,
                total_price,
                order_address,
                items: orderItems.map(item => ({
                    uuid: item.uuid,
                    name: item.name,
                    product_uuid: item.product_uuid,
                    description: item.description,
                    image_url: item.image_url,
                    price: item.price,
                    quantity: item.quantity,
                })),
                created_at: new Date(),
            },
        });

        return {
            data: order,
            message: "Order Created Successfully",
        };
    }
}