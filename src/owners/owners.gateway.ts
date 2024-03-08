import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { AuthService } from "src/auth/auth.service";
import { OwnersService } from "./owners.service";
import { Socket } from "socket.io";
import { OwnersModel } from "./entity/owners.entity";
import { UnauthorizedException } from "@nestjs/common";
import { SocketQr } from "src/common/decorator/socket-qr.decorator";
import { QueryRunner } from "typeorm";
import { AllowOrderDto } from "./dto/allow-order.dto";

@WebSocketGateway({ namespace: 'owners' })
export class OwnersGateway implements OnGatewayConnection {
    constructor(
        private readonly authService: AuthService,
        private readonly ownersService: OwnersService,
    ) { }
    async handleConnection(socket: Socket & { owner: OwnersModel }): Promise<boolean> {

        const headers = socket.handshake.headers;

        const rawToken = headers['authorization'];

        if (!rawToken) {

            socket.disconnect()
            throw new UnauthorizedException('토큰이 존재하지 않습니다.')
        };


        try {

            const token = this.authService.extractTokenFromHeader(rawToken, true);
            const result = await this.authService.verifyToken(token);
            const owner = await this.ownersService.getOwnerByEmail(result.email);

            socket.owner = owner;

            return true

        } catch (err) {

            socket.disconnect();
        }

    };



    @SubscribeMessage('allow_order')
    async allowOrder(
        @MessageBody() dto: AllowOrderDto,
        @ConnectedSocket() socket: Socket & { owner: OwnersModel },
    ) {

        await this.ownersService.allowOrder(dto, socket.owner.id);

    }
}