import { AxiosError } from 'axios';

export class ExtractStyleAndAgeError extends Error {
  imgList: string[];
  err: AxiosError['response'];

  constructor(message: string, err: AxiosError['response'], imgList: string[]) {
    super(message);
    this.err = err;
    this.imgList = imgList;
  }
}
