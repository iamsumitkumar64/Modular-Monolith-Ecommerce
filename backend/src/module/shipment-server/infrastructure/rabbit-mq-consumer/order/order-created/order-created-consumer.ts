import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { UserRepository } from '../../../repository/user.repo';
import { RabbitMQService } from 'src/module/common/infrastruture/rabbit-mq/rabbit-mq.service';
import { ExchangeNameEnum, ExchangeTypeEnum, QueueEnum, RoutingKeyEnum } from 'src/module/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.enum';
import { InboxRepository } from '../../../repository/inbox.repo';
import { OrderRepository } from '../../../repository/order.repo';
import { OrderItemRepository } from '../../../repository/order.item.repo';

@Injectable()
export class OrderCreatedConsumer implements OnModuleInit {
    private readonly logger = new Logger(OrderCreatedConsumer.name);

    constructor(
        private readonly rabbitMQService: RabbitMQService,
        private readonly userRepo: UserRepository,
        private readonly inboxRepo: InboxRepository,
        private readonly orderRepo: OrderRepository,
        private readonly orderItemRepo: OrderItemRepository,

    ) { }

    async onModuleInit() {
        await this.rabbitMQService.consumeMessages(
            QueueEnum.SHIPMENT_ORDER_CREATED_QUEUE,
            async (data) => {
                const { outbox_uuid, payload } = data;
                const {
                    order_uuid,
                    cart_uuid,
                    total_price,
                    user_uuid,
                    order_address,
                    items,
                } = payload;

                this.logger.log(`Processing Order created: ${outbox_uuid}\n ${JSON.stringify(payload)}`);

                const alreadyProcessed = await this.inboxRepo.findByOutboxUuid(outbox_uuid);
                if (alreadyProcessed) {
                    this.logger.warn(`Duplicate skipped: ${outbox_uuid}`);
                    return;
                }

                const order = await this.orderRepo.createOrder({
                    uuid: order_uuid,
                    cart_uuid,
                    total_price,
                    user_uuid: user_uuid,
                    order_address,
                });

                await Promise.all(
                    items.map(item =>
                        this.orderItemRepo.createOrderItem({
                            uuid: item.uuid,
                            order_uuid: order.uuid,
                            name: item.name,
                            description: item.description,
                            image_url: item.image_url,
                            price: item.price,
                            quantity: item.quantity
                        })
                    )
                );

                await this.inboxRepo.createEntry({ outbox_uuid });
            },
        );
    }
}