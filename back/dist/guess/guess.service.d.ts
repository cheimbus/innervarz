/// <reference types="multer" />
export declare class GuessService {
    private msgpack;
    constructor();
    guessGender(image: Express.Multer.File): Promise<string>;
    saveImageToFile(image: Express.Multer.File, imagePath: string): void;
    cleanupImage(imagePath: string): void;
    getGenderRatio(data: number): string;
    httpRequestToDeepLearningServerForPython(imagePath: string): any;
}
