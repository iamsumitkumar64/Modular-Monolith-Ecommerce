import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RabbitMQService } from 'src/module/common/infrastruture/rabbit-mq/rabbit-mq.service';
import { ExchangeNameEnum, ExchangeTypeEnum, QueueEnum, RoutingKeyEnum } from 'src/module/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.enum';
import { InboxRepository } from '../../../repository/inbox.repo';
import { ProductRepository } from '../../../repository/product.repo';
import { SocketService } from 'src/module/common/socket/socket.service';
import { SocketEventNameEnum } from 'src/module/common/socket/socket.enum';

@Injectable()
export class ProductOrderPaidDeductStockConsumer implements OnModuleInit {
    private readonly logger = new Logger(ProductOrderPaidDeductStockConsumer.name);

    constructor(
        private readonly rabbitMQService: RabbitMQService,
        private readonly inboxRepo: InboxRepository,
        private readonly productRepo: ProductRepository,
        private readonly socketService: SocketService,
    ) { }

    async onModuleInit() {
        await this.rabbitMQService.consumeMessages(
            QueueEnum.PRODUCT_ORDER_PAID_DEDUCT_STOCK_QUEUE,
            async (data) => {
                const { outbox_uuid, payload } = data;

                this.logger.log(`Processing Order Deduct Stock: ${outbox_uuid} \n ${JSON.stringify(payload)}`);

                const alreadyProcessed = await this.inboxRepo.findByOutboxUuid(outbox_uuid);
                if (alreadyProcessed) {
                    this.logger.warn(`Duplicate skipped: ${outbox_uuid}`);
                    return;
                }

                const order = payload.order;

                if (!order || !order.items) {
                    this.logger.error(`Order data missing or invalid for outbox: ${outbox_uuid}`);
                    return;
                }

                // Deduct stock one by one
                const deductions = order.items.map(async (item) => {
                    try {
                        await this.productRepo.deductStock(item.product_uuid, item.quantity);
                        this.logger.log(`Deducted ${item.quantity} from ${item.name} (UUID: ${item.product_uuid})`);
                    } catch (err: any) {
                        this.logger.error(`Failed to deduct stock for ${item.name}: ${err.message}`);
                    }
                });

                await Promise.all(deductions);
                await this.socketService.emitToUser(order.user_uuid, SocketEventNameEnum.PRODUCT_STOCK_DEDUCT, order.items);

                await this.inboxRepo.createEntry({ outbox_uuid });
            },
        );
    }
}