import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersModel } from './entity/users.entity';
import { QueryRunner, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { RestaurantsService } from 'src/restaurants/restaurants.service';
import { OrdersService } from 'src/orders/orders.service';
import { SendOrderDto } from './dto/send-order.dto';


@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(UsersModel)
        private readonly usersRepository: Repository<UsersModel>,
        private readonly restaurantsService: RestaurantsService,
        private readonly ordersService: OrdersService,
    ) { }


    async createUser(dto: CreateUserDto) {

        const { email, password, nickname, address, phoneNumber } = dto;


        const existEmail = await this.usersRepository.exists({
            where: {
                email,
            }
        });

        if (existEmail) {
            throw new BadRequestException('이미 존재하는 이메일입니다.')
        };



        const existNickname = await this.usersRepository.exists({
            where: {
                nickname,
            }
        });

        if (existNickname) {

            throw new BadRequestException('이미 존재하는 닉네임입니다.')
        }


        const user = this.usersRepository.create({
            email,
            password,
            nickname,
            address,
            phoneNumber,
        });

        const result = await this.usersRepository.save(user);

        return result;
    };


    async getUserByEmail(email: string) {

        const user = await this.usersRepository.findOne({
            where: {
                email,
            }
        });

        return user;
    }


    async getUserById(id: number) {

        const user = await this.usersRepository.findOne({
            where: {
                id,
            }
        });

        return user;
    }


    async getAllUser() {
        const user = await this.usersRepository.find({
            relations: ['orders']
        })

        return user;
    };



    async sendOrder(dto: SendOrderDto, userId: number, qr?: QueryRunner) {


        const user = await this.getUserById(userId);
        const res = await this.restaurantsService.getResById(dto.resId);
        console.log(res.menus)
        const prevOrders = await this.ordersService.getAllOrdersByRes(dto.resId)

        const order = await this.ordersService.createOrder({
            orderNumber: prevOrders.length ? prevOrders.length + 1 : 1,
            userName: user.nickname,
            userPhone: user.phoneNumber,
            userAddress: user.address,
            menus: await this.orderMenu(dto.resId, dto.menuNumber)
        }, userId, dto.resId);


        return order;
    }


    async orderMenu(resId: number, menuNumber: number[]) {

        const res = await this.restaurantsService.getResById(resId)

        const ordermenu = res.menus.filter((a) => menuNumber.includes(a.menuNumber))

        const menuObj = ordermenu.map((a) => ({
            menuNumber: a.menuNumber,
            menuName: a.menuName,
            menuPrice: a.menuPrice
        }));

        return menuObj;
    }




}
