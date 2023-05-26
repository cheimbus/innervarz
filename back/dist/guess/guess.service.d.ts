export declare class GuessService {
    private msgpack;
    constructor();
    guessGender(number: number): Promise<string>;
    getGenderRatio(data: number): Promise<string>;
    httpRequestToDeepLearningServerForPython(number: number): Promise<string>;
    getImage(number: number): Promise<any>;
}
