import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CommonService } from './common.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('common')
export class CommonController {
  constructor(private readonly commonService: CommonService) { }



  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  tempImg(
    @UploadedFile() file: Express.Multer.File
  ) {

    return {
      filename: file.filename
    }
  }
}
