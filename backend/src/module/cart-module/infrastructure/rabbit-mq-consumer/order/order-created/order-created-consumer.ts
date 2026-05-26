import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RabbitMQService } from 'src/module/common/infrastruture/rabbit-mq/rabbit-mq.service';
import { ExchangeNameEnum, ExchangeTypeEnum, QueueEnum, RoutingKeyEnum } from 'src/module/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.enum';
import { InboxRepository } from '../../../repository/inbox.repository';
import { OrderCreateService } from 'src/module/cart-module/feature/order/order-create/order.create.service';

@Injectable()
export class OrderCreatedConsumer implements OnModuleInit {
    private readonly logger = new Logger(OrderCreatedConsumer.name);

    constructor(
        private readonly rabbitMQService: RabbitMQService,
        private readonly inboxRepository: InboxRepository,
        private readonly orderCreateService: OrderCreateService,
    ) { }

    async onModuleInit() {
        await this.rabbitMQService.consumeMessages(
            QueueEnum.CART_ORDER_CREATED_QUEUE,
            async (data) => {
                const { outbox_uuid, payload } = data;

                this.logger.log(`Processing Order created: ${outbox_uuid}\n ${JSON.stringify(payload)}`);

                const alreadyProcessed = await this.inboxRepository.findByOutboxUuid(outbox_uuid);
                if (alreadyProcessed) {
                    this.logger.warn(`Duplicate skipped: ${outbox_uuid}`);
                    return;
                }

                await this.orderCreateService.orderCreate(payload);

                await this.inboxRepository.createEntry({ outbox_uuid });
            },
        );
    }
}