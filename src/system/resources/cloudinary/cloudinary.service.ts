import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');
@Injectable()
export class CloudinaryService {
  async uploadFile(files: Array<Express.Multer.File>) {
    for (const file of files) {
      const fileType = this.checkFileType(file);

      const UploadedFiles = await this.cloudinaryUpload(file);
      return UploadedFiles;
    }
  }

  private cloudinaryUpload(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream((error, result) => {
        if (error) return reject(error);

        resolve(result);
      });
      toStream(file.buffer).pipe(upload);
    });
  }

  private checkFileType(file: Express.Multer.File) {
    const fileTypes = /jpeg|jpg|png|gif|mp4/;
    const mimeType = fileTypes.test(file.mimetype);

    if (mimeType) {
      console.log(true);
      return true;
    } else {
      throw new Error('Error: Please upload images and videos only!!!');
    }
  }
}
