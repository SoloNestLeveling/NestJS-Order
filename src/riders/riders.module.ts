import { Module } from '@nestjs/common';
import { RidersService } from './riders.service';
import { RidersController } from './riders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RidersModel } from './entity/rider.entity';
import { OrdersService } from 'src/orders/orders.service';
import { OrdersModel } from 'src/orders/entity/orders.entity';
import { UsersService } from 'src/users/users.service';
import { UsersModel } from 'src/users/entity/users.entity';
import { RestaurantsService } from 'src/restaurants/restaurants.service';
import { RestaurantsModel } from 'src/restaurants/entity/restaurants.entity';
import { CommonService } from 'src/common/common.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { OwnersService } from 'src/owners/owners.service';
import { OwnersModel } from 'src/owners/entity/owners.entity';
import { RidersGateway } from './riders.gateway';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([
      RidersModel,
      OrdersModel,
      UsersModel,
      RestaurantsModel,
      OwnersModel

    ]),
  ],
  exports: [RidersService],
  controllers: [RidersController],
  providers: [RidersService, RidersGateway, OrdersService, UsersService, RestaurantsService, CommonService, AuthService, OwnersService],
})
export class RidersModule { }
