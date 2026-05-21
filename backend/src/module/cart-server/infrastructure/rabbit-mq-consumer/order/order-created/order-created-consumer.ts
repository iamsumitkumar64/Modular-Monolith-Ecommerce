import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { UserRepository } from '../../../repository/user.repo';
import { RabbitMQService } from 'src/module/common/infrastruture/rabbit-mq/rabbit-mq.service';
import { ExchangeNameEnum, ExchangeTypeEnum, QueueEnum, RoutingKeyEnum } from 'src/module/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.enum';
import { InboxRepository } from '../../../repository/inbox.repo';
import { CartRepository } from '../../../repository/cart.repo';

@Injectable()
export class OrderCreatedConsumer implements OnModuleInit {
    private readonly logger = new Logger(OrderCreatedConsumer.name);

    constructor(
        private readonly rabbitMQService: RabbitMQService,
        private readonly userRepo: UserRepository,
        private readonly inboxRepo: InboxRepository,
        private readonly cartRepo: CartRepository,
    ) { }

    async onModuleInit() {
        await this.rabbitMQService.consumeMessages(
            QueueEnum.CART_ORDER_CREATED_QUEUE,
            async (data) => {
                const { outbox_uuid, payload } = data;

                this.logger.log(`Processing Order created: ${outbox_uuid}\n ${JSON.stringify(payload)}`);

                const alreadyProcessed = await this.inboxRepo.findByOutboxUuid(outbox_uuid);
                if (alreadyProcessed) {
                    this.logger.warn(`Duplicate skipped: ${outbox_uuid}`);
                    return;
                }

                await this.cartRepo.deleteCart(payload.cart_uuid);
                await this.cartRepo.createCart({ user_uuid: payload.user_uuid });

                await this.inboxRepo.createEntry({ outbox_uuid });
            },
        );
    }
}