import { PickType } from "@nestjs/mapped-types";
import { ReviewsModel } from "../entity/reviews.entity";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateReviewDto extends PickType(ReviewsModel, ['grade', 'comment']) {


    @IsString({ each: true })
    @IsOptional()
    images: string[] = [];
}