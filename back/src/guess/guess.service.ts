/**
 * @description 해당 코드는 nodejs에서 http요청을 보내는 코드입니다.
 * 현재 딥러닝서버에서는 python 코드만 request받게 되어있어서 이 코드를 이용하면 -17으로 통일된 값을 받습니다. 따라서 원하는 값을 얻을 수 없습니다.
 */
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

  /**
   * @param number controller에서 받은 number값으로 비즈니스 로직을 수행합니다.
   * @function guessGender 이 함수는 @httpRequestToDeepLearningServerForPython , @getGenderRatio 을 실행합니다.
   * @function httpRequestToDeepLearningServerForPython 이 함수는 서버에 가지고있는 이미지를 이용해서 받아온 count에 알맞은 이미지를 가져오고, 파이썬코드를 이용해서 딥러닝 서버에 http요청을 보내는 함수입니다.
   * @return 딥러닝 서버에서 받은 리턴값입니다. (ex: 0.9994483727)
   * @function getGenderRatio 이 함수는 @httpRequestToDeepLearningServerForPython 여기서 받은 값을 이용해 99% female 형태로 변환시켜주는 함수입니다.
   * @return (ex: 99% female)
   * @function getImage 이 함수는 count에 맞는 정적 이미지 경로를 리턴합니다.
   */
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
      return `http://13.125.211.113:7929/image/${imageName}`;
    } catch (err) {
      return err;
    }
  }
}
