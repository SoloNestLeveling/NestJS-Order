import { IsNumber, IsString } from "class-validator";
import { BaseModel } from "src/common/base/entity.base";
import { ImagesModel } from "src/images/entity/images.entity";
import { RestaurantsModel } from "src/restaurants/entity/restaurants.entity";
import { MenusModel } from "src/restaurants/menus/entity/menus.entity";
import { UsersModel } from "src/users/entity/users.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";

@Entity()
export class ReviewsModel extends BaseModel {


    @Column()
    @IsNumber()
    grade: number;

    @Column()
    @IsString()
    comment: string;


    @ManyToOne(() => UsersModel, (user) => user.reviews)
    author: UsersModel;

    @ManyToOne(() => MenusModel, (menu) => menu.reviews)
    menu: MenusModel;

    @OneToMany(() => ImagesModel, (img) => img.review)
    images: ImagesModel[];


}