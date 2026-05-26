import { Global, Module } from '@nestjs/common';
// Common Service
import { RabbitMQService } from './rabbit-mq.service';

// User Service
import * as UsermoduleUserRepo from 'src/module/user-module/infrastructure/repository/user.repository';

// Product Service
import * as ProductmoduleUserRepo from 'src/module/product-module/infrastructure/repository/user.repository';
import * as ProductmoduleProductRepo from 'src/module/product-module/infrastructure/repository/product.repository';
import * as ProductmoduleInboxRepo from 'src/module/product-module/infrastructure/repository/inbox.repository';
import * as ProductUserRegisterService from 'src/module/product-module/feature/user/user-register/user-register.service';
import * as ProductOrderPaidDeductStockService from 'src/module/product-module/feature/order/order-paid-deduct-stock/order.paid.deduct.stock.service';
import * as ProductOrderReturnService from 'src/module/product-module/feature/order/order-return/order.return.service';
import * as ProductUserConsumer from 'src/module/product-module/infrastructure/rabbit-mq-consumer/user/user-registered/user-registered.consumer';
import * as ProductOrderPaidDeductConsumer from 'src/module/product-module/infrastructure/rabbit-mq-consumer/order/order-paid-deduct-stock/order-paid-deduct-stock.consumer';
import * as ProductOrderReturnConsumer from 'src/module/product-module/infrastructure/rabbit-mq-consumer/order/order-return/order-return.consumer';

// Cart Service
import * as CartmoduleUserRepo from 'src/module/cart-module/infrastructure/repository/user.repository';
import * as CartmoduleCartRepo from 'src/module/cart-module/infrastructure/repository/cart.repository';
import * as CartOrdermoduleProductRepo from 'src/module/cart-module/infrastructure/repository/product.repository';
import * as CartmoduleInboxRepo from 'src/module/cart-module/infrastructure/repository/inbox.repository';
import * as CartOrderCreateService from 'src/module/cart-module/feature/order/order-create/order.create.service';
import * as CartOrderReturnService from 'src/module/cart-module/feature/order/order-return/order.return.service';
import * as CartUserRegisterService from 'src/module/cart-module/feature/user/user-register/user-register.service';
import * as CartOrderPaidDeductStockService from 'src/module/cart-module/feature/order/order-paid-deduct-stock/order.paid.deduct.stock.service';
import * as CartUserConsumer from 'src/module/cart-module/infrastructure/rabbit-mq-consumer/user/user-registered/user-registered.consumer';
import * as CartOrderCreatedConsumer from 'src/module/cart-module/infrastructure/rabbit-mq-consumer/order/order-created/order-created-consumer';
import * as CartOrderPaidDeductConsumer from 'src/module/cart-module/infrastructure/rabbit-mq-consumer/order/order-paid-deduct-stock/order-paid-deduct-stock.consumer';
import * as CartOrderReturnConsumer from 'src/module/cart-module/infrastructure/rabbit-mq-consumer/order/order-return/order-return.consumer';

// Order Service
import * as OrdermoduleUserRepo from 'src/module/order-module/infrastructure/repository/user.repository';
import * as OrdermoduleInboxRepo from 'src/module/order-module/infrastructure/repository/inbox.repository';
import * as OrdermoduleOrderRepo from 'src/module/order-module/infrastructure/repository/order.repository';
import * as OrdermoduleOutboxRepo from 'src/module/order-module/infrastructure/repository/outbox.repository';
import * as OrderUserRegisterService from 'src/module/order-module/feature/user/user-register/user-register.service';
import * as OrderPaidService from 'src/module/order-module/feature/order/order-paid/order-paid.service';
import * as OrderReturnService from 'src/module/order-module/feature/order/order-return/order.return.service';
import * as OrderStatusChangedService from 'src/module/order-module/feature/order/order-status-changed/order.status.changed.service';
import * as OrderUserConsumer from 'src/module/order-module/infrastructure/rabbit-mq-consumer/user/user-registered/user-registered.consumer';
import * as OrderPaidConsumer from 'src/module/order-module/infrastructure/rabbit-mq-consumer/order/order-paid/order-paid.consumer';
import * as OrderStatusChangedConsumer from 'src/module/order-module/infrastructure/rabbit-mq-consumer/order/order-status-changed/order-status-changed.consumer';
import * as OrderReturnConsumer from 'src/module/order-module/infrastructure/rabbit-mq-consumer/order/order-return/order-return.consumer';

// finance Service
import * as FinancemoduleUserRepo from 'src/module/finance-module/infrastructure/repository/user.repository';
import * as FinancemoduleInboxRepo from 'src/module/finance-module/infrastructure/repository/inbox.repository';
import * as FinancemoduleFinanceRepo from 'src/module/finance-module/infrastructure/repository/finance.repository';
import * as FinanceUserRegisterService from 'src/module/finance-module/feature/user/user-register/user-register.service';
import * as FinanceOrderReturnService from 'src/module/finance-module/feature/order/order-return/order.return.service';
import * as FinanceUserConsumer from 'src/module/finance-module/infrastructure/rabbit-mq-consumer/user/user-registered/user-registered.consumer';
import * as FinanceOrderReturnConsumer from 'src/module/finance-module/infrastructure/rabbit-mq-consumer/order/order-return/order-return.consumer';

