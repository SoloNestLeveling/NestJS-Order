import { BadRequestException, Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';
import { MulterModule } from '@nestjs/platform-express';
import { extname, join } from 'path';
import * as multer from 'multer';
import { v4 as uuid } from 'uuid';
import { TEMP_FOLDER_PATH } from './const/image-path.const';

@Module({
  imports: [
    MulterModule.register({
      limits: {
        fileSize: 1000000
      },
      fileFilter: function (res, file, fn) {

        const ext = extname(file.originalname);

        if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {

          return fn(new BadRequestException('.jpg/.jpeg/.png 확장자만 업로드 가능합니다.'), false)
        } else {
          return fn(null, true)
        }
      },

      storage: multer.diskStorage({
        destination: function (res, req, fn) {

          fn(null, `/${join(TEMP_FOLDER_PATH)}`)
        },
        filename: function (res, file, fn) {

          fn(null, `${uuid()}${extname(file.originalname)}`)
        }
      }),
    }),
  ],
  exports: [CommonService],
  controllers: [CommonController],
  providers: [CommonService],
})
export class CommonModule { }
