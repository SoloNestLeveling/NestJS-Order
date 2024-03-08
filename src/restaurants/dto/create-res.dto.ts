import { PickType } from "@nestjs/mapped-types";
import { RestaurantsModel } from "../entity/restaurants.entity";

export class CreateResDto extends PickType(RestaurantsModel, [
    'name',
    'address',
    'contactInfo',
    'totalSales'
]) { };