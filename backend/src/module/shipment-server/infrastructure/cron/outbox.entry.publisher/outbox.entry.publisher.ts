import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OutboxStatusEnum } from 'src/module/order-server/domain/outbox/outbox.enum';
import { RabbitMQService } from 'src/module/common/infrastruture/rabbit-mq/rabbit-mq.service';
import { OutboxRepository } from '../../repository/outbox.repo';

@Injectable()
export class OutboxEntryPublisherCronService {
    constructor(
        private readonly outboxRepo: OutboxRepository,
        private readonly rabbitMQService: RabbitMQService,
    ) { }

    private readonly logger = new Logger(OutboxEntryPublisherCronService.name,);

    @Cron(CronExpression.EVERY_SECOND)
    async handleCron() {
        // fecth top 10 pending enteries
        const pendingEntries = await this.outboxRepo.findTopTenPendingOutBoxEntries();
        if (!pendingEntries.length) { return; }

        await Promise.all(
            pendingEntries.map(async (entry) => {
                try {
                    //push to mq
                    await this.rabbitMQService.publishToExchange(
                        entry.exchange_name,
                        entry.routing_key,
                        {
                            outbox_uuid: entry.uuid,
                            payload: entry.message_payload,
                        },
                    );

                    // make entry success
                    await this.outboxRepo.updateStatus(entry.uuid, OutboxStatusEnum.PUBLISHED,);
                } catch (error) {
                    this.logger.error(`Failed to publish outbox entry: ${entry.uuid}`,);

                    //make entry failed
                    await this.outboxRepo.updateStatus(entry.uuid, OutboxStatusEnum.FAILED,);
                }
            }),
        );
    }
}