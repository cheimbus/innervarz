import { Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GuessService } from './guess.service';

@Controller()
export class GuessController {
  constructor(private guessService: GuessService) {}

  @Post('guess')
  @UseInterceptors(FileInterceptor('image'))
  async guessGender(@UploadedFile() image) {
    return this.guessService.guessGender(image);
  }
}
