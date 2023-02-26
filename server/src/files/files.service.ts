import { BadRequestException, Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';

type ValidMessages = 'Image found' | 'Image not found' | 'Uploaded succesfully';

export interface FileServiceResponse {
  ok: boolean;
  message: ValidMessages;
  res: string;
}

@Injectable()
export class FilesService {
  // *
  findOneProductImage(ruid: string) {
    const path = join(__dirname, '../../static/products', ruid);

    if (readFileSync(path)) {
      return this.parseResult(true, 'Image found', path);
    }

    throw new BadRequestException({
      ok: false,
      message: 'Image not found',
      res: ruid,
    });
  }

  // *
  upload(secureUrl) {
    return this.parseResult(true, 'Uploaded succesfully', secureUrl);
  }

  private parseResult(
    ok: boolean,
    message: ValidMessages,
    res: string,
  ): FileServiceResponse {
    return {
      ok,
      message,
      res,
    };
  }
}

// {
//   fieldname: 'file',
//   originalname: 'ethereum.png',
//   encoding: '7bit',
//   mimetype: 'image/png',
//   destination: './static/products',
//   filename: 'prod-abc95cb9-6b24-556f-83c8-3cefe2f171ab.png',
//   path: 'static/products/prod-abc95cb9-6b24-556f-83c8-3cefe2f171ab.png',
//   size: 14904
// }
