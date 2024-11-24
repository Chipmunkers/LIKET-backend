import { Injectable } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

@Injectable()
export class MulterOptionProvider {
  static createOption(option: { mimetype: string[]; limits?: number }): MulterOptions {
    return {
      fileFilter: (req, file, cb) => {
        if (!option.mimetype.includes(file.mimetype)) {
          return cb(null, false);
        }
        return cb(null, true);
      },
      limits: {
        fileSize: option.limits || 1024 * 1024 * 1,
      },
    };
  }
}
