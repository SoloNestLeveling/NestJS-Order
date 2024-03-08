import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { OwnersModule } from './owners/owners.module';
import { RidersModule } from './riders/riders.module';
import { CommonModule } from './common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DB_DATABASE_KEY, DB_HOST_KEY, DB_PASSWORD_KEY, DB_PORT_KEY, DB_USERNAME_KEY } from './common/const/env-path';
import { ConfigModule } from '@nestjs/config';
import { UsersModel } from './users/entity/users.entity';
import { RidersModel } from './riders/entity/rider.entity';
import { OwnersModel } from './owners/entity/owners.entity';
import { AuthModule } from './auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { OrdersModule } from './orders/orders.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { RestaurantsModel } from './restaurants/entity/restaurants.entity';
import { MenusModel } from './restaurants/menus/entity/menus.entity';
import { ImagesModule } from './images/images.module';
import { ImagesModel } from './images/entity/images.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PUBLIC_FOLDER_PATH } from './common/const/image-path.const';
import { JwtModule } from '@nestjs/jwt';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { OrdersModel } from './orders/entity/orders.entity';
import { ReviewsModule } from './reviews/reviews.module';
import { ReviewsModel } from './reviews/entity/reviews.entity';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: PUBLIC_FOLDER_PATH,
      serveRoot: '/public'
    }),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env[DB_HOST_KEY],
      port: parseInt(process.env[DB_PORT_KEY]),
      username: process.env[DB_USERNAME_KEY],
      password: process.env[DB_PASSWORD_KEY],
      database: process.env[DB_DATABASE_KEY],
      entities: [
        UsersModel,
        RidersModel,
        OwnersModel,
        RestaurantsModel,
        MenusModel,
        ImagesModel,
        OrdersModel,
        ReviewsModel
      ],
      synchronize: true
    }),
    UsersModule,
    OwnersModule,
    RidersModule,
    CommonModule,
    AuthModule,
    OrdersModule,
    RestaurantsModule,
    ImagesModule,
    ReviewsModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor
    }],
})
export class AppModule { }
