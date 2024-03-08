import { IsBoolean, IsEnum, IsInt, IsNumber, IsObject, IsOptional, IsString, isDate } from "class-validator";
import { BaseModel } from "src/common/base/entity.base";
import { RestaurantsModel } from "src/restaurants/entity/restaurants.entity";
import { UsersModel } from "src/users/entity/users.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderStatusEnum } from "../enum/order-status.enum";
import { Exclude, Expose } from "class-transformer";

export interface OrderMenu {

    menuNumber: number;
    menuName: string;
    menuPrice: string;
}

@Entity()
export class OrdersModel {

    @PrimaryGeneratedColumn()
    @Exclude()
    id: number;

    @CreateDateColumn()
    createdAt: Date


    @Column()
    @IsInt()
    @IsOptional()
    orderNumber?: number;


    @Column()
    @IsString()
    @IsOptional()
    userName?: string;


    @Column()
    @IsString()
    @IsOptional()
    userAddress?: string;


    @Column()
    @IsString()
    @IsOptional()
    userPhone?: string;


    @Column('jsonb', { default: [] })
    @IsObject()
    menus?: OrderMenu[]


    @Column({ default: false })
    @IsBoolean()
    isAllowed: boolean;


    @Column({ default: OrderStatusEnum.PENDING })
    @IsEnum(OrderStatusEnum)
    status: OrderStatusEnum;


    @ManyToOne(() => UsersModel, (user) => user.orders)
    user: UsersModel;


    @ManyToOne(() => RestaurantsModel, (res) => res.orders)
    restaurant: RestaurantsModel;
}