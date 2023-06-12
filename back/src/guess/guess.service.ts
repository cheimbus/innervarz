import { BadRequestException, Injectable } from '@nestjs/common';
import * as msgpack5 from 'msgpack5';
import * as fs from 'fs';
import * as path from 'path';
import { spawnSync } from 'child_process';

@Injectable()
export class GuessService {
  private msgpack: msgpack5.MessagePack;
  constructor() {
    this.msgpack = msgpack5();
  }

  /**
   * @description 전체적으로 비동기 처리를하기 위해서 async/await를 적용하였습니다. 테스트 시 한 사용자만 이용했기 때문에 javascript의 기본적인 특징인 비동기로 처리해도 문제가 없었습니다.
   * 하지만, 여러 요청을 순서대로 문제없이 처리하기 위해서는 동기적으로 해야했습니다. 다시말해 비동기 처리를 하기 위해서 async/await를 새로 적용했습니다.
   * @function guessGender 이 함수는 비즈니스 로직을 처리하는 함수입니다. controller에서 받아온 파라미터를 이용해서 가공을 하는 로직입니다.
   * @function saveImageToFile 이 함수는 controller에서 받아온 이미지 파라미터 값과 이미지 경로 (const imagePath = path.join(uploadPath, image.originalname))를 파라미터로 받아서
   * javascript의 기본 모듈인 fileSystem을 즉, fs 모듈을 이용해서 동기적으로 파일을 생성합니다. 따라서 파일을 동기적으로 생성 후에 데이터를 작성합니다. 이 작업이 끝날때까지 다음 작업이 실행이 되지 않습니다.
   * 추가적으로 이 데이터는 데이터를 최소한으로 줄이기 위해서 바이너리 형식으로 작성이 됩니다.
   * @function httpRequestToDeepLearningServerForPython 이 함수는 앞서 생성한 이미지 경로 (const imagePath = path.join(uploadPath, image.originalname))를 파라미터를 받아서 실행합니다.
   * http요청을 보내는 함수인데, 파이썬코드로 작성하고 요청해야 합니다. 따라서 nodejs 환경에서 다른 언어를 사용해서 처리할 수 있는 spawnSync 메서드를 사용하였습니다.
   * const result = spawnSync(pythonPath, ['-c', pythonCode], {
        encoding: 'utf-8',
      }); 여기서 spawnSync의 파라미터를 살펴보자면, 첫번째 파라미터로 파이썬을 실행시키는 경로를 작성해야합니다. 두번째 파라미터는 배열을 넣고 파이썬 코드를 작성하는데, pythonCode안에는 문자열로 작성이 되어있습니다. 이것을 실행시키면 문자열 자체만 보내는 것이므로 제대로 실행이 되지 않습니다. 따라서 이것을 알맞게 실행시키기 위해서 '-c' 옵션을 추가해서 작성하였습니다.
      또한 인코드를 하여 결과값을 제대로 받을 수 있게 설정하였습니다.
     결과값은 0.99999999 이런식으로 리턴됩니다.
   * @function cleanupImage 이 함수는 이미지 경로를 받아와서 동기적으로 해당 파일을 삭제하는 함수입니다.
   * @function getGenderRatio 이 함수는 @httpRequestToDeepLearningServerForPytion 함수가 리턴한 값을 파라미터를 받아서 처리합니다. 1에 근사치일 수록 남성이므로 이를 가공해서 처리하는 함수입니다.
   * @param image guessGender의 파라미터값인 이미지 데이터가 담겨져 있습니다.
   * @returns @getGenderRatio 함수에서 처리한 값을 리턴합니다.
   */
  async guessGender(image: Express.Multer.File) {
    if (!image) {
      throw new BadRequestException('이미지를 전달받지 못했습니다.');
    }

    const uploadPath = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }

    const imagePath = path.join(uploadPath, image.originalname);
    
    await this.saveImageToFile(image, imagePath);

    const deepLearningServerReturnValue = await this.httpRequestToDeepLearningServerForPython(imagePath);

    await this.cleanupImage(imagePath);

    return await this.getGenderRatio(+deepLearningServerReturnValue);
  }

  async saveImageToFile(image: Express.Multer.File, imagePath: string) {
    fs.writeFileSync(imagePath, image.buffer);
  }

  async cleanupImage(imagePath: string) {
    fs.unlinkSync(imagePath);
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

  async httpRequestToDeepLearningServerForPython(imagePath: string) {
    try {
      const pythonPath = 'python3';
      const pythonCode = `
import msgpack
import requests
import base64

with open('${imagePath}', 'rb') as f:
    img_bytes = f.read()
    payload = msgpack.packb({"img": img_bytes})
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
}
