import { Body, Controller, Param, ParseIntPipe, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { User } from 'src/users/decorator/user.decorator';
import { UsersModel } from 'src/users/entity/users.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { SendOrderDto } from '../users/dto/send-order.dto';
import { TransationInterceptor } from 'src/common/interceptor/transaction.interceptor';
import { ReqQueryRunner } from 'src/common/decorator/req-query-runner.decorator';
import { QueryRunner } from 'typeorm';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

}
