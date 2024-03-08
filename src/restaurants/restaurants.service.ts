import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RestaurantsModel } from './entity/restaurants.entity';
import { Repository } from 'typeorm';
import { CreateResDto } from './dto/create-res.dto';
import { ResPaginationDto } from './dto/res-pagination.dto';
import { CommonService, ValueHandler, } from 'src/common/common.service';

@Injectable()
export class RestaurantsService {
    constructor(
        @InjectRepository(RestaurantsModel)
        private readonly restaurantsRepository: Repository<RestaurantsModel>,
        private readonly commonService: CommonService

    ) { }


    async createRes(dto: CreateResDto, ownerId: number) {

        const { name, address, contactInfo, totalSales } = dto

        const res = this.restaurantsRepository.create({
            owner: {
                id: ownerId
            },
            name,
            address,
            contactInfo,
            totalSales,
        });

        const result = await this.restaurantsRepository.save(res);

        return result;
    };


    async getResById(id: number) {
        const res = await this.restaurantsRepository.findOne({
            where: {
                id,
            },
            relations: ['owner', 'menus', 'menus.images', 'menus.reviews', 'orders'],
        });

        return res;
    };


    async getResAll() {

        const res = await this.restaurantsRepository.find();

        return res;
    };


    async getResByOwnerId(ownerId: number) {

        const res = await this.restaurantsRepository.findOne({
            where: {
                owner: {
                    id: ownerId
                }
            }
        });

        return res;
    }




    async resPaginate(dto: ResPaginationDto) {

        // const handler: ValueHandler<RestaurantsModel> = (result) => {

        //     const restaurants = result.map((res) => {
        //         const menuObj = res.menus.map((menu) => {
        //             try {
        //                 return JSON.parse(menu.menu)

        //             } catch (e) {
        //                 throw new BadRequestException()

        //             };
        //         });

        //         return {
        //             ...res,
        //             menus: menuObj.flat()
        //         }
        //     });

        //     return restaurants;
        // };



        return this.commonService.paginate(
            dto,
            this.restaurantsRepository,
            {
                relations: ['menus', 'menus.images']
            },
            'restaurants',

        );
    };


}
