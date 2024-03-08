import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { RidersService } from './riders.service';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { Rider } from './decorator/rider.decorator';
import { RidersModel } from './entity/rider.entity';

@Controller('riders')
export class RidersController {
  constructor(private readonly ridersService: RidersService) { }


  @Get()
  getAllRider() {
    return this.ridersService.getAllRider()
  };

}
