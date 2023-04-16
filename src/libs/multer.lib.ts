import { Request } from 'express';
import { diskStorage, StorageEngine } from 'multer';
import { v4 as uuidv4 } from 'uuid';

const formatAllowed = ['image/jpeg', 'image/png', 'image/jpg'];

export const multerFilter = (request: Request, file, cb) => {
  if (formatAllowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const multerStorage = diskStorage({
  destination: './public',
  filename: function (req, file, cb) {
    const ext = file.mimetype.split('/')[1];
    cb(null, `${uuidv4()}-${Date.now()}.${ext}`);
  },
});

export class MulterConfig {
  public filePath: string;
  public multerStorage: StorageEngine;
  public multerFilter: any;

  constructor(filePath: string) {
    this.filePath = `./public/${filePath}/`;

    this.multerStorage = diskStorage({
      destination: this.filePath,
      filename: function (req, file, cb) {
        const ext = file.mimetype.split('/')[1];
        cb(null, `${uuidv4()}-${Date.now()}.${ext}`);
      },
    });

    this.multerFilter = (request: Request, file, cb) => {
      if (formatAllowed.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(null, false);
      }
    };
  }
}
