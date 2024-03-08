import { IsEmail, IsEnum, IsString } from "class-validator";
import { LargeNumberLike } from "crypto";
import { BaseModel } from "src/common/base/entity.base";
import { Column, Entity, OneToMany } from "typeorm";
import { RolesEnumType } from "../enum/roles.enum";
import { ImagesModel } from "src/images/entity/images.entity";
import { OrdersModel } from "src/orders/entity/orders.entity";
import { ReviewsModel } from "src/reviews/entity/reviews.entity";
import { Exclude } from "class-transformer";


@Entity()
export class UsersModel extends BaseModel {

    @Column()
    @IsEmail()
    @Exclude()
    email: string;


    @Column()
    @IsString()
    @Exclude()
    password: string;


    @Column()
    @IsString()
    nickname: string;

    @Column()
    @IsString()
    address: string;

    @Column()
    @IsString()
    phoneNumber: string;


    @Column({ default: RolesEnumType.USER })
    @IsEnum(RolesEnumType)
    role: RolesEnumType;


    @OneToMany(() => ImagesModel, (img) => img.user)
    images: ImagesModel[];


    @OneToMany(() => OrdersModel, (order) => order.user)
    orders: OrdersModel[];


    @OneToMany(() => ReviewsModel, (rev) => rev.author)
    reviews: ReviewsModel[];

}