import { IsIn, IsNumber, IsOptional, IsString } from "class-validator";

export class BasePaginationDto {

    @IsNumber()
    @IsOptional()
    where__id__more_than?: number;


    @IsNumber()
    @IsOptional()
    where__id__less_than?: number;


    @IsString()
    @IsIn(['ASC', 'DESC'])
    @IsOptional()
    order__createdAt?: 'ASC' | 'DESC' = 'ASC';


    @IsNumber()
    @IsOptional()
    take: number = 10;


    @IsNumber()
    @IsOptional()
    page?: number

}