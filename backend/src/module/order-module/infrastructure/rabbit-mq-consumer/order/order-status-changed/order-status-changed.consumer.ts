import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RabbitMQService } from 'src/module/common/infrastruture/rabbit-mq/rabbit-mq.service';
import { ExchangeNameEnum, ExchangeTypeEnum, QueueEnum, RoutingKeyEnum } from 'src/module/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.enum';
import { OrderStatusChangedEventPayload, RabbitMQConsumerMessage } from 'src/module/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.type';
import { InboxRepository } from '../../../repository/inbox.repository';
import { OrderStatusChangedService } from 'src/module/order-module/feature/order/order-status-changed/order.status.changed.service';

@Injectable()
export class OrderStatusChangedConsumer implements OnModuleInit {
    private readonly logger = new Logger(OrderStatusChangedConsumer.name);

    constructor(
        private readonly rabbitMQService: RabbitMQService,
        private readonly inboxRepository: InboxRepository,
        private readonly orderReturnService: OrderStatusChangedService,
    ) { }

    async onModuleInit() {
        await this.rabbitMQService.consumeMessages<RabbitMQConsumerMessage<OrderStatusChangedEventPayload>>(
            QueueEnum.ORDER_STATUS_CHANGED_QUEUE,
            async (data) => {
                const { outbox_uuid, payload } = data;

                this.logger.log(`Processing Order status changed: ${outbox_uuid} \n ${JSON.stringify(payload)}`);

                const alreadyProcessed = await this.inboxRepository.findByOutboxUuid(outbox_uuid);
                if (alreadyProcessed) {
                    this.logger.warn(`Duplicate skipped: ${outbox_uuid}`);
                    return;
                }

                await this.orderReturnService.OrderStatusChanged(payload);

                await this.inboxRepository.createEntry({ outbox_uuid });
            },
        );
    }
}
