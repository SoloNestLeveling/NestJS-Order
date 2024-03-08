import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModel } from './entity/users.entity';
import { RestaurantsController } from 'src/restaurants/restaurants.controller';
import { RestaurantsService } from 'src/restaurants/restaurants.service';
import { OrdersService } from 'src/orders/orders.service';
import { RestaurantsModel } from 'src/restaurants/entity/restaurants.entity';
import { OrdersModel } from 'src/orders/entity/orders.entity';
import { CommonService } from 'src/common/common.service';
import { UsersGateway } from './users.gateway';
import { AuthService } from 'src/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { OwnersService } from 'src/owners/owners.service';
import { OwnersModel } from 'src/owners/entity/owners.entity';
import { RidersService } from 'src/riders/riders.service';
import { RidersModel } from 'src/riders/entity/rider.entity';
import { ReviewsService } from 'src/reviews/reviews.service';
import { ReviewsModel } from 'src/reviews/entity/reviews.entity';
import { ImagesService } from 'src/images/images.service';
import { ImagesModel } from 'src/images/entity/images.entity';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([
      UsersModel,
      RestaurantsModel,
      OrdersModel,
      OwnersModel,
      RidersModel,
      ReviewsModel,
      ImagesModel
    ]),
  ],
  exports: [UsersService],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersGateway,
    RestaurantsService,
    OrdersService,
    CommonService,
    AuthService,
    OwnersService,
    RidersService,
    ReviewsService,
    ImagesService],
})
export class UsersModule { }
