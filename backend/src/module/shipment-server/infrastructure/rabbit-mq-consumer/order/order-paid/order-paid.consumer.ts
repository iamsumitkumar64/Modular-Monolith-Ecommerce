import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RabbitMQService } from 'src/module/common/infrastruture/rabbit-mq/rabbit-mq.service';
import { ExchangeNameEnum, ExchangeTypeEnum, QueueEnum, RoutingKeyEnum } from 'src/module/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.enum';
import { InboxRepository } from '../../../repository/inbox.repo';
import { OrderRepository } from '../../../repository/order.repo';
import { OrderPaymentStatusEnum, } from 'src/module/order-server/domain/order/order.enum';

@Injectable()
export class OrderPaidConsumer implements OnModuleInit {
    private readonly logger = new Logger(OrderPaidConsumer.name);

    constructor(
        private readonly rabbitMQService: RabbitMQService,
        private readonly inboxRepo: InboxRepository,
        private readonly orderRepo: OrderRepository,
    ) { }

    async onModuleInit() {
        await this.rabbitMQService.consumeMessages(
            QueueEnum.SHIPMENT_ORDER_PAID_QUEUE,
            async (data) => {
                const { outbox_uuid, payload } = data;

                this.logger.log(`Processing Order Paid: ${outbox_uuid} \n ${JSON.stringify(payload)}`);

                const alreadyProcessed = await this.inboxRepo.findByOutboxUuid(outbox_uuid);
                if (alreadyProcessed) {
                    this.logger.warn(`Duplicate skipped: ${outbox_uuid}`);
                    return;
                }

                await this.orderRepo.updateOrderPaymentStatus(payload.order_uuid, OrderPaymentStatusEnum.PAID)

                await this.inboxRepo.createEntry({ outbox_uuid });
            },
        );
    }
}