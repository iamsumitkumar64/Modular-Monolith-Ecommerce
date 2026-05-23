import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RabbitMQService } from 'src/module/common/infrastruture/rabbit-mq/rabbit-mq.service';
import { ExchangeNameEnum, ExchangeTypeEnum, QueueEnum, RoutingKeyEnum } from 'src/module/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.enum';
import { InboxRepository } from '../../../repository/inbox.repo';
import { SocketService } from 'src/module/common/socket/socket.service';
import { SocketEventNameEnum } from 'src/module/common/socket/socket.enum';
import { OrderRepository } from '../../../repository/order.repo';
import { OrderPaymentStatusEnum, OrderStatusEnum } from 'src/module/shipment-server/domain/order/order.enum';

@Injectable()
export class ShipmentOrderReturnConsumer implements OnModuleInit {
    private readonly logger = new Logger(ShipmentOrderReturnConsumer.name);

    constructor(
        private readonly rabbitMQService: RabbitMQService,
        private readonly inboxRepo: InboxRepository,
        private readonly socketService: SocketService,
        private readonly orderRepo: OrderRepository,
    ) { }

    async onModuleInit() {
        await this.rabbitMQService.consumeMessages(
            QueueEnum.SHIPMENT_ORDER_RETURNED_QUEUE,
            async (data) => {
                const { outbox_uuid, payload } = data;

                this.logger.log(`Processing Order return Stock increase: ${outbox_uuid} \n ${JSON.stringify(payload)}`);

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

                // make order returned and payment returned 
                await this.orderRepo.updateOrderStatus(payload.order_uuid, OrderStatusEnum.RETURNED);
                await this.orderRepo.updateOrderPaymentStatus(payload.order_uuid, OrderPaymentStatusEnum.REFUND);

                await this.inboxRepo.createEntry({ outbox_uuid });
            },
        );
    }
}