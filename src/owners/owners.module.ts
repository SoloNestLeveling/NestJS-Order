import { Module } from '@nestjs/common';
import { OwnersService } from './owners.service';
import { OwnersController } from './owners.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OwnersModel } from './entity/owners.entity';
import { OrdersService } from 'src/orders/orders.service';
import { OrdersModel } from 'src/orders/entity/orders.entity';
import { UsersService } from 'src/users/users.service';
import { UsersModel } from 'src/users/entity/users.entity';
import { RestaurantsService } from 'src/restaurants/restaurants.service';
import { RestaurantsModel } from 'src/restaurants/entity/restaurants.entity';
import { CommonService } from 'src/common/common.service';
import { RidersService } from 'src/riders/riders.service';
import { RidersModel } from 'src/riders/entity/rider.entity';
import { AuthService } from 'src/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { OwnersGateway } from './owners.gateway';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([
      OwnersModel,
      OrdersModel,
      UsersModel,
      RestaurantsModel,
      RidersModel
    ]),
  ],
  exports: [OwnersService],
  controllers: [OwnersController],
  providers: [
    OwnersGateway,
    OwnersService,
    OrdersService,
    UsersService,
    RestaurantsService,
    CommonService,
    RidersService,
    AuthService
  ],
})
export class OwnersModule { }
