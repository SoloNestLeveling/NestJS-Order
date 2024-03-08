import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { BaseModel } from 'src/common/base/entity.base';
import { HASH_ROUND_KEY, JWT_SECRET_KEY } from 'src/common/const/env-path';
import { CreateOwnerDto } from 'src/owners/dto/create-owner.dto';
import { OwnersModel } from 'src/owners/entity/owners.entity';
import { OwnersService } from 'src/owners/owners.service';
import { CreateRiderDto } from 'src/riders/dto/create-rider.dto';
import { RidersModel } from 'src/riders/entity/rider.entity';
import { RidersService } from 'src/riders/riders.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersModel } from 'src/users/entity/users.entity';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService,
        private readonly ownersService: OwnersService,
        private readonly ridersService: RidersService,
        private readonly configService: ConfigService
    ) { }


    signToken<T extends UsersModel | OwnersModel | RidersModel>(user: Pick<T, 'email' | 'id'>, isRefresh: boolean) {

        const payload = {
            email: user.email,
            sub: user.id,
            type: isRefresh ? 'refresh' : 'access'

        };


        return this.jwtService.sign(payload, {
            secret: this.configService.get<string>(JWT_SECRET_KEY),
            expiresIn: isRefresh ? 3600 : 300,
        });

    };


    returnToken<T extends UsersModel | OwnersModel | RidersModel>(user: Pick<T, 'email' | 'id'>) {

        return {
            accessToken: this.signToken<T>(user, false),
            refreshToken: this.signToken<T>(user, true)
        }

    }




    async registerUserWithEmail(dto: CreateUserDto) {

        const hash = await bcrypt.hash(
            dto.password,
            parseInt(this.configService.get<string>(HASH_ROUND_KEY))
        );


        const result = await this.usersService.createUser({
            ...dto,
            password: hash
        });


        return this.returnToken<UsersModel>(result);

    };



    async registerOwnerWithEmail(dto: CreateOwnerDto) {

        const hash = await bcrypt.hash(
            dto.password,
            parseInt(this.configService.get<string>(HASH_ROUND_KEY))
        );


        const result = await this.ownersService.createOwner({
            ...dto,
            password: hash
        });


        return this.returnToken<OwnersModel>(result);

    };




    async registerRiderWithEmail(dto: CreateRiderDto) {

        const hash = await bcrypt.hash(
            dto.password,
            parseInt(this.configService.get<string>(HASH_ROUND_KEY))
        );


        const result = await this.ridersService.createRider({
            ...dto,
            password: hash
        });


        return this.returnToken<RidersModel>(result);

    };


    async UserAuthenticatedWithEmailAndPassword(user: Pick<UsersModel, 'email' | 'password'>) {

        const existEmail = await this.usersService.getUserByEmail(user.email);

        if (!existEmail) {

            throw new BadRequestException('존재 하지 않는 이메일 입니다.')
        };

        const passOk = bcrypt.compare(existEmail.password, user.password)

        if (!passOk) {
            throw new BadRequestException('패스워드가 틀렸습니다.')
        }


        return existEmail;
    };

    async RiderAuthenticatedWithEmailAndPassword(user: Pick<RidersModel, 'email' | 'password'>) {

        const existEmail = await this.ridersService.getRiderByEmail(user.email);

        if (!existEmail) {

            throw new BadRequestException('존재 하지 않는 이메일 입니다.')
        };

        const passOk = bcrypt.compare(existEmail.password, user.password)

        if (!passOk) {
            throw new BadRequestException('패스워드가 틀렸습니다.')
        }


        return existEmail;
    };



    async OwnerAuthenticatedWithEmailAndPassword(user: Pick<OwnersModel, 'email' | 'password'>) {

        const existEmail = await this.ownersService.getOwnerByEmail(user.email);

        if (!existEmail) {

            throw new BadRequestException('존재 하지 않는 이메일 입니다.')
        };

        const passOk = bcrypt.compare(existEmail.password, user.password)

        if (!passOk) {
            throw new BadRequestException('패스워드가 틀렸습니다.')
        }


        return existEmail;
    };



    async UserloginWithEmail(user: Pick<UsersModel, 'email' | 'password'>) {

        const verify = await this.UserAuthenticatedWithEmailAndPassword(user)
        return this.returnToken<UsersModel>(verify);
    };


    async OwnerloginWithEmail(user: Pick<OwnersModel, 'email' | 'password'>) {

        const verify = await this.OwnerAuthenticatedWithEmailAndPassword(user)
        return this.returnToken<OwnersModel>(verify);
    };


    async RiderloginWithEmail(user: Pick<RidersModel, 'email' | 'password'>) {

        const verify = await this.RiderAuthenticatedWithEmailAndPassword(user)
        return this.returnToken<RidersModel>(verify);
    };



    extractTokenFromHeader(header: string, isBearer: boolean) {

        const split = header.split(' ');
        const prefix = isBearer ? 'Bearer' : 'Basic';

        if (split.length !== 2 || split[0] !== prefix) {
            throw new UnauthorizedException('잘못된 토큰값입니다.')
        };


        const token = split[1];

        return token;
    };


    decodeToke(base64String: string) {

        const decode = Buffer.from(base64String, 'base64').toString('utf-8');

        const split = decode.split(':');

        if (split.length !== 2) {

            throw new UnauthorizedException('잘못된 토큰값입니다.')
        }

        const email = split[0];
        const password = split[1];

        return {
            email,
            password
        }
    };


    UserloginWithToken(rawToken: string) {

        const token = this.extractTokenFromHeader(rawToken, false);
        const result = this.decodeToke(token);

        return this.UserloginWithEmail(result)
    };

    OwnerloginWithToken(rawToken: string) {

        const token = this.extractTokenFromHeader(rawToken, false);
        const result = this.decodeToke(token);

        return this.OwnerloginWithEmail(result)
    };

    RiderloginWithToken(rawToken: string) {

        const token = this.extractTokenFromHeader(rawToken, false);
        const result = this.decodeToke(token);

        return this.RiderloginWithEmail(result)
    };




    async verifyToken(token: string) {

        try {

            const payload = await this.jwtService.verify(token, {
                secret: this.configService.get<string>(JWT_SECRET_KEY)
            });

            return payload

        } catch (e) {

            throw new UnauthorizedException('토큰이 만료되었거나, 잘못된 토큰값입니다.');

        };
    };


    async rotateToken(token: string, isRefresh: boolean) {

        const payload = await this.verifyToken(token)
        return this.signToken({
            ...payload
        }, isRefresh)
    };


    async createAccessToken(rawToken: string) {

        const token = this.extractTokenFromHeader(rawToken, true)

        const newToken = await this.rotateToken(token, false);

        return {
            accessToken: newToken,
        };
    };


    async createRefreshToken(rawToken: string) {

        const token = this.extractTokenFromHeader(rawToken, true)

        const newToken = await this.rotateToken(token, true);

        return {
            refreshToken: newToken,
        };
    };

}
