import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RabbitMQService } from 'src/module/common/infrastruture/rabbit-mq/rabbit-mq.service';
import { ExchangeNameEnum, ExchangeTypeEnum, QueueEnum, RoutingKeyEnum } from 'src/module/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.enum';
import { OrderWithDetailsEventPayload, RabbitMQConsumerMessage } from 'src/module/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.type';
import { InboxRepository } from '../../../repository/inbox.repository';
import { OrderPaidDeductStockService } from 'src/module/cart-module/feature/order/order-paid-deduct-stock/order.paid.deduct.stock.service';

@Injectable()
export class CartOrderPaidDeductStockConsumer implements OnModuleInit {
    private readonly logger = new Logger(CartOrderPaidDeductStockConsumer.name);

    constructor(
        private readonly rabbitMQService: RabbitMQService,
        private readonly inboxRepository: InboxRepository,
        private readonly orderPaidDeductStock: OrderPaidDeductStockService,
    ) { }

    async onModuleInit() {
        await this.rabbitMQService.consumeMessages<RabbitMQConsumerMessage<OrderWithDetailsEventPayload>>(
            QueueEnum.CART_ORDER_PAID_DEDUCT_STOCK_QUEUE,
            async (data) => {
                const { outbox_uuid, payload } = data;

                this.logger.log(`Processing Order Deduct Stock: ${outbox_uuid} \n ${JSON.stringify(payload)}`);

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

                await this.orderPaidDeductStock.orderPaidDeductStock(order);

                await this.inboxRepository.createEntry({ outbox_uuid });
            },
        );
    }
}