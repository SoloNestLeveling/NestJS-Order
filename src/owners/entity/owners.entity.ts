import { Exclude } from "class-transformer";
import { IsEmail, IsEnum, IsString } from "class-validator";
import { BaseModel } from "src/common/base/entity.base";
import { RestaurantsModel } from "src/restaurants/entity/restaurants.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity()
export class OwnersModel extends BaseModel {

    @Column()
    @IsEmail()
    email: string;


    @Column()
    @IsString()
    @Exclude()
    password: string;


    @Column()
    @IsString()
    businessNumber: string;


    @Column()
    @IsString()
    representativeName: string;



    @OneToMany(() => RestaurantsModel, (res) => res.owner)
    restaurants: RestaurantsModel[];


}