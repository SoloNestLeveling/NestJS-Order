import { ConnectedSocket, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WsException } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { RidersModel } from "./entity/rider.entity";
import { AuthService } from "src/auth/auth.service";
import { RidersService } from "./riders.service";
import { SocketQr } from "src/common/decorator/socket-qr.decorator";
import { QueryRunner } from "typeorm";
import { UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { SocketTransactionInterceptor } from "src/common/interceptor/socket-transaction.interceptor";

@WebSocketGateway({ namespace: 'riders' })
export class RidersGateway implements OnGatewayConnection {
    constructor(
        private readonly authService: AuthService,
        private readonly ridersService: RidersService
    ) { }
    async handleConnection(socket: Socket & { rider: RidersModel }) {

        const headers = socket.handshake.headers

        const rawToken = headers['authorization'];

        if (!rawToken) {

            socket.disconnect()
            throw new WsException({
                status: 100,
                error: { message: '토큰이 존재하지 않습니다.' }
            });
        };


        try {

            const token = this.authService.extractTokenFromHeader(rawToken, true);
            const result = await this.authService.verifyToken(token);
            const rider = await this.ridersService.getRiderByEmail(result.email);

            socket.rider = rider;

        } catch (e) {

            socket.disconnect()

        };

    };



    @SubscribeMessage('pickup_stuff')
    @UsePipes(new ValidationPipe({
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
        whitelist: true,
        forbidNonWhitelisted: true
    }))
    @UseInterceptors(SocketTransactionInterceptor)
    async pickup(
        @ConnectedSocket() socket: Socket & { rider: RidersModel },
        @SocketQr() qr?: QueryRunner
    ) {

        await this.ridersService.pickupStuff(socket.rider.id, qr);



    };


    @SubscribeMessage('complete_delivery')
    @UsePipes(new ValidationPipe({
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
        whitelist: true,
        forbidNonWhitelisted: true
    }))
    @UseInterceptors(SocketTransactionInterceptor)
    async completeDelivery(
        @ConnectedSocket() socket: Socket & { rider: RidersModel },
        @SocketQr() qr?: QueryRunner
    ) {

        await this.ridersService.completeDelivery(socket.rider.id, qr);

    };




    @SubscribeMessage('pending')
    @UsePipes(new ValidationPipe({
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
        whitelist: true,
        forbidNonWhitelisted: true
    }))
    @UseInterceptors(SocketTransactionInterceptor)
    async canRecevieOrder(
        @ConnectedSocket() socket: Socket & { rider: RidersModel },
        @SocketQr() qr?: QueryRunner
    ) {

        await this.ridersService.canRecevieOrder(socket.rider.id, qr);

    };
}