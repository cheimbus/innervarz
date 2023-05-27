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

  async guessGender(image: Express.Multer.File) {
    if (!image) {
      throw new BadRequestException('이미지를 전달받지 못했습니다.');
    }

    const uploadPath = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }

    const imagePath = path.join(uploadPath, image.originalname);
    this.saveImageToFile(image, imagePath);

    const deepLearningServerReturnValue = this.httpRequestToDeepLearningServerForPython(imagePath);

    this.cleanupImage(imagePath);

    return this.getGenderRatio(+deepLearningServerReturnValue);
  }

  saveImageToFile(image: Express.Multer.File, imagePath: string) {
    fs.writeFileSync(imagePath, image.buffer);
  }

  cleanupImage(imagePath: string) {
    fs.unlinkSync(imagePath);
  }

  getGenderRatio(data: number) {
    if (data >= 0.501) {
      const ratio = Math.trunc(data * 100);
      return `${ratio}% male`;
    } else {
      const ratio = Math.trunc((1 - data) * 100);
      return `${ratio}% female`;
    }
  }

  httpRequestToDeepLearningServerForPython(imagePath: string) {
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
