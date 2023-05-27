"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuessService = void 0;
const common_1 = require("@nestjs/common");
const msgpack5 = require("msgpack5");
const fs = require("fs");
const path = require("path");
const child_process_1 = require("child_process");
let GuessService = class GuessService {
    constructor() {
        this.msgpack = msgpack5();
    }
    async guessGender(image) {
        if (!image) {
            throw new common_1.BadRequestException('이미지를 전달받지 못했습니다.');
        }
        const uploadPath = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        const imagePath = path.join(uploadPath, image.originalname);
        this.saveImageToFile(image, imagePath);
        const deepLearningServerReturnValue = this.httpRequestToDeepLearningServerForPython(imagePath);
        this.cleanupImage(imagePath);
        return this.getGenderRatio(+deepLearningServerReturnValue);
    }
    saveImageToFile(image, imagePath) {
        fs.writeFileSync(imagePath, image.buffer);
    }
    cleanupImage(imagePath) {
        fs.unlinkSync(imagePath);
    }
    getGenderRatio(data) {
        if (data >= 0.501) {
            const ratio = Math.trunc(data * 100);
            return `${ratio}% male`;
        }
        else {
            const ratio = Math.trunc((1 - data) * 100);
            return `${ratio}% female`;
        }
    }
    httpRequestToDeepLearningServerForPython(imagePath) {
        try {
            const pythonPath = 'python3';
            const pythonCode = `
import msgpack
import requests
import base64

with open('${imagePath}', 'rb') as f:
    img_bytes = f.read()
    payload = msgpack.packb({"img": img_bytes})
    response = requests.post("http://52.78.66.213:7929/gender_filter", payload)
    result = msgpack.unpackb(response.content)
    print(result['result'])
`;
            const result = (0, child_process_1.spawnSync)(pythonPath, ['-c', pythonCode], {
                encoding: 'utf-8',
            });
            return result.stdout;
        }
        catch (err) {
            return err;
        }
    }
};
GuessService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], GuessService);
exports.GuessService = GuessService;
//# sourceMappingURL=guess.service.js.map