import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { OwnersModel } from 'src/owners/entity/owners.entity';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { CreateResDto } from './dto/create-res.dto';
import { Owner } from 'src/owners/decorator/owner.decorator';
import { ResPaginationDto } from './dto/res-pagination.dto';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) { }


  @Post()
  @UseGuards(AccessTokenGuard)
  createRes(
    @Owner() owner: OwnersModel,
    @Body() dto: CreateResDto
  ) {
    return this.restaurantsService.createRes(dto, owner.id)
  };


  @Get(':resId')
  getRes(
    @Param('resId', ParseIntPipe) id: number
  ) {

    return this.restaurantsService.getResById(id)

  }

  @Get()
  resPaginate(
    @Query() dto: ResPaginationDto
  ) {
    return this.restaurantsService.resPaginate(dto)
  }


}
