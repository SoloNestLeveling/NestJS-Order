import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrdersModel } from './entity/orders.entity';
import { QueryRunner, Repository, TreeLevelColumn } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UsersService } from 'src/users/users.service';
import { RestaurantsService } from 'src/restaurants/restaurants.service';
import { SendOrderDto } from '../users/dto/send-order.dto';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(OrdersModel)
        private readonly ordersRepository: Repository<OrdersModel>,

    ) { }


    getRepository(qr?: QueryRunner) {
        return qr ? qr.manager.getRepository<OrdersModel>(OrdersModel) : this.ordersRepository
    }


    async createOrder(dto: CreateOrderDto, userId: number, resId: number, qr?: QueryRunner) {

        const repository = this.getRepository()

        const { orderNumber, userAddress, userName, userPhone, menus } = dto

        const orderObj = repository.create({
            user: {
                id: userId
            },
            restaurant: {
                id: resId
            },
            orderNumber,
            userName,
            userAddress,
            userPhone,
            menus,

        });

        const order = await repository.save(orderObj);


        return order;
    };






    async getAllOrdersByRes(resId: number) {

        const orders = await this.ordersRepository.find({
            where: {
                restaurant: {
                    id: resId
                }
            }
        })

        return orders;
    };



    async getSpecificOrder(resId: number, orderNumber: number) {

        const order = await this.ordersRepository.findOne({
            where: {
                orderNumber: orderNumber,
                restaurant: {
                    id: resId
                },
            },
            select: {
                id: true,
                orderNumber: true,
                userName: true,
                userAddress: true,
                userPhone: true,
                isAllowed: true,
                status: true,
                menus: true,
            }
        });


        return order;
    }
}
