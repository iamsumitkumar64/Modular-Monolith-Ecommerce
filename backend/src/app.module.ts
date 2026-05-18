import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { userDataSource } from './module/user-server/infrastructure/database/data-source';
import { BcryptService } from './common/services/bcrypt.service';
import { UserRepository } from './module/user-server/infrastructure/repository/user.repo';
import { JwtHelperService } from './module/user-server/infrastructure/services/jwt.service';
import { RabbitMQModule } from './common/infrastruture/rabbit-mq/rabbit-mq.module';
import { AuthenticateMiddleware } from './common/infrastruture/middleware/authenticate.middleware';
import * as AuthCronModule from './module/user-server/infrastructure/cron/cron.module';
import * as AuthModule from './module/user-server/feature/user/user.module';
import { ScheduleModule } from '@nestjs/schedule';
import { productDataSource } from './module/product-server/infrastructure/database/data-source';
import { ProductModule } from './module/product-server/feature/product/product.module';
import { cartDataSource } from './module/cart-server/infrastructure/database/data-source';

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

    // Cart Modules
    TypeOrmModule.forRoot({
      name: process.env.DB_POSTGRES_CART_SCHEMA || 'cart_schema',
      ...cartDataSource.options,
      retryAttempts: 10,
      retryDelay: 5000
    }),
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