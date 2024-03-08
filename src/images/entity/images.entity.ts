import { IsEnum, IsInt } from "class-validator";
import { BaseModel } from "src/common/base/entity.base";
import { Column, Entity, ManyToOne } from "typeorm";
import { ImageTypeEnum } from "../enum/image.enum";
import { Transform } from "class-transformer";
import { join } from "path";
import { MENU_IMAGE_PATH, REVIEW_IMAGE_PATH, USER_IMAGE_PATH } from "src/common/const/image-path.const";
import { UsersModel } from "src/users/entity/users.entity";
import { MenusModel } from "src/restaurants/menus/entity/menus.entity";
import { ReviewsModel } from "src/reviews/entity/reviews.entity";

@Entity()
export class ImagesModel extends BaseModel {

    @Column()
    @IsInt()
    order: number;

    @Column({ default: ImageTypeEnum.USER_IMAGE })
    @IsEnum(ImageTypeEnum)
    type: ImageTypeEnum;

    @Column()
    @Transform(({ value, obj }) => {
        if (obj.type === ImageTypeEnum.USER_IMAGE) {
            return `/${join(USER_IMAGE_PATH, value)}`;
        } else if (obj.type === ImageTypeEnum.MENU_IMAGE) {
            return `/${join(MENU_IMAGE_PATH, value)}`;
        } else if (obj.type === ImageTypeEnum.REVIEW_IMAGE) {
            return `/${join(REVIEW_IMAGE_PATH, value)}`
        } else {
            return value;
        }
    })
    path: string;


    @ManyToOne(() => UsersModel, (user) => user.images)
    user: UsersModel;


    @ManyToOne(() => MenusModel, (menu) => menu.images)
    menu: MenusModel;


    @ManyToOne(() => ReviewsModel, (rev) => rev.images)
    review: ReviewsModel;

}