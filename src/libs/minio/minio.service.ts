import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';

import { BufferedFile } from './minio.file.lib';
import * as crypto from 'crypto';

@Injectable()
export default class MinioClientService {
  constructor(private readonly minio: MinioService) {}

  private readonly bucketName = process.env.MINIO_BUCKET_NAME || 'gademap';

  public get client() {
    return this.minio.client;
  }

  public async getURL(path: string) {
    try {
      const url = await this.client.presignedGetObject(
        this.bucketName,
        path,
        24 * 60 * 60,
      );
      if (url) return url;
      return null;
    } catch (err) {
      return null;
    }
  }

  public async upload(file: BufferedFile, folder: string) {
    if (!(file.mimetype.includes('jpeg') || file.mimetype.includes('png'))) {
      throw new HttpException(
        'File type not supported',
        HttpStatus.BAD_REQUEST,
      );
    }
    const timestamp = Date.now().toString();
    const hashedFileName = crypto
      .createHash('md5')
      .update(timestamp)
      .digest('hex');
    const extension = file.originalname.substring(
      file.originalname.lastIndexOf('.'),
      file.originalname.length,
    );

    const fileName = hashedFileName + extension;

    this.client.putObject(
      this.bucketName,
      `${folder}/${fileName}`,
      file.buffer,
      // metaData,
      (err) => {
        if (err) {
          throw new HttpException(
            'Error uploading file',
            HttpStatus.BAD_REQUEST,
          );
        }
      },
    );

    return `${folder}/${fileName}`;
  }

  async delete(path: string) {
    this.client.removeObject(this.bucketName, path, () => (err: any) => {
      if (err)
        throw new HttpException(
          'An error occured when deleting!',
          HttpStatus.BAD_REQUEST,
        );
    });
  }
}
