import { ExecutionContext, UnauthorizedException, createParamDecorator } from "@nestjs/common";

export const User = createParamDecorator((data, context: ExecutionContext) => {

    const req = context.switchToHttp().getRequest()

    if (!req.user) {
        throw new UnauthorizedException('accessToken과 함께 사용 해야합니다.')
    };

    return req.user


});