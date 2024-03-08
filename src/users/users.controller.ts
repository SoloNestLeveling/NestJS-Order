import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ReviewsService } from 'src/reviews/reviews.service';
import { User } from './decorator/user.decorator';
import { UsersModel } from './entity/users.entity';
import { CreateReviewDto } from 'src/reviews/dto/create-review.dto';
import { ImagesService } from 'src/images/images.service';
import { ImageTypeEnum } from 'src/images/enum/image.enum';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly reviewsService: ReviewsService,
    private readonly imagesService: ImagesService
  ) { }

  @Get()
  getAllUser() {
    return this.usersService.getAllUser()
  }


  @Post(':menuId')
  @UseGuards(AccessTokenGuard)
  async createReview(
    @User() user: UsersModel,
    @Body() dto: CreateReviewDto,
    @Param('menuId', ParseIntPipe) menuId: number
  ) {

    const review = await this.reviewsService.createReview(dto, user.id, menuId);


    for (let i = 0; i < dto.images.length; i++) {

      await this.imagesService.createReviewImg({
        order: i + 1,
        path: dto.images[i],
        type: ImageTypeEnum.REVIEW_IMAGE,
        review,
      });
    };

    return this.reviewsService.getReviewById(review.id)
  }
}