// shipment Service
import * as ShipmentmoduleUserRepo from 'src/module/shipment-module/infrastructure/repository/user.repository';
import * as ShipmentmoduleInboxRepo from 'src/module/shipment-module/infrastructure/repository/inbox.repository';
import * as ShipmentOrderRepository from 'src/module/shipment-module/infrastructure/repository/order.repository';
import * as ShipmentUserRegisterService from 'src/module/shipment-module/feature/user/user-register/user-register.service';
import * as ShipmentOrderPaidService from 'src/module/shipment-module/feature/order/order-paid/order.paid.service';
import * as ShipmentOrderCreatedService from 'src/module/shipment-module/feature/order/order-created/order.created.service';
import * as ShipmentOrderItemRepository from 'src/module/shipment-module/infrastructure/repository/order.item.repository';
import * as ShipmentUserConsumer from 'src/module/shipment-module/infrastructure/rabbit-mq-consumer/user/user-registered/user-registered.consumer';
import * as ShipentOrderCreatedConsumer from 'src/module/shipment-module/infrastructure/rabbit-mq-consumer/order/order-created/order-created-consumer';
import * as ShipmentOrderPaidConsumer from 'src/module/shipment-module/infrastructure/rabbit-mq-consumer/order/order-paid/order-paid.consumer';

@Global()
@Module({
    imports: [],
    providers: [
        // Common Service
        RabbitMQService,

        // User Service
        UsermoduleUserRepo.UserRepository,

        // Product Service
        ProductmoduleUserRepo.UserRepository,
        ProductmoduleProductRepo.ProductRepository,
        ProductmoduleInboxRepo.InboxRepository,
        ProductUserRegisterService.UserRegisterService,
        ProductOrderPaidDeductStockService.OrderPaidDeductStockService,
        ProductOrderReturnService.OrderReturnService,
        ProductUserConsumer.UserRegisteredConsumer,
        ProductOrderPaidDeductConsumer.ProductOrderPaidDeductStockConsumer,
        ProductOrderReturnConsumer.ProductOrderReturnConsumer,

        // Cart Service
        CartmoduleUserRepo.UserRepository,
        CartmoduleCartRepo.CartRepository,
        CartOrdermoduleProductRepo.ProductRepository,
        CartmoduleInboxRepo.InboxRepository,
        CartOrderReturnService.OrderReturnService,
        CartOrderCreateService.OrderCreateService,
        CartUserRegisterService.UserRegisterService,
        CartOrderPaidDeductStockService.OrderPaidDeductStockService,
        CartUserConsumer.UserRegisteredConsumer,
        CartOrderCreatedConsumer.OrderCreatedConsumer,
        CartOrderPaidDeductConsumer.CartOrderPaidDeductStockConsumer,
        CartOrderReturnConsumer.ProductOrderReturnConsumer,

        // order Service
        OrdermoduleUserRepo.UserRepository,
        OrdermoduleInboxRepo.InboxRepository,
        OrdermoduleOutboxRepo.OutboxRepository,
        OrdermoduleOrderRepo.OrderRepository,
        OrderUserRegisterService.UserRegisterService,
        OrderPaidService.OrderPaidService,
        OrderReturnService.OrderReturnService,
        OrderStatusChangedService.OrderStatusChangedService,
        OrderPaidConsumer.OrderPaidConsumer,
        OrderUserConsumer.UserRegisteredConsumer,
        OrderStatusChangedConsumer.OrderStatusChangedConsumer,
        OrderReturnConsumer.OrderOrderReturnConsumer,

        // finance Service
        FinancemoduleUserRepo.UserRepository,
        FinancemoduleInboxRepo.InboxRepository,
        FinancemoduleFinanceRepo.FinanceRepository,
        FinanceUserRegisterService.UserRegisterService,
        FinanceOrderReturnService.OrderReturnService,
        FinanceUserConsumer.UserRegisteredConsumer,
        FinanceOrderReturnConsumer.FinanceOrderReturnConsumer,

        // shipment Service
        ShipmentmoduleUserRepo.UserRepository,
        ShipmentmoduleInboxRepo.InboxRepository,
        ShipmentUserRegisterService.UserRegisterService,
        ShipmentOrderCreatedService.OrderCreatedService,
        ShipmentOrderPaidService.OrderPaidService,
        ShipmentUserConsumer.UserRegisteredConsumer,
        ShipentOrderCreatedConsumer.OrderCreatedConsumer,
        ShipmentOrderRepository.OrderRepository,
        ShipmentOrderItemRepository.OrderItemRepository,
        ShipmentOrderPaidConsumer.OrderPaidConsumer,
    ],
    exports: [RabbitMQService],
})
export class RabbitMQModule { }