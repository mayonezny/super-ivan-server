
import { Controller, Post, Req } from '@nestjs/common';
import { MinioService } from './minio.service';
import { FastifyRequest } from 'fastify';

interface FileUploadBody {
  pic: {
    fieldname: string;
    filename: string;
    mimetype: string;
    size: number;
    encoding: string;
    file: any; // Это поток
    toBuffer: () => Promise<Buffer>;
  };
}

@Controller('api/posts')
export class MinioController {
  constructor(private readonly minioService: MinioService) {}

  @Post('postPicImgSave')
  async uploadFile(@Req() req: FastifyRequest) {

    const body = req.body as FileUploadBody;
    const pic = body.pic;
    if (!pic) {
      throw new Error('No file uploaded');
    }
    const buffer = await pic.toBuffer();
    try {
      const result = await this.minioService.uploadFile('postimgs', pic.filename, buffer);
      const url = await this.minioService.createUrl('postimgs', pic.filename);
      console.log(url);  // Ссылка на файл

      return { url: url };
    } catch (error) {
      console.error('Ошибка при загрузке файла в MinIO:', error);
      throw new Error('Ошибка при загрузке файла');
    }
  }
}
//пример тестовых данных:
// {
//   "pic": "/babka.png",
//   "title": "иВАaaaaaaНЧУК",
//   "author": "Zaparaaaaaa",
//   "content": "ОГО Уaaaaa"
//   }
