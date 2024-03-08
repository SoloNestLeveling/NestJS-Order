import { IsNumber } from "class-validator";

export class AllowOrderDto {

    @IsNumber()
    orderNumber: number;
}