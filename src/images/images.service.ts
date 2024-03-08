import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImagesModel } from './entity/images.entity';
import { privateDecrypt } from 'crypto';
import { QueryRunner, Repository } from 'typeorm';
import { CreateMenuImgDto } from './dto/create-img.dto';
import { promises } from 'fs'
import { basename, join } from 'path';
import { MENU_FOLDER_PATH, REVIEW_FOLDER_PATH, TEMP_FOLDER_PATH } from 'src/common/const/image-path.const';
import { CreateReviewImageDto } from './dto/create-review-img.dto';

@Injectable()
export class ImagesService {


    constructor(
        @InjectRepository(ImagesModel)
        private readonly imagesRepository: Repository<ImagesModel>
    ) { }


    getRepository(qr?: QueryRunner) {
        return qr ? qr.manager.getRepository<ImagesModel>(ImagesModel) : this.imagesRepository
    }


    async createMenuImg(dto: CreateMenuImgDto, qr?: QueryRunner) {

        const repository = this.getRepository(qr)

        const tempfile = join(
            TEMP_FOLDER_PATH,
            dto.path
        );

        promises.access(tempfile)

        const newFilePath = basename(tempfile)


        const newFile = join(
            MENU_FOLDER_PATH,
            newFilePath
        );

        const result = await repository.save(dto);


        promises.rename(tempfile, newFile);


        return result;
    };



    async createReviewImg(dto: CreateReviewImageDto) {


        const tempfile = join(
            TEMP_FOLDER_PATH,
            dto.path
        );

        promises.access(tempfile)

        const newFilePath = basename(tempfile)


        const newFile = join(
            REVIEW_FOLDER_PATH,
            newFilePath
        );

        const result = await this.imagesRepository.save(dto);


        promises.rename(tempfile, newFile);


        return result;
    };


}
