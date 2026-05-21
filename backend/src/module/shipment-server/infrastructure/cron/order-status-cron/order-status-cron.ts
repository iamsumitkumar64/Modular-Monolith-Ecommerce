import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OrderRepository } from '../../repository/order.repo';

import {
    OrderPaymentStatusEnum,
    OrderStatusEnum,
} from 'src/module/shipment-server/domain/order/order.enum';
import { OutboxRepository } from '../../repository/outbox.repo';
import { ExchangeNameEnum, RoutingKeyEnum } from 'src/module/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.enum';
import { SocketService } from 'src/module/common/socket/socket.service';

@Injectable()
export class PaidOrderStatusCronService {
    constructor(
        private readonly orderRepo: OrderRepository,
        private readonly outboxRepo: OutboxRepository,
        private readonly socketService: SocketService,
    ) { }

    private readonly logger = new Logger(PaidOrderStatusCronService.name);

    @Cron(CronExpression.EVERY_5_SECONDS)
    async handleCron() {
        // Fetch top 10 paid orders
        const orders = await this.orderRepo.findTopTenPaidButNotDeliveredOrderStatus();

        if (!orders.length) {
            return;
        }

        for (const order of orders) {
            let nextStatus: OrderStatusEnum | null = null;

            switch (order.order_status) {
                case OrderStatusEnum.PENDING:
                    nextStatus = OrderStatusEnum.PROCESSING;
                    break;

                case OrderStatusEnum.PROCESSING:
                    nextStatus = OrderStatusEnum.PACKED;
                    break;

                case OrderStatusEnum.PACKED:
                    nextStatus = OrderStatusEnum.DELIVERED;
                    break;

                case OrderStatusEnum.DELIVERED:
                    nextStatus = null;
                    break;
            }

            if (nextStatus) {
                await this.orderRepo.updateOrderStatus(
                    order.uuid,
                    nextStatus,
                );

                const payload = {
                    order_uuid: order.uuid,
                    nextStatus,
                };

                await this.outboxRepo.createOutboxntry({
                    exchange_name: ExchangeNameEnum.ORDER_EXCHANGE,
                    routing_key: RoutingKeyEnum.ORDER_STATUS_CHANGED,
                    message_payload: payload,
                });

                await this.socketService.emitToUser(order.user_uuid, 'order_status_changed', payload);

                this.logger.log(
                    `Order ${order.uuid} updated from ${order.order_status} to ${nextStatus}`,
                );
            }
        }
    }
}