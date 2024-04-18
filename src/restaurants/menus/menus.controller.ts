import { Body, Controller, Param, ParseIntPipe, Post, UseGuards, UseInterceptors } from "@nestjs/common";
import { AccessTokenGuard } from "src/auth/guard/bearer-token.guard";
import { ImagesService } from "src/images/images.service";
import { OwnersModel } from "src/owners/entity/owners.entity";
import { CreateMenuDto } from "./dto/create-menu.dto";
import { MenusService } from "./menus.service";
import { ImageTypeEnum } from "src/images/enum/image.enum";
import { Owner } from "src/owners/decorator/owner.decorator";
import { ReqQueryRunner } from "src/common/decorator/req-query-runner.decorator";
import { QueryRunner } from "typeorm";

@Controller('menus')
export class MenusController {

    constructor(
        private readonly imagesService: ImagesService,
        private readonly menusService: MenusService
    ) { }



    @Post(':resId')
    @UseGuards(AccessTokenGuard)
    async createMenu(
        @Body() dto: CreateMenuDto,
        @Owner() owner: OwnersModel,
        @Param('resId', ParseIntPipe) resId: number,
    ) {
        const menu = await this.menusService.createMenu(dto, owner.id, resId);


        if (menu) {

            for (let i = 0; i < dto.images.length; i++) {

                await this.imagesService.createMenuImg({
                    order: i + 1,
                    type: ImageTypeEnum.MENU_IMAGE,
                    path: dto.images[i],
                    menu,

                })
            }
        }

        return this.menusService.getMenuById(menu.id)
    }


}
