import { PickType } from "@nestjs/mapped-types";
import { ImagesModel } from "../entity/images.entity";

export class CreateMenuImgDto extends PickType(ImagesModel, [
    'order',
    'type',
    'path',
    'menu'
]) { }