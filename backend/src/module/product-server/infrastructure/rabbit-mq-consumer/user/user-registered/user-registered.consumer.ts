import { Injectable, Logger, OnModuleInit, Inject } from '@nestjs/common';
import { UserRepository } from '../../../repository/user.repo';
import { RabbitMQService } from 'src/common/infrastruture/rabbit-mq/rabbit-mq.service';
import { ExchangeNameEnum, ExchangeTypeEnum, QueueEnum, RoutingKeyEnum } from 'src/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.enum';
import { InboxRepository } from '../../../repository/inbox.repo';
import { PRODUCT_USER_REPOSITORY, PRODUCT_INBOX_REPOSITORY } from 'src/common/infrastruture/rabbit-mq/rabbit-mq.module';

@Injectable()
export class UserRegisteredConsumer implements OnModuleInit {
    private readonly logger = new Logger(UserRegisteredConsumer.name);

    constructor(
        private readonly rabbitMQService: RabbitMQService,
        @Inject(PRODUCT_USER_REPOSITORY) private readonly userRepo: UserRepository,
        @Inject(PRODUCT_INBOX_REPOSITORY) private readonly inboxRepo: InboxRepository,
    ) { }

    async onModuleInit() {
        await this.rabbitMQService.consumeMessages(
            QueueEnum.USER_REGISTERED_QUEUE,
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