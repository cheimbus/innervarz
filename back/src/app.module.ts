import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { GuessController } from './guess/guess.controller';
import { GuessModule } from './guess/guess.module';
import { GuessService } from './guess/guess.service';

@Module({
  imports: [GuessModule, HttpModule],
  controllers: [GuessController],
  providers: [GuessService],
})
export class AppModule {}
