import { PickType } from "@nestjs/mapped-types";
import { RidersModel } from "../entity/rider.entity";

export class CreateRiderDto extends PickType(RidersModel, ['email', 'password']) { }