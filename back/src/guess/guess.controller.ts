import { Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GuessService } from './guess.service';

@Controller()
export class GuessController {
  constructor(private guessService: GuessService) {}

  /**
   * @function guessGender controller함수 입니다. 기본적으로 http 요청을 처리하고, 비즈니스로직인 service함수를 적절하게 불러들어서 처리합니다.
   * 또한 javascript는 기본적으로 비동기로 처리하기 때문에 이 함수는 다수의 사용자의 요청을 순서대로 문제없이 응답하기 위해서 동기적으로 처리합니다. 따라서 async/await를 이용해서 비동기 처리를 합니다.
   * 클라이언트에서 이미지 데이터를 multer module을 이용해서 받아옵니다. 그 이미지 데이터를 이용해서 비즈니스 로직인 guessGender service 함수에 인자를 전달합니다.
   * @param image 이미지 데이터가 담긴 파라미터입니다.
   * @returns guessGender service함수의 리턴값입니다. ex) 99% female
   */
  @Post('guess')
  @UseInterceptors(FileInterceptor('image'))
  async guessGender(@UploadedFile() image) {
    return await this.guessService.guessGender(image);
  }
}
