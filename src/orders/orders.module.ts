import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersModel } from './entity/orders.entity';
import { UsersService } from 'src/users/users.service';
import { RestaurantsService } from 'src/restaurants/restaurants.service';
import { UsersModel } from 'src/users/entity/users.entity';
import { RestaurantsModel } from 'src/restaurants/entity/restaurants.entity';
import { CommonService } from 'src/common/common.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { OwnersService } from 'src/owners/owners.service';
import { OwnersModel } from 'src/owners/entity/owners.entity';
import { RidersService } from 'src/riders/riders.service';
import { RidersModel } from 'src/riders/entity/rider.entity';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([
      OrdersModel,
      UsersModel,
      RestaurantsModel,
      OwnersModel,
      RidersModel
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, UsersService, RestaurantsService, CommonService, AuthService, OwnersService, RidersService],
})
export class OrdersModule { }
