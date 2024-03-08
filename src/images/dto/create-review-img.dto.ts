import { PickType } from "@nestjs/mapped-types";
import { ImagesModel } from "../entity/images.entity";

export class CreateReviewImageDto extends PickType(ImagesModel, [
    'order',
    'path',
    'type',
    'review'
]) { }