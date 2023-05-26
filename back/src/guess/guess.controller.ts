import { Controller, Get, Param, Post } from '@nestjs/common';
import { GuessService } from './guess.service';

@Controller()
export class GuessController {
  constructor(private guessService: GuessService) {}
  @Post('guess/:number')
  async guessGender(@Param('number') number: number) {
    return this.guessService.guessGender(number);
  }

  @Get('image/:number')
  getImage(@Param('number') number: number) {
    return this.guessService.getImage(number);
  }
}
