import { Exclude, Expose } from "class-transformer";
import { IsNumber, IsString } from "class-validator";
import { BaseModel } from "src/common/base/entity.base";
import { ImagesModel } from "src/images/entity/images.entity";
import { RestaurantsModel } from "src/restaurants/entity/restaurants.entity";
import { ReviewsModel } from "src/reviews/entity/reviews.entity";
import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from "typeorm";

@Entity()
export class MenusModel extends BaseModel {


    @Column()
    @IsNumber()
    menuNumber: number;

    @Column()
    @IsString()
    menuName: string;

    @Column()
    @IsString()
    menuPrice: string;


    @ManyToOne(() => RestaurantsModel, (res) => res.menus)
    restaurant: RestaurantsModel;


    @OneToMany(() => ImagesModel, (img) => img.menu)
    images: ImagesModel[];


    @OneToMany(() => ReviewsModel, (rev) => rev.menu)
    reviews: ReviewsModel[];

}