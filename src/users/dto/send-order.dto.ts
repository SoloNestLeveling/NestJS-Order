import { IsArray, IsNumber } from "class-validator";

export class SendOrderDto {

    @IsNumber()
    resId: number;


    @IsNumber({}, { each: true })
    menuNumber: number[];
}