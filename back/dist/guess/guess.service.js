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
const child_process_1 = require("child_process");
const path = require("path");
let GuessService = class GuessService {
    constructor() {
        this.msgpack = msgpack5();
    }
    async guessGender(number) {
        if (+number < 1 || +number > 5) {
            throw new common_1.BadRequestException('잘못된 요청입니다.');
        }
        const deepLearningServerReturnValue = await this.httpRequestToDeepLearningServerForPython(number);
        return await this.getGenderRatio(+deepLearningServerReturnValue);
    }
    async getGenderRatio(data) {
        if (data >= 0.501) {
            const ratio = Math.trunc(data * 100);
            return `${ratio}% male`;
        }
        else {
            const ratio = Math.trunc((1 - data) * 100);
            return `${ratio}% female`;
        }
    }
    async httpRequestToDeepLearningServerForPython(number) {
        try {
            const imageName = `face${number}.png`;
            const currentPath = path.dirname(require.main.filename);
            const absoluteImagePath = path.join(currentPath, `../src/images/${imageName}`);
            const pythonPath = 'python3';
            const pythonCode = `
import msgpack
import requests
join = '${absoluteImagePath}'
img = open("${absoluteImagePath}", 'rb').read()
payload = msgpack.packb({
    "img": img
})
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
    async getImage(number) {
        try {
            if (+number < 1 || +number > 5) {
                throw new common_1.BadRequestException('잘못된 요청입니다.');
            }
            const imageName = `face${number}.png`;
            return `http://localhost:8080/images/${imageName}`;
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