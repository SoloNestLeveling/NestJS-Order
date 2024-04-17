import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { AuthService } from "../auth.service";
import { UsersService } from "src/users/users.service";
import { OwnersService } from "src/owners/owners.service";
import { RidersService } from "src/riders/riders.service";
import { Reflector } from "@nestjs/core";
import { PUBLIC_KEY, PublicTypeEnum } from "src/common/decorator/public.decorator";

@Injectable()
export class BearerTokenGuard implements CanActivate {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
        private readonly ownersService: OwnersService,
        private readonly ridersService: RidersService,
        private readonly reflector: Reflector,
    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {

        const isPublic = await this.reflector.getAllAndOverride(
            PUBLIC_KEY,
            [
                context.getHandler(),
                context.getClass()
            ]
        );


        const req = context.switchToHttp().getRequest()

        if (isPublic) {

            req.isPublic = isPublic
        }


        if (isPublic === PublicTypeEnum.ISPUBLIC) {

            return true;
        }


        const rawToken = req.headers['authorization'];

        if (!rawToken) {
            throw new UnauthorizedException('토큰이 존재 하지 않습니다.')
        };


        const token = this.authService.extractTokenFromHeader(rawToken, true);
        const result = await this.authService.verifyToken(token);
        const user = await this.usersService.getUserByEmail(result.email);
        const owner = await this.ownersService.getOwnerByEmail(result.email);
        const rider = await this.ridersService.getRiderByEmail(result.email);

        req.user = user;
        req.owner = owner;
        req.rider = rider;
        req.token = token;
        req.tokenType = result.type;

        return true;

    }

}

@Injectable()
export class AccessTokenGuard extends BearerTokenGuard {

    async canActivate(context: ExecutionContext): Promise<boolean> {

        await super.canActivate(context)

        const req = context.switchToHttp().getRequest()

        if (req.isPublic === PublicTypeEnum.ISPUBLIC || PublicTypeEnum.REFRESH) {

            return true;
        }

        if (req.tokenType !== 'access') {

            throw new UnauthorizedException('accessToken이 아닙니다.')
        };

        return true
    }


};


@Injectable()
export class refreshTokenGuard extends BearerTokenGuard {

    async canActivate(context: ExecutionContext): Promise<boolean> {

        await super.canActivate(context)

        const req = context.switchToHttp().getRequest()

        if (req.tokenType !== 'refresh') {

            throw new UnauthorizedException('토큰 재발급은 오직 refreshToken으로만 가능합니다.')
        };

        return true
    }


}