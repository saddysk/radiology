import { Injectable } from '@nestjs/common';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import s3 from 'src/config/aws.config';
import { AppConfig } from 'src/config/config';

export enum StorageFileTypes {
  REPORT = 'report',
}

const CONFIG = AppConfig();

@Injectable()
export class StorageService {
  async store(
    type: StorageFileTypes,
    fileName: string,
    file: Buffer,
  ): Promise<string> {
    const filePath = `${type}/${fileName}`;

    const params = {
      Bucket: CONFIG.S3_BUCKET,
      Key: filePath,
      Body: file,
      ACL: 'public-read',
    };

    // Upload the object to S3
    const uploadedPath = await new Promise((resolve, reject) => {
      s3.upload(params, (err: Error, data: ManagedUpload.SendData) => {
        if (err) {
          console.error('Error uploading to S3.\n', err);
          reject(err);
        } else {
          resolve(data.Location);
        }
      });
    });

    return uploadedPath as string;
  }
}
