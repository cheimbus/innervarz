"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const express = require("express");
const path = require("path");
const http_exception_filter_1 = require("./common/http-exception.filter");
const success_interceptor_1 = require("./common/success.interceptor");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.useGlobalInterceptors(new success_interceptor_1.successInterceptor());
    const currentPath = path.dirname(require.main.filename);
    app.use('/images', express.static(path.join(currentPath, `../src/images`)));
    const port = 8080;
    await app.listen(port);
    console.log(`listening on port: ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map