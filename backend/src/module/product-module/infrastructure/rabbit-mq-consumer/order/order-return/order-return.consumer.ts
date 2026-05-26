import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RabbitMQService } from 'src/module/common/infrastruture/rabbit-mq/rabbit-mq.service';
import { ExchangeNameEnum, ExchangeTypeEnum, QueueEnum, RoutingKeyEnum } from 'src/module/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.enum';
import { OrderWithDetailsEventPayload, RabbitMQConsumerMessage } from 'src/module/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.type';
import { InboxRepository } from '../../../repository/inbox.repository';
import { OrderReturnService } from 'src/module/product-module/feature/order/order-return/order.return.service';

@Injectable()
export class ProductOrderReturnConsumer implements OnModuleInit {
    private readonly logger = new Logger(ProductOrderReturnConsumer.name);

    constructor(
        private readonly rabbitMQService: RabbitMQService,
        private readonly inboxRepository: InboxRepository,
        private readonly orderReturnService: OrderReturnService,
    ) { }

    async onModuleInit() {
        await this.rabbitMQService.consumeMessages<RabbitMQConsumerMessage<OrderWithDetailsEventPayload>>(
            QueueEnum.PRODUCT_ORDER_RETURNED_QUEUE,
            async (data) => {
                const { outbox_uuid, payload } = data;

                this.logger.log(`Processing Order return Stock increase: ${outbox_uuid} \n ${JSON.stringify(payload)}`);

                const alreadyProcessed = await this.inboxRepository.findByOutboxUuid(outbox_uuid);
                if (alreadyProcessed) {
                    this.logger.warn(`Duplicate skipped: ${outbox_uuid}`);
                    return;
                }

                const order = payload.order;

                if (!order || !order.items) {
                    this.logger.error(`Order data missing or invalid for outbox: ${outbox_uuid}`);
                    return;
                }

                await this.orderReturnService.orderReturn(order);

                await this.inboxRepository.createEntry({ outbox_uuid });
            },
        );
    }
}
