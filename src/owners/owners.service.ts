import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OwnersModel } from './entity/owners.entity';
import { Repository } from 'typeorm';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { OrdersService } from 'src/orders/orders.service';
import { RestaurantsService } from 'src/restaurants/restaurants.service';
import { OrderStatusEnum } from 'src/orders/enum/order-status.enum';
import { RidersService } from 'src/riders/riders.service';
import { StatusRiderEnum } from 'src/riders/enum/status.enum';
import { OrdersModel } from 'src/orders/entity/orders.entity';
import { RidersModel } from 'src/riders/entity/rider.entity';
import { RestaurantsModel } from 'src/restaurants/entity/restaurants.entity';
import { AllowOrderDto } from './dto/allow-order.dto';

@Injectable()
export class OwnersService {
    constructor(
        @InjectRepository(OwnersModel)
        private readonly ownersRepository: Repository<OwnersModel>,
        @InjectRepository(OrdersModel)
        private readonly ordersRepository: Repository<OrdersModel>,
        private readonly ordersService: OrdersService,
        @InjectRepository(RidersModel)
        private readonly ridersRepository: Repository<RidersModel>,
        @InjectRepository(RestaurantsModel)
        private readonly restaurantsRepository: Repository<RestaurantsModel>,
        private readonly restaurantsService: RestaurantsService,
        private readonly ridersService: RidersService
    ) { }


    async createOwner(dto: CreateOwnerDto) {

        const { email, password, representativeName, businessNumber } = dto;


        const existEmail = await this.ownersRepository.exists({
            where: {
                email,
            }
        });

        if (existEmail) {

            throw new BadRequestException('이미 존재하는 이메일입니다.')
        }


        const owner = this.ownersRepository.create({
            email,
            password,
            representativeName,
            businessNumber,
        });

        const result = await this.ownersRepository.save(owner);

        return result;
    };


    async getOwnerByEmail(email: string) {

        const owner = await this.ownersRepository.findOne({
            where: {
                email,
            }
        });

        return owner;
    };



    async getAllOwner() {
        const owner = await this.ownersRepository.find()
        return owner;
    };



    async getOwnerByid(id: number) {

        const owner = await this.ownersRepository.findOne({
            where: {
                id,
            },
            relations: ['restaurants']
        });

        return owner;
    };




    async allowOrder(dto: AllowOrderDto, ownerId: number): Promise<boolean> {

        const res = await this.restaurantsService.getResByOwnerId(ownerId);

        const order = await this.ordersService.getSpecificOrder(res.id, dto.orderNumber);
        console.log(order)

        try {

            if (order) {

                order.isAllowed = true;
                order.status = OrderStatusEnum.COOKING;
                await this.ordersRepository.save(order)
            };


            const longerWaitingRider = await this.longerWaitingRider()


            if (longerWaitingRider) {

                longerWaitingRider.status = StatusRiderEnum.PICKUP;
                longerWaitingRider.orderList.push(order)

                await this.ridersRepository.save(longerWaitingRider)
            };



            const orderStrPrice = order.menus.map((a) => a.menuPrice);
            const numberPrice = orderStrPrice.map((a) => parseInt(a.replace(',', '')));
            const total = numberPrice.reduce((p, n) => p + n, 0)

            const privTotal = parseInt(res.totalSales, 10);



            res.totalSales = `${privTotal + total}원`
            await this.restaurantsRepository.save(res)




            return true;

        } catch (err) {

            throw new InternalServerErrorException('승인중 에러 발생')

        }

    };



    async longerWaitingRider() {

        const pendingRider = await this.ridersService.getAllPendingRider()

        if (pendingRider) {

            const convertTimeStr = pendingRider.map((rider) => {

                const [hourString, minuteString, secondString] = rider.waitingTime.split(':').map((a) => parseInt(a, 10));

                const hoursInSeconeds = hourString * 3600;
                const minutesInSeconds = minuteString * 60;
                const numberWaitingTime = hoursInSeconeds + minutesInSeconds + secondString


                return {
                    ...rider,
                    numberWaitingTime,
                };
            });


            const longerWaiting = convertTimeStr.reduce((p, n) => {
                return p && p.numberWaitingTime >= n.numberWaitingTime ? p : n
            });

            return longerWaiting;

        };


    };
}
