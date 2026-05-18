import { Global, Module } from '@nestjs/common';
// Common Service
import { RabbitMQService } from './rabbit-mq.service';

// User Service
import * as UserServerUserRepo from 'src/module/user-server/infrastructure/repository/user.repo';

// Product Service
import * as ProductServerUserRepo from 'src/module/product-server/infrastructure/repository/user.repo';
import * as ProductServerInboxRepo from 'src/module/product-server/infrastructure/repository/inbox.repo';
import * as ProductUserConsumer from 'src/module/product-server/infrastructure/rabbit-mq-consumer/user/user-registered/user-registered.consumer';

// Cart Service
import * as CartServerUserRepo from 'src/module/cart-server/infrastructure/repository/user.repo';
import * as CartServerInboxRepo from 'src/module/cart-server/infrastructure/repository/inbox.repo';
import * as CartUserConsumer from 'src/module/cart-server/infrastructure/rabbit-mq-consumer/user/user-registered/user-registered.consumer';

@Global()
@Module({
    imports: [],
    providers: [
        // Common Service
        RabbitMQService,

        // User Service
        UserServerUserRepo.UserRepository,

        // Product Service
        ProductServerUserRepo.UserRepository,
        ProductServerInboxRepo.InboxRepository,
        ProductUserConsumer.UserRegisteredConsumer,

        // Cart Service
        CartServerUserRepo.UserRepository,
        CartServerInboxRepo.InboxRepository,
        CartUserConsumer.UserRegisteredConsumer,
    ],
    exports: [RabbitMQService],
})
export class RabbitMQModule { }