import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RabbitMQService } from 'src/module/common/infrastruture/rabbit-mq/rabbit-mq.service';
import { ExchangeNameEnum, ExchangeTypeEnum, QueueEnum, RoutingKeyEnum } from 'src/module/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.enum';
import { InboxRepository } from '../../../repository/inbox.repo';
import { OrderRepository } from '../../../repository/order.repo';
import { OrderPaymentStatusEnum, } from 'src/module/order-server/domain/order/order.enum';
import { OutboxRepository } from '../../../repository/outbox.repo';

@Injectable()
export class OrderPaidConsumer implements OnModuleInit {
    private readonly logger = new Logger(OrderPaidConsumer.name);

    constructor(
        private readonly rabbitMQService: RabbitMQService,
        private readonly inboxRepo: InboxRepository,
        private readonly orderRepo: OrderRepository,
        private readonly outboxRepo: OutboxRepository,
    ) { }

    async onModuleInit() {
        await this.rabbitMQService.consumeMessages(
            QueueEnum.ORDER_PAID_QUEUE,
            async (data) => {
                const { outbox_uuid, payload } = data;

                this.logger.log(`Processing Order Paid: ${outbox_uuid} \n ${JSON.stringify(payload)}`);

                const alreadyProcessed = await this.inboxRepo.findByOutboxUuid(outbox_uuid);
                if (alreadyProcessed) {
                    this.logger.warn(`Duplicate skipped: ${outbox_uuid}`);
                    return;
                }

                const isOrderExists = await this.orderRepo.findByUuid(payload.order_uuid);
                if (!isOrderExists) {
                    this.logger.warn(`Order not found so skipped: ${payload.order_uuid}`);
                    return;
                }
console.log('sumit',JSON.stringify(isOrderExists));
                await this.orderRepo.updateOrderPaymentStatus(payload.order_uuid, OrderPaymentStatusEnum.PAID)

                await this.outboxRepo.createOutboxntry({
                    exchange_name: ExchangeNameEnum.ORDER_EXCHANGE,
                    routing_key: RoutingKeyEnum.ORDER_PAID_DEDUCT_STOCK,
                    message_payload: {
                        order_uuid: payload.order_uuid,
                        order: isOrderExists
                    }
                });

                await this.inboxRepo.createEntry({ outbox_uuid });
            },
        );
    }
}