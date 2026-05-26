import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

// Common Module
import { BcryptService } from './module/common/infrastruture/services/bcrypt.service';
import { SocketModule } from './module/common/infrastruture/socket/socket.module';
import { RabbitMQModule } from './module/common/infrastruture/rabbit-mq/rabbit-mq.module';
import { AuthenticateMiddleware } from './module/common/infrastruture/middleware/authenticate.middleware';

// User Module
import { userDataSource } from './module/user-module/infrastructure/database/data-source';
import { UserRepository } from './module/user-module/infrastructure/repository/user.repository';
import { JwtHelperService } from './module/user-module/infrastructure/services/jwt.service';
import * as UserCronModule from './module/user-module/infrastructure/cron/cron.module';
import { UserModule } from './module/user-module/feature/user/user.module';

// Product Module
import { productDataSource } from './module/product-module/infrastructure/database/data-source';
import { ProductModule } from './module/product-module/feature/product/product.module';

// Cart Module
import { cartDataSource } from './module/cart-module/infrastructure/database/data-source';
import { CartModule } from './module/cart-module/feature/cart/cart.module';

// Order Module
import { orderDataSource } from './module/order-module/infrastructure/database/data-source';
import { OrderModule } from './module/order-module/feature/order/order.module';
import * as OrderCronModule from './module/order-module/infrastructure/cron/cron.module';

// Finance Module
import { financeDataSource } from './module/finance-module/infrastructure/database/data-source';
import { PaymentModule } from './module/finance-module/feature/payment/payment.module';
import { PaymentCardModule } from './module/finance-module/feature/payment-card/payment-card.module';
import { PaymentOrderModule } from './module/finance-module/feature/order/order.module';
import * as FinanceCronModule from './module/finance-module/infrastructure/cron/cron.module';

// Shipment Module
import { shipmentDataSource } from './module/shipment-module/infrastructure/database/data-source';
import { UserAddressModule } from './module/shipment-module/feature/user/user-address.module';
import * as ShipmentCronModule from './module/shipment-module/infrastructure/cron/cron.module';
import { ShipmentOrderModule } from './module/shipment-module/feature/order/order.module';

@Module({
  imports: [
    // common
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_REGISTER_SECRET,
      // signOptions: { expiresIn: '60m' },
    }),
    RabbitMQModule,
    ScheduleModule.forRoot(),
    SocketModule,

    //User Modules
    TypeOrmModule.forRoot({
      name: process.env.DB_POSTGRES_USER_SCHEMA || 'user_schema',
      ...userDataSource.options,
      retryAttempts: 10,
      retryDelay: 5000
    }),
    UserModule,
    UserCronModule.CronModule,

    // Product Modules
    TypeOrmModule.forRoot({
      name: process.env.DB_POSTGRES_PRODUCT_SCHEMA || 'product_schema',
      ...productDataSource.options,
      retryAttempts: 10,
      retryDelay: 5000
    }),
    ProductModule,
    PaymentOrderModule,

    // Cart Modules
    TypeOrmModule.forRoot({
      name: process.env.DB_POSTGRES_CART_SCHEMA || 'cart_schema',
      ...cartDataSource.options,
      retryAttempts: 10,
      retryDelay: 5000
    }),
    CartModule,

    // Order Modules
    TypeOrmModule.forRoot({
      name: process.env.DB_POSTGRES_ORDER_SCHEMA || 'order_schema',
      ...orderDataSource.options,
      retryAttempts: 10,
      retryDelay: 5000
    }),
    OrderModule,
    OrderCronModule.CronModule,

    // finance Modules
    TypeOrmModule.forRoot({
      name: process.env.DB_POSTGRES_FINANCE_SCHEMA || 'finance_schema',
      ...financeDataSource.options,
      retryAttempts: 10,
      retryDelay: 5000
    }),
    PaymentModule,
    PaymentCardModule,
    FinanceCronModule.CronModule,

    // shipment Modules
    TypeOrmModule.forRoot({
      name: process.env.DB_POSTGRES_SHIPMENT_SCHEMA || 'shipment_schema',
      ...shipmentDataSource.options,
      retryAttempts: 10,
      retryDelay: 5000
    }),
    UserAddressModule,
    ShipmentOrderModule,
    ShipmentCronModule.CronModule,
  ],
  controllers: [AppController],
  providers: [AppService, BcryptService, UserRepository, JwtHelperService],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticateMiddleware)
      .exclude(
        { path: '/user/login', method: RequestMethod.ALL },
        { path: '/user/register', method: RequestMethod.ALL },
        { path: '/product', method: RequestMethod.ALL },
      )
      .forRoutes('*');
  }
}