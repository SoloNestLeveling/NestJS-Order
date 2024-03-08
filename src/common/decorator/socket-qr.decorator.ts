import { BadRequestException, ExecutionContext, createParamDecorator } from "@nestjs/common";

export const SocketQr = createParamDecorator((data, context: ExecutionContext) => {

    const socket = context.switchToWs().getClient()

    if (!socket.qr) {
        throw new BadRequestException('반드시 SocketTransactionInterceptor와 함께 사용 해야합니다.')
    };

    return socket.qr;
});