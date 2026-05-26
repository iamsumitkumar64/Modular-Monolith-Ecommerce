import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RabbitMQService } from 'src/module/common/infrastruture/rabbit-mq/rabbit-mq.service';
import { ExchangeNameEnum, ExchangeTypeEnum, QueueEnum, RoutingKeyEnum } from 'src/module/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.enum';
import { OrderCreatedEventPayload, RabbitMQConsumerMessage } from 'src/module/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.type';
import { InboxRepository } from '../../../repository/inbox.repository';
import { OrderCreatedService } from 'src/module/shipment-module/feature/order/order-created/order.created.service';

@Injectable()
export class OrderCreatedConsumer implements OnModuleInit {
    private readonly logger = new Logger(OrderCreatedConsumer.name);

    constructor(
        private readonly rabbitMQService: RabbitMQService,
        private readonly orderCreatedService: OrderCreatedService,
        private readonly inboxRepository: InboxRepository,

    ) { }

    async onModuleInit() {
        await this.rabbitMQService.consumeMessages<RabbitMQConsumerMessage<OrderCreatedEventPayload>>(
            QueueEnum.SHIPMENT_ORDER_CREATED_QUEUE,
            async (data) => {
                const { outbox_uuid, payload } = data;

                this.logger.log(`Processing Order created: ${outbox_uuid}\n ${JSON.stringify(payload)}`);

                const alreadyProcessed = await this.inboxRepository.findByOutboxUuid(outbox_uuid);
                if (alreadyProcessed) {
                    this.logger.warn(`Duplicate skipped: ${outbox_uuid}`);
                    return;
                }

                await this.orderCreatedService.orderCreated(payload);

                await this.inboxRepository.createEntry({ outbox_uuid });
            },
        );
    }
}
