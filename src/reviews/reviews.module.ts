import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsModel } from './entity/reviews.entity';
import { ImagesModel } from 'src/images/entity/images.entity';
import { ImagesService } from 'src/images/images.service';
import { RestaurantsService } from 'src/restaurants/restaurants.service';
import { RestaurantsModel } from 'src/restaurants/entity/restaurants.entity';
import { CommonService } from 'src/common/common.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ReviewsModel,
      ImagesModel,
      RestaurantsModel,
    ])
  ],
  exports: [ReviewsService],
  controllers: [ReviewsController],
  providers: [ReviewsService, ImagesService, RestaurantsService, CommonService],
})
export class ReviewsModule { }
