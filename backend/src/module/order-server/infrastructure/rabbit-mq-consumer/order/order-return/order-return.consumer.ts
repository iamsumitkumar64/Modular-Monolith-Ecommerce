import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RabbitMQService } from 'src/module/common/infrastruture/rabbit-mq/rabbit-mq.service';
import { QueueEnum } from 'src/module/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.enum';
import { OrderPaymentStatusEnum, OrderStatusEnum } from 'src/module/order-server/domain/order/order.enum';
import { InboxRepository } from '../../../repository/inbox.repo';
import { OrderRepository } from '../../../repository/order.repo';

@Injectable()
export class OrderOrderReturnConsumer implements OnModuleInit {
    private readonly logger = new Logger(OrderOrderReturnConsumer.name);

    constructor(
        private readonly rabbitMQService: RabbitMQService,
        private readonly inboxRepo: InboxRepository,
        private readonly orderRepo: OrderRepository,
    ) { }

    async onModuleInit() {
        await this.rabbitMQService.consumeMessages(
            QueueEnum.ORDER_RETURNED_QUEUE,
            async (data) => {
                const { outbox_uuid, payload } = data;

                this.logger.log(`Processing Order return status change: ${outbox_uuid} \n ${JSON.stringify(payload)}`);

                const alreadyProcessed = await this.inboxRepo.findByOutboxUuid(outbox_uuid);
                if (alreadyProcessed) {
                    this.logger.warn(`Duplicate skipped: ${outbox_uuid}`);
                    return;
                }

                const order = payload.order;

                if (!order?.uuid) {
                    this.logger.error(`Order data missing or invalid for outbox: ${outbox_uuid}`);
                    return;
                }

                if (order.returned_from_status) {
                    await this.orderRepo.updateReturnedFromStatus(order.uuid, order.returned_from_status);
                }
                await this.orderRepo.updateOrderStatus(order.uuid, OrderStatusEnum.RETURNED);
                await this.orderRepo.updateOrderPaymentStatus(order.uuid, OrderPaymentStatusEnum.REFUND);

                await this.inboxRepo.createEntry({ outbox_uuid });
            },
        );
    }
}
