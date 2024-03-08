import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RidersModel } from './entity/rider.entity';
import { QueryRunner, Repository } from 'typeorm';
import { CreateRiderDto } from './dto/create-rider.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { StatusRiderEnum } from './enum/status.enum';
import { OrdersModel } from 'src/orders/entity/orders.entity';
import { OrderStatusEnum } from 'src/orders/enum/order-status.enum';


@Injectable()
export class RidersService {
    constructor(
        @InjectRepository(RidersModel)
        private readonly ridersRepository: Repository<RidersModel>,
        @InjectRepository(OrdersModel)
        private readonly ordersRepository: Repository<OrdersModel>
    ) { }




    getRepository(qr?: QueryRunner) {

        return qr ? qr.manager.getRepository<RidersModel>(RidersModel) : this.ridersRepository
    };




    async createRider(dto: CreateRiderDto) {

        const { email, password } = dto;

        const existEmail = await this.ridersRepository.exists({
            where: {
                email,
            }
        });

        if (existEmail) {

            throw new BadRequestException('이미 존재하는 이메일입니다.')
        }


        const rider = this.ridersRepository.create({
            email,
            password
        });

        const result = await this.ridersRepository.save(rider);

        return result;
    };


    async getRiderByEmail(email: string) {

        const rider = await this.ridersRepository.findOne({
            where: {
                email,
            }
        });

        return rider;
    }


    async getAllRider() {
        const rider = await this.ridersRepository.find()
        return rider;
    }


    async getAllPendingRider() {
        const rider = await this.ridersRepository.find({
            where: {
                status: StatusRiderEnum.PENDING
            }
        })
        return rider;
    }


    @Cron(CronExpression.EVERY_SECOND)
    async riderWaitingTime() {

        const rider = await this.getAllRider();

        rider.forEach((rider) => {

            if (rider.status === StatusRiderEnum.PENDING) {

                if (!rider.watingStartTime) {

                    rider.watingStartTime = new Date();
                } else {

                    const currentTime = new Date();
                    const elapsedTimeInSeconds = Math.floor((currentTime.getTime() - rider.watingStartTime.getTime()) / 1000);

                    rider.waitingTime = this.changeNumberTimeToString(elapsedTimeInSeconds)
                }
            } else {

                rider.waitingTime = null;
                rider.watingStartTime = null;
            };
        });

        await this.ridersRepository.save(rider)
    }

    changeNumberTimeToString(elapsedTimeInSeconds: number) {


        const hours = Math.floor(elapsedTimeInSeconds / 3600)
        const minutes = Math.floor((elapsedTimeInSeconds % 3600) / 60)
        const seconds = elapsedTimeInSeconds % 60

        return `${hours}시간:${minutes}분:${seconds}초`
    };


    async getRiderById(id: number) {
        const rider = await this.ridersRepository.findOneBy({ id });

        return rider;
    }



    async pickupStuff(riderId: number, qr?: QueryRunner): Promise<boolean> {

        const repository = this.getRepository(qr)

        const deliveringRider = await repository.findOne({
            where: {
                id: riderId,
                status: StatusRiderEnum.PICKUP
            }
        });

        const reqOrder = deliveringRider.orderList[0] as OrdersModel





        if (reqOrder.status === OrderStatusEnum.COOKING) {

            reqOrder.status = OrderStatusEnum.DELIVERING;
            await this.ordersRepository.save(reqOrder)
        };


        if (deliveringRider) {

            deliveringRider.status = StatusRiderEnum.DELIVERING
            await repository.save(deliveringRider)
        }

        return true;

    };




    async completeDelivery(riderId: number, qr?: QueryRunner) {

        const repository = this.getRepository(qr)

        const deliveringRider = await repository.findOne({
            where: {
                id: riderId,
                status: StatusRiderEnum.DELIVERING
            }
        });

        const reqOrder = deliveringRider.orderList[0] as OrdersModel



        if (deliveringRider.status === StatusRiderEnum.PENDING) {
            throw new InternalServerErrorException()
        }


        if (reqOrder) {

            reqOrder.status = OrderStatusEnum.COMPLETE;
            await this.ordersRepository.save(reqOrder)
        };


        if (deliveringRider) {

            deliveringRider.status = StatusRiderEnum.COMPLETE
            await repository.save(deliveringRider)
        }

        return true;



    };



    async canRecevieOrder(riderId: number, qr?: QueryRunner): Promise<boolean> {

        const repository = this.getRepository(qr)

        const rider = await repository.findOne({
            where: {
                id: riderId,
                status: StatusRiderEnum.COMPLETE
            }
        });

        if (rider) {

            rider.status = StatusRiderEnum.PENDING
            rider.orderList.pop()
            await repository.save(rider)
        } else {

            throw new InternalServerErrorException()
        }

        return true;
    }

}
