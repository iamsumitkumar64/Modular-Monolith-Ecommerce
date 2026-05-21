import { Global, Module } from '@nestjs/common';
import { PaidOrderStatusCronService } from './order-status-cron/order-status-cron';
import { OrderRepository } from '../repository/order.repo';
import { OutboxEntryPublisherCronService } from './outbox.entry.publisher/outbox.entry.publisher';
import { OutboxRepository } from '../repository/outbox.repo';

@Global()
@Module({
    providers: [
        OutboxRepository,
        PaidOrderStatusCronService,
        OrderRepository,
        OutboxEntryPublisherCronService
    ],
    exports: [],
})
export class CronModule { }