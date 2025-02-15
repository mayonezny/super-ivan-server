import { Injectable } from '@nestjs/common';
import * as Minio from 'minio';

// Далее используем Sequelize.fn

@Injectable()
export class MinioService {
  private readonly minioClient: Minio.Client;
  constructor() {
    this.minioClient = new Minio.Client({
      endPoint: 'localhost',
      port: 9000,
      useSSL: false,
      accessKey: 'minioadmin',
      secretKey: 'minioadmin',
    });
  }

  async uploadFile(bucketName: string, fileName: string, fileBuffer: Buffer) {
    try {
      await this.minioClient.putObject(bucketName, fileName, fileBuffer);
      return { message: 'File uploaded successfully' };
    } catch (err) {
      throw new Error(`Error uploading file: ${err.message}`);
    }
  }

  createUrl(bucketname: string, path: string){
    return this.minioClient.presignedGetObject(bucketname, path);
  }

}
