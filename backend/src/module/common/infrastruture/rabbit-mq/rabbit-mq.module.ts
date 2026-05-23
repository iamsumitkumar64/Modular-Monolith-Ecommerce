import { Global, Module } from '@nestjs/common';
// Common Service
import { RabbitMQService } from './rabbit-mq.service';

// User Service
import * as UserServerUserRepo from 'src/module/user-server/infrastructure/repository/user.repo';

// Product Service
import * as ProductServerUserRepo from 'src/module/product-server/infrastructure/repository/user.repo';
import * as ProductServerProductRepo from 'src/module/product-server/infrastructure/repository/product.repo';
import * as ProductServerInboxRepo from 'src/module/product-server/infrastructure/repository/inbox.repo';
import * as ProductUserConsumer from 'src/module/product-server/infrastructure/rabbit-mq-consumer/user/user-registered/user-registered.consumer';
import * as ProductOrderPaidDeductConsumer from 'src/module/product-server/infrastructure/rabbit-mq-consumer/order/order-paid-deduct-stock/order-paid-deduct-stock.consumer';
import * as ProductOrderReturnConsumer from 'src/module/product-server/infrastructure/rabbit-mq-consumer/order/order-return/order-return.consumer';

// Cart Service
import * as CartServerUserRepo from 'src/module/cart-server/infrastructure/repository/user.repo';
import * as CartServerCartRepo from 'src/module/cart-server/infrastructure/repository/cart.repo';
import * as OrderServerProductRepo from 'src/module/cart-server/infrastructure/repository/product.repo';
import * as CartServerInboxRepo from 'src/module/cart-server/infrastructure/repository/inbox.repo';
import * as CartUserConsumer from 'src/module/cart-server/infrastructure/rabbit-mq-consumer/user/user-registered/user-registered.consumer';
import * as CartOrderCreatedConsumer from 'src/module/cart-server/infrastructure/rabbit-mq-consumer/order/order-created/order-created-consumer';
import * as OrderOrderPaidDeductConsumer from 'src/module/cart-server/infrastructure/rabbit-mq-consumer/order/order-paid-deduct-stock/order-paid-deduct-stock.consumer';
import * as CartOrderReturnConsumer from 'src/module/cart-server/infrastructure/rabbit-mq-consumer/order/order-return/order-return.consumer';

// Order Service
import * as OrderServerUserRepo from 'src/module/order-server/infrastructure/repository/user.repo';
import * as OrderServerInboxRepo from 'src/module/order-server/infrastructure/repository/inbox.repo';
import * as OrderServerOrderRepo from 'src/module/order-server/infrastructure/repository/order.repo';
import * as OrderServerOutboxRepo from 'src/module/order-server/infrastructure/repository/outbox.repo';
import * as OrderUserConsumer from 'src/module/order-server/infrastructure/rabbit-mq-consumer/user/user-registered/user-registered.consumer';
import * as OrderPaidConsumer from 'src/module/order-server/infrastructure/rabbit-mq-consumer/order/order-paid/order-paid.consumer';
import * as OrderStatusChangedConsumer from 'src/module/order-server/infrastructure/rabbit-mq-consumer/order/order-status-changed/order-status-changed.consumer';
import * as OrderReturnConsumer from 'src/module/order-server/infrastructure/rabbit-mq-consumer/order/order-return/order-return.consumer';

// finance Service
import * as FinanceServerUserRepo from 'src/module/finance-server/infrastructure/repository/user.repo';
import * as FinanceServerInboxRepo from 'src/module/finance-server/infrastructure/repository/inbox.repo';
import * as FinanceServerFinanceRepo from 'src/module/finance-server/infrastructure/repository/finance.repo';
import * as FinanceUserConsumer from 'src/module/finance-server/infrastructure/rabbit-mq-consumer/user/user-registered/user-registered.consumer';
import * as FinanceOrderReturnConsumer from 'src/module/finance-server/infrastructure/rabbit-mq-consumer/order/order-return/order-return.consumer';

// shipment Service
import * as ShipmentServerUserRepo from 'src/module/shipment-server/infrastructure/repository/user.repo';
import * as ShipmentServerInboxRepo from 'src/module/shipment-server/infrastructure/repository/inbox.repo';
import * as ShipmentOrderRepository from 'src/module/shipment-server/infrastructure/repository/order.repo';
import * as ShipmentOrderItemRepository from 'src/module/shipment-server/infrastructure/repository/order.item.repo';
import * as ShipmentUserConsumer from 'src/module/shipment-server/infrastructure/rabbit-mq-consumer/user/user-registered/user-registered.consumer';
import * as ShipentOrderCreatedConsumer from 'src/module/shipment-server/infrastructure/rabbit-mq-consumer/order/order-created/order-created-consumer';
import * as ShipmentOrderPaidConsumer from 'src/module/shipment-server/infrastructure/rabbit-mq-consumer/order/order-paid/order-paid.consumer';
import * as ShipmentOrderReturnConsumer from 'src/module/shipment-server/infrastructure/rabbit-mq-consumer/order/order-return/order-return.consumer';

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
        ProductServerProductRepo.ProductRepository,
        ProductServerInboxRepo.InboxRepository,
        ProductUserConsumer.UserRegisteredConsumer,
        ProductOrderPaidDeductConsumer.ProductOrderPaidDeductStockConsumer,
        ProductOrderReturnConsumer.ProductOrderReturnConsumer,

        // Cart Service
        CartServerUserRepo.UserRepository,
        CartServerCartRepo.CartRepository,
        OrderServerProductRepo.ProductRepository,
        CartServerInboxRepo.InboxRepository,
        CartUserConsumer.UserRegisteredConsumer,
        CartOrderCreatedConsumer.OrderCreatedConsumer,
        OrderOrderPaidDeductConsumer.CartOrderPaidDeductStockConsumer,
        CartOrderReturnConsumer.ProductOrderReturnConsumer,

        // order Service
        OrderServerUserRepo.UserRepository,
        OrderServerInboxRepo.InboxRepository,
        OrderServerOutboxRepo.OutboxRepository,
        OrderServerOrderRepo.OrderRepository,
        OrderPaidConsumer.OrderPaidConsumer,
        OrderUserConsumer.UserRegisteredConsumer,
        OrderStatusChangedConsumer.OrderStatusChangedConsumer,
        OrderReturnConsumer.OrderOrderReturnConsumer,

        // finance Service
        FinanceServerUserRepo.UserRepository,
        FinanceServerInboxRepo.InboxRepository,
        FinanceServerFinanceRepo.FinanceRepository,
        FinanceUserConsumer.UserRegisteredConsumer,
        FinanceOrderReturnConsumer.FinanceOrderReturnConsumer,

        // shipment Service
        ShipmentServerUserRepo.UserRepository,
        ShipmentServerInboxRepo.InboxRepository,
        ShipmentUserConsumer.UserRegisteredConsumer,
        ShipentOrderCreatedConsumer.OrderCreatedConsumer,
        ShipmentOrderRepository.OrderRepository,
        ShipmentOrderItemRepository.OrderItemRepository,
        ShipmentOrderPaidConsumer.OrderPaidConsumer,
        ShipmentOrderReturnConsumer.ShipmentOrderReturnConsumer,
    ],
    exports: [RabbitMQService],
})
export class RabbitMQModule { }