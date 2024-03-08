import { PickType } from "@nestjs/mapped-types";
import { OrdersModel } from "../entity/orders.entity";
import { IsNumber } from "class-validator";

export class CreateOrderDto extends PickType(OrdersModel, [
    'orderNumber',
    'userName',
    'userAddress',
    'userPhone',
    'menus',
]) {
}