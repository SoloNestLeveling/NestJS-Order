import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WsException } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { UsersModel } from "./entity/users.entity";
import { AuthService } from "src/auth/auth.service";
import { UsersService } from "./users.service";
import { SocketQr } from "src/common/decorator/socket-qr.decorator";
import { QueryRunner } from "typeorm";
import { SendOrderDto } from "./dto/send-order.dto";
import { ParseIntPipe, UseFilters, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { SocketTransactionInterceptor } from "src/common/interceptor/socket-transaction.interceptor";
import { SocketExceptionFilter } from "src/common/exception/socket.exception";


@WebSocketGateway({ namespace: 'users' })
export class UsersGateway implements OnGatewayConnection {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService
    ) { }
    async handleConnection(socket: Socket & { user: UsersModel }) {

        const headers = socket.handshake.headers;
        const rawToken = headers['authorization'];

        if (!rawToken) {

            throw new WsException({
                status: 100,
                error: { message: '토큰이 존재하지 않습니다.' }
            });
        };


        try {

            const token = this.authService.extractTokenFromHeader(rawToken, true);
            const result = await this.authService.verifyToken(token);
            const user = await this.usersService.getUserByEmail(result.email);

            socket.user = user;
            return true;

        } catch (err) {

            socket.disconnect();
        };

    };


    @SubscribeMessage('send_order')
    @UsePipes(new ValidationPipe({
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
        whitelist: true,
        forbidNonWhitelisted: true,
    }))
    @UseFilters(SocketExceptionFilter)
    async sendOrder(
        @MessageBody() dto: SendOrderDto,
        @ConnectedSocket() socket: Socket & { user: UsersModel },

    ) {

        await this.usersService.sendOrder(dto, socket.user.id)
    }
}