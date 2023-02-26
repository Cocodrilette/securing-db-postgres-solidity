import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  UploadedFile,
  Param,
  Res,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter, fileNamer } from './helpers';
import { diskStorage } from 'multer';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  @Get('product/:ruid' /*Resource ID*/)
  @ApiResponse({
    status: 200,
  })
  findOneProductImage(@Res() res: Response, @Param('ruid') ruid: string) {
    const result = this.filesService.findOneProductImage(ruid);

    res.status(200).sendFile(result.res);
  }

  @Post('upload/product')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
      limits: { fileSize: 5.2 * 1_000_000 }, // =~ 5 Megabytes
      storage: diskStorage({
        destination: './static/products',
        filename: fileNamer,
      }),
    }),
  )
  @ApiResponse({
    status: 200,
    description: 'File uploaded',
  })
  uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    const secureUrl = `${this.configService.get('hostAPI')}/files/product/${
      file.filename
    }`;

    return this.filesService.upload(secureUrl);
  }
}
