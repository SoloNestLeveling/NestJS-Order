import { Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { OwnersService } from './owners.service';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { Owner } from './decorator/owner.decorator';
import { OwnersModel } from './entity/owners.entity';

@Controller('owners')
export class OwnersController {
  constructor(private readonly ownersService: OwnersService) { }


  @Get()
  getAllOwner() {
    return this.ownersService.getAllOwner()
  }

  @Get(':ownerId')
  getOwner(
    @Param('ownerId', ParseIntPipe) id: number
  ) {

    return this.ownersService.getOwnerByid(id)

  };


}
