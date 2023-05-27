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
    app.use('/image', express.static(path.join(currentPath, `../src/images`)));
    const corsOptions = {
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    };
    app.enableCors(corsOptions);
    const port = 7929;
    await app.listen(port);
    console.log(`listening on port: ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map