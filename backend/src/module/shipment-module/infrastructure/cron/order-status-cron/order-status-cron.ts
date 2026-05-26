import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OrderRepository } from '../../repository/order.repository';

import {
    OrderPaymentStatusEnum,
    OrderStatusEnum,
} from 'src/module/shipment-module/domain/order/order.enum';
import { OutboxRepository } from '../../repository/outbox.repository';
import { ExchangeNameEnum, RoutingKeyEnum } from 'src/module/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.enum';
import { SocketService } from 'src/module/common/infrastruture/socket/socket.service';
import { SocketEventNameEnum } from 'src/module/common/infrastruture/socket/socket.enum';

@Injectable()
export class PaidOrderStatusCronService {
    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly outboxRepository: OutboxRepository,
        private readonly socketService: SocketService,
    ) { }

    private readonly logger = new Logger(PaidOrderStatusCronService.name);

    @Cron(process.env.SHIPMENT_ORDER_STATUS_CRON_TIMER || CronExpression.EVERY_30_SECONDS)
    async handleCron() {
        // Fetch top 10 paid orders
        const orders = await this.orderRepository.findTopTenPaidButNotDeliveredOrderStatus();

        if (!orders.length) {
            return;
        }

        for (const order of orders) {
            if (order.order_status == OrderStatusEnum.RETURNED) {
                this.logger.log(`Order Returned so can't process it`);
            }

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
                const updateResult = await this.orderRepository.updateOrderStatusIfNotReturned(
                    order.uuid,
                    nextStatus,
                );

                if (!updateResult.affected) {
                    this.logger.log(`Order ${order.uuid} was returned before cron update`);
                    continue;
                }

                const payload = {
                    order_uuid: order.uuid,
                    nextStatus,
                };

                await this.outboxRepository.createOutboxntry({
                    exchange_name: ExchangeNameEnum.ORDER_EXCHANGE,
                    routing_key: RoutingKeyEnum.ORDER_STATUS_CHANGED,
                    message_payload: payload,
                });

                await this.socketService.emitToUser(order.user_uuid, SocketEventNameEnum.ORDER_STATUS_CHANGED, payload);

                this.logger.log(
                    `Order ${order.uuid} updated from ${order.order_status} to ${nextStatus}`,
                );
            }
        }
    }
}