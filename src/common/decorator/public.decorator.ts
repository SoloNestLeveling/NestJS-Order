import { SetMetadata } from "@nestjs/common";

export enum PublicTypeEnum {

    ISPUBLIC = 'is_public',
    REFRESH = 'refresh'

}

export const PUBLIC_KEY = 'public_key';

export const IsPublic = (type: PublicTypeEnum) => SetMetadata(PUBLIC_KEY, type)