import { Injectable } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

@Injectable() // TODO: Injectable 삭제가 필요함. 그러나 어디서 주입되는지 스코프 확인이 먼저 이루어져야함.
export class MulterOptionProvider {
  /**
   * @author jochongs
   */
  static createOption(option: {
    mimetype: string[];
    limits?: number;
  }): MulterOptions {
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
