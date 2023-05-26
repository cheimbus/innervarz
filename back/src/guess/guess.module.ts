import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { GuessService } from './guess.service';

@Module({
  imports: [HttpModule],
  providers: [GuessService],
})
export class GuessModule {}
