import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { userDataSource } from './module/user-server/infrastructure/database/data-source';
import { BcryptService } from './module/common/services/bcrypt.service';
import { UserRepository } from './module/user-server/infrastructure/repository/user.repo';
import { JwtHelperService } from './module/user-server/infrastructure/services/jwt.service';
import { RabbitMQModule } from './module/common/infrastruture/rabbit-mq/rabbit-mq.module';
import { AuthenticateMiddleware } from './module/common/infrastruture/middleware/authenticate.middleware';
import * as AuthCronModule from './module/user-server/infrastructure/cron/cron.module';
import * as AuthModule from './module/user-server/feature/user/user.module';
import { ScheduleModule } from '@nestjs/schedule';
import { productDataSource } from './module/product-server/infrastructure/database/data-source';
import { ProductModule } from './module/product-server/feature/product/product.module';
import { cartDataSource } from './module/cart-server/infrastructure/database/data-source';
import { CartModule } from './module/cart-server/feature/cart/cart.module';
import { orderDataSource } from './module/order-server/infrastructure/database/data-source';
import { financeDataSource } from './module/finance-server/infrastructure/database/data-source';
import { PaymentModule } from './module/finance-server/feature/payment/payment.module';
import { PaymentCardModule } from './module/finance-server/feature/payment-card/payment-card.module';
import { shipmentDataSource } from './module/shipment-server/infrastructure/database/data-source';
import { UserAddressModule } from './module/shipment-server/feature/user-address/user-address.module';
import { OrderModule } from './module/order-server/feature/order/order.module';
import * as OrderCronModule from './module/order-server/infrastructure/cron/cron.module';
import { PaymentOrderModule } from './module/finance-server/feature/order/order.module';
import * as FinanceCronModule from './module/finance-server/infrastructure/cron/cron.module';
import * as ShipmentCronModule from './module/shipment-server/infrastructure/cron/cron.module';
import { SocketModule } from './module/common/socket/socket.module';
import { ShipmentOrderModule } from './module/shipment-server/feature/order/order.module';

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
    AuthModule.UserModule,
    AuthCronModule.CronModule,

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