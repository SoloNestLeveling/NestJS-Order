import { IsOptional, IsString } from "class-validator";
import { BaseModel } from "src/common/base/entity.base";
import { OwnersModel } from "src/owners/entity/owners.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { MenusModel } from "../menus/entity/menus.entity";
import { OrdersModel } from "src/orders/entity/orders.entity";
import { Optional } from "@nestjs/common";
import { ReviewsModel } from "src/reviews/entity/reviews.entity";

@Entity()
export class RestaurantsModel extends BaseModel {

    @Column()
    @IsString()
    name: string;


    @Column()
    @IsString()
    address: string;


    @Column()
    @IsString()
    contactInfo: string;


    @Column({ default: '0원' })
    @IsString()
    @IsOptional()
    totalSales: string;


    @ManyToOne(() => OwnersModel, (owner) => owner.restaurants)
    owner: OwnersModel;


    @OneToMany(() => MenusModel, (menu) => menu.restaurant)
    menus: MenusModel[];


    @OneToMany(() => OrdersModel, (order) => order.restaurant)
    orders: OrdersModel[];

}