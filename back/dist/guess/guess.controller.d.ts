import { GuessService } from './guess.service';
export declare class GuessController {
    private guessService;
    constructor(guessService: GuessService);
    guessGender(number: number): Promise<string>;
    getImage(number: number): Promise<any>;
}
