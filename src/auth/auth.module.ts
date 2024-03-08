import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModel } from 'src/users/entity/users.entity';
import { RidersModel } from 'src/riders/entity/rider.entity';
import { OwnersModel } from 'src/owners/entity/owners.entity';
import { OwnersService } from 'src/owners/owners.service';
import { RidersService } from 'src/riders/riders.service';
import { UsersService } from 'src/users/users.service';
import { OrdersService } from 'src/orders/orders.service';
import { OrdersModel } from 'src/orders/entity/orders.entity';
import { RestaurantsService } from 'src/restaurants/restaurants.service';
import { RestaurantsModel } from 'src/restaurants/entity/restaurants.entity';
import { CommonService } from 'src/common/common.service';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([
      UsersModel,
      RidersModel,
      OwnersModel,
      OrdersModel,
      RestaurantsModel
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, OwnersService, RidersService, UsersService, OrdersService, RestaurantsService, CommonService],
})
export class AuthModule { }
