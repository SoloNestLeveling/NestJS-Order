import { Injectable } from '@nestjs/common';
import { ImagesService } from 'src/images/images.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ReviewsModel } from './entity/reviews.entity';
import { QueryRunner, Repository } from 'typeorm';
import { RestaurantsService } from 'src/restaurants/restaurants.service';

@Injectable()
export class ReviewsService {
    constructor(
        @InjectRepository(ReviewsModel)
        private readonly reviewsRepository: Repository<ReviewsModel>,
        private readonly imagesService: ImagesService,
        private readonly restaurantsService: RestaurantsService
    ) { }


    getRepository(qr?: QueryRunner) {
        return qr ? qr.manager.getRepository<ReviewsModel>(ReviewsModel) : this.reviewsRepository;
    };

    async createReview(dto: CreateReviewDto, userId: number, menuId: number) {



        const review = this.reviewsRepository.create({
            author: {
                id: userId
            },
            menu: {
                id: menuId
            },
            grade: dto.grade,
            comment: dto.comment,
            images: []

        });

        const result = await this.reviewsRepository.save(review);

        return result;
    }


    async getReviewById(id: number) {
        const review = await this.reviewsRepository.findOne({
            where: {
                id,
            },
            relations: ['author']
        });

        return review;
    }
}
