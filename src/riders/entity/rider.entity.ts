import { IsBoolean, IsEmail, IsEnum, IsObject, IsOptional, IsString } from "class-validator";
import { BaseModel } from "src/common/base/entity.base";
import { Column, Entity } from "typeorm";
import { Exclude, Transform } from "class-transformer";
import { StatusRiderEnum } from "../enum/status.enum";


@Entity()
export class RidersModel extends BaseModel {

    @Column()
    @IsEmail()
    email: string;

    @Column()
    @IsString()
    @Exclude()
    password: string;


    @Column({ default: false })
    @IsBoolean()
    @IsOptional()
    isCompleted: boolean;


    @Column('jsonb', { default: [] })
    @IsObject()
    @IsOptional()
    orderList: object[]


    @Column({ default: StatusRiderEnum.PENDING })
    @IsEnum(StatusRiderEnum)
    status: StatusRiderEnum


    @Column({ nullable: true })
    @IsOptional()
    @Transform(({ value, obj }) => {
        if (obj.status === StatusRiderEnum.PENDING) {
            return value;
        } else {
            return undefined;
        };
    })
    waitingTime?: string;


    @Column({ nullable: true })
    @IsOptional()
    @Transform(({ value, obj }) => {
        if (obj.status === StatusRiderEnum.PENDING) {
            return value;
        } else {
            return undefined;
        };
    })
    watingStartTime?: Date;

}