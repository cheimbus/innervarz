import { GuessService } from './guess.service';
export declare class GuessController {
    private guessService;
    constructor(guessService: GuessService);
    guessGender(image: any): Promise<string>;
}
