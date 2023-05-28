## 1. 서비스 개요
- 딥러닝 모델을 이용해서 성별을 판단하고 퍼센티지를 얻을 수 있는 서비스
- 배포 주소 http://invzpretask01.click

## 2. 딥러닝 서비스 흐름
> 딥러닝 모델서버 <=> 서버 <=> 클라이언트 <=> 사용자

## 3. 개발환경
- `Node 16.17.0`
- `npm v8.15.0`
- `NestJS 9.2`
- `Python3 3.11.3`
- `React 17.0.2`

## 4. 사용법
> Upload Image 버튼을 클릭해서 서비스 이용 가능

<img width="1035" alt="스크린샷 2023-05-29 오전 3 50 42" src="https://github.com/cheimbus/innervarz/assets/87293880/f593abda-2269-48ef-8a8f-2d6d7d8f68ff">
<img width="1035" alt="스크린샷 2023-05-29 오전 3 47 51" src="https://github.com/cheimbus/innervarz/assets/87293880/ac1e3228-5b5f-44e3-9166-76a63e8a3eeb">
<img width="1035" alt="스크린샷 2023-05-29 오전 3 49 39" src="https://github.com/cheimbus/innervarz/assets/87293880/d5ce7454-3ae2-438d-9c60-e91f54bf338a">

## 5. 문제점
> 현재 딥러닝 서버에서 Python코드만 응답받을 수 있으므로, nodejs에서 작성된 코드로 원하는 값을 얻을 수 없음 => -17 로 통일된 값을 리턴받는다.   
> 따라서 spawnSync를 이용해서 Python코드를 실행시켜서 요청을 보내야한다.   
> 아래 예시는 nodejs로 작성된 코드   
```js
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as msgpack5 from 'msgpack5';
import * as path from 'path';
import * as fs from 'fs';
@Injectable()
export class GuessService {
  private msgpack: msgpack5.MessagePack;

  constructor() {
    this.msgpack = msgpack5();
  }

  async guessImage(image: Express.Multer.File): Promise<any> {
    const messagePackData = this.msgpack.encode({ img: image.buffer });

    const url = 'http://52.78.66.213:7929/gender_filter';
    const headers = { 'Content-Type': 'application/msgpack' };

    const response = await axios.post(url, messagePackData, {
      headers,
    });

    const result = this.msgpack.decode(response.data);
    console.log(result); // -17
    return result['result'];
  }
}
```
> `E2BIG` 에러 발생.
> 클라이언트에서 전송받은 이미지 데이터를 이용해서 Python코드로 http요청을 보내는 과정에서 발생한 에러이다.   
> 이미지 버퍼 데이터를 직렬화하고 이를 http요청을 보내는 데 있어서 발생하였다. `E2BIG`는 몇천줄의 명령어나 인수를 사용할 때 발생하는 에러이다. 따라서 이미지 데이터를 직렬화한 값이 너무 길어서 발생하는 것 같다.   
> 놀랍게도 여러 테스트 결과 남성의 이미지만 이러한 에러가 발생한다. 여성의 이미지는 정상적으로 작동   
> 따라서 코드 수정을 하였다. 이미지 버퍼 데이터를 전송하는 방법에서 서버에 이미지를 저장하고, 그 이미지 경로를 이용해서 전송하는 방법으로 요청을 보내니 해결되었다. (이후 이미지를 바로 삭제)   


