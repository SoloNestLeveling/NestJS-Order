import { Module } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { RestaurantsController } from './restaurants.controller';
import { MenusService } from './menus/menus.service';
import { MenusController } from './menus/menus.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantsModel } from './entity/restaurants.entity';
import { OwnersModel } from 'src/owners/entity/owners.entity';
import { OwnersService } from 'src/owners/owners.service';
import { MenusModel } from './menus/entity/menus.entity';
import { ImagesModel } from 'src/images/entity/images.entity';
import { ImagesService } from 'src/images/images.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { UsersModel } from 'src/users/entity/users.entity';
import { RidersService } from 'src/riders/riders.service';
import { RidersModel } from 'src/riders/entity/rider.entity';
import { CommonService } from 'src/common/common.service';
import { OrdersService } from 'src/orders/orders.service';
import { OrdersModel } from 'src/orders/entity/orders.entity';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([
      RestaurantsModel,
      MenusModel,
      OwnersModel,
      ImagesModel,
      UsersModel,
      RidersModel,
      OrdersModel

    ])
  ],
  controllers: [RestaurantsController, MenusController],
  providers: [
    RestaurantsService,
    MenusService,
    OwnersService,
    ImagesService,
    AuthService,
    UsersService,
    RidersService,
    CommonService,
    OrdersService,
  ],
})
export class RestaurantsModule { }
