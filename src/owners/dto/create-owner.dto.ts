import { PickType } from "@nestjs/mapped-types";
import { OwnersModel } from "../entity/owners.entity";

export class CreateOwnerDto extends PickType(OwnersModel, ['email', 'password', 'businessNumber', 'representativeName']) { }