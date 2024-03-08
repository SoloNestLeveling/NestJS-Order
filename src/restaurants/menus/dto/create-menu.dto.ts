import { PickType } from "@nestjs/mapped-types";
import { MenusModel } from "../entity/menus.entity";
import { IsString } from "class-validator";

export class CreateMenuDto extends PickType(MenusModel, ['menuName', 'menuPrice', 'menuNumber']) {

    @IsString({ each: true })
    images: string[]
}