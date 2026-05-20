import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { UserRepository } from '../../../repository/user.repo';
import { RabbitMQService } from 'src/module/common/infrastruture/rabbit-mq/rabbit-mq.service';
import { ExchangeNameEnum, ExchangeTypeEnum, QueueEnum, RoutingKeyEnum } from 'src/module/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.enum';
import { InboxRepository } from '../../../repository/inbox.repo';

@Injectable()
export class UserRegisteredConsumer implements OnModuleInit {
    private readonly logger = new Logger(UserRegisteredConsumer.name);

    constructor(
        private readonly rabbitMQService: RabbitMQService,
        private readonly userRepo: UserRepository,
        private readonly inboxRepo: InboxRepository,
    ) { }

    async onModuleInit() {
        await this.rabbitMQService.consumeMessages(
            QueueEnum.PRODUCT_USER_REGISTERED_QUEUE,
            async (data) => {
                const { outbox_uuid, payload } = data;

                this.logger.log(`Processing registered user: ${payload.email} \n ${JSON.stringify(payload)}`);

                const alreadyProcessed = await this.inboxRepo.findByOutboxUuid(outbox_uuid);
                if (alreadyProcessed) {
                    this.logger.warn(`Duplicate skipped: ${outbox_uuid}`);
                    return;
                }

                const isUserExists = await this.userRepo.findByEmail(payload.email);
                if (isUserExists.length) {
                    this.logger.warn(`Duplicate skipped: ${isUserExists[0].email}`);
                    return;
                }

                await this.userRepo.register(payload);
                await this.inboxRepo.createEntry({ outbox_uuid });
            },
        );
    }
}