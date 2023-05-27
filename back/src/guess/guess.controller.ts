import { Controller, Get, Param, Post } from '@nestjs/common';
import { GuessService } from './guess.service';

@Controller()
export class GuessController {
  constructor(private guessService: GuessService) {}
  /**
   * 
   * @param number 클라이언트에서 image에 대한 count값을 prams로 받습니다. prams에 대한 값은 변수 number로 받고 비즈니스 로직인 guessService로 넘깁니다.
   * @function guessGender count의 값을 받은 변수 number를 이용해서 비즈니스 로직인 guessService의 guessGender함수를 실행시키는 컨트롤러 함수입니다.
   * @return 딥러닝 서버의 http요청으로 인한 응답 값으로, 이미지에 대한 gender ratio를 리턴합니다. (ex: 99% female)
   * 
   * @function getImage count의 값을 받은 변수 number를 이용해서 비느지스 로직인 guessService의 getImage함수를 실행시키는 컨트롤러 함수입니다.
   * @return nestjs 서버에서 해당 count값에 해당하는 image url을 리턴합니다. 즉, 정적 이미지에 대한 경로를 리턴합니다. (ex: http://13.125.211.113:7929/images/1)
   */
  @Post('guess/:number')
  async guessGender(@Param('number') number: number) {
    return this.guessService.guessGender(number);
  }

  @Get('image/:number')
  async getImage(@Param('number') number: number) {
    return this.guessService.getImage(number);
  }
}
