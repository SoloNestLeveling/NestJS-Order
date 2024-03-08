import { Exclude } from "class-transformer";
import { LargeNumberLike } from "crypto";
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


export class BaseModel {
    @PrimaryGeneratedColumn()
    id: number;


    @CreateDateColumn()
    @Exclude()
    createdAt: Date;

    @UpdateDateColumn()
    @Exclude()
    updatedAt: Date;
}