import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { UserRepository } from '../../../repository/user.repository';
import { RabbitMQService } from 'src/module/common/infrastruture/rabbit-mq/rabbit-mq.service';
import { ExchangeNameEnum, ExchangeTypeEnum, QueueEnum, RoutingKeyEnum } from 'src/module/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.enum';
import { InboxRepository } from '../../../repository/inbox.repository';
import { UserRegisterService } from 'src/module/cart-module/feature/user/user-register/user-register.service';

@Injectable()
export class UserRegisteredConsumer implements OnModuleInit {
    private readonly logger = new Logger(UserRegisteredConsumer.name);

    constructor(
        private readonly rabbitMQService: RabbitMQService,
        private readonly inboxRepository: InboxRepository,
        private readonly userRegisterService: UserRegisterService,
    ) { }

    async onModuleInit() {
        await this.rabbitMQService.consumeMessages(
            QueueEnum.CART_USER_REGISTERED_QUEUE,
            async (data) => {
                const { outbox_uuid, payload } = data;

                this.logger.log(`Processing registered user: ${payload.email} \n ${JSON.stringify(payload)}`);

                const alreadyProcessed = await this.inboxRepository.findByOutboxUuid(outbox_uuid);
                if (alreadyProcessed) {
                    this.logger.warn(`Duplicate skipped: ${outbox_uuid}`);
                    return;
                }

                await this.userRegisterService.userRegister(payload);

                await this.inboxRepository.createEntry({ outbox_uuid });
            },
        );
    }
}