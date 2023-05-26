// node.js http requests code
// import { Injectable } from '@nestjs/common';
// import axios from 'axios';
// import * as msgpack5 from 'msgpack5';
// import * as path from 'path';
// import * as fs from 'fs';
// @Injectable()
// export class GuessService {
//   private msgpack: msgpack5.MessagePack;

//   constructor() {
//     this.msgpack = msgpack5();
//   }

//   async guessImage(image: Express.Multer.File): Promise<any> {
//     const messagePackData = this.msgpack.encode({ img: image.buffer });

//     const url = 'http://52.78.66.213:7929/gender_filter';
//     const headers = { 'Content-Type': 'application/msgpack' };

//     const response = await axios.post(url, messagePackData, {
//       headers,
//     });
//     console.log(response);

//     const result = this.msgpack.decode(response.data);
//     console.log(result);
//     return result['result'];
//   }
// }

import { BadRequestException, Injectable } from '@nestjs/common';
import * as msgpack5 from 'msgpack5';
import { spawnSync } from 'child_process';
import * as path from 'path';

@Injectable()
export class GuessService {
  private msgpack: msgpack5.MessagePack;
  constructor() {
    this.msgpack = msgpack5();
  }
  async guessGender(number: number) {
    if (+number < 1 || +number > 5) {
      throw new BadRequestException('잘못된 요청입니다.');
    }
    // const messagePackData = this.msgpack.encode({ img: image.buffer }); // 클라이언트에서 이미지를 받아올 때 직렬화한 값
    const deepLearningServerReturnValue =
      await this.httpRequestToDeepLearningServerForPython(number);
    return await this.getGenderRatio(+deepLearningServerReturnValue);
  }

  async getGenderRatio(data: number) {
    if (data >= 0.501) {
      const ratio = Math.trunc(data * 100);
      return `${ratio}% male`;
    } else {
      const ratio = Math.trunc((1 - data) * 100);
      return `${ratio}% female`;
    }
  }

  async httpRequestToDeepLearningServerForPython(
    number: number,
  ): Promise<string> {
    try {
      const imageName = `face${number}.png`;
      const currentPath = path.dirname(require.main.filename);
      const absoluteImagePath = path.join(
        currentPath,
        `../src/images/${imageName}`,
      );
      const pythonPath = 'python3';
      const pythonCode = `
import msgpack
import requests
join = '${absoluteImagePath}'
img = open("${absoluteImagePath}", 'rb').read()
payload = msgpack.packb({
    "img": img
})
response = requests.post("http://52.78.66.213:7929/gender_filter", payload)
result = msgpack.unpackb(response.content)
print(result['result'])
`;

      const result = spawnSync(pythonPath, ['-c', pythonCode], {
        encoding: 'utf-8',
      });
      return result.stdout;
    } catch (err) {
      return err;
    }
  }

  async getImage(number: number) {
    try {
      if (+number < 1 || +number > 5) {
        throw new BadRequestException('잘못된 요청입니다.');
      }
      const imageName = `face${number}.png`;
      // 배포 후 url수정해야 됨
      return `http://localhost:8080/images/${imageName}`;
    } catch (err) {
      return err;
    }
  }
}
