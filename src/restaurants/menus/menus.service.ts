import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MenusModel } from "./entity/menus.entity";
import { QueryRunner, Repository } from "typeorm";
import { CreateMenuDto } from "./dto/create-menu.dto";
import { OwnersService } from "src/owners/owners.service";

@Injectable()
export class MenusService {

    constructor(
        @InjectRepository(MenusModel)
        private readonly menusRepository: Repository<MenusModel>,
        private readonly ownersService: OwnersService
    ) { }


    getRepository(qr?: QueryRunner) {

        return qr ? qr.manager.getRepository<MenusModel>(MenusModel) : this.menusRepository
    }


    async createMenu(dto: CreateMenuDto, ownerId: number, resId: number, qr?: QueryRunner) {

        const repository = this.getRepository()

        const owner = await this.ownersService.getOwnerByid(ownerId)

        const res = owner.restaurants.find((a) => a.id === resId)

        const menu = repository.create({
            restaurant: {
                id: res.id
            },
            menuNumber: dto.menuNumber,
            menuName: dto.menuName,
            menuPrice: dto.menuPrice,
            images: []
        });

        const result = await repository.save(menu)

        return result;
    };


    async getMenuById(id: number) {

        const menu = await this.menusRepository.findOne({
            where: {
                id,
            },
            relations: ['images', 'reviews']
        });

        return menu;
    }


}