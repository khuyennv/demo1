import { ConfigService } from "@nestjs/config";
import {
  NestFactory,
  Reflector,
} from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import {
  DocumentBuilder,
  SwaggerModule,
} from "@nestjs/swagger";

import { AppModule } from "./app.module";
import { MessageComponent } from "./components/message.component";
import { LoggerModule } from "./logger/logger.module";
import { RolesGuard } from "./validators/roles.guard";
import {
  ValidationPipe422,
} from "./validators/validation-pipe-tranform.validate";

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter()
    );

    MessageComponent.init();
    const configService = app.get(ConfigService);
    const port = String(configService.get("PORT") ?? 3000)


    // const meg = new MessageComponent()

    // console.log("Debug", meg.lang("ID_NOT_EXIST", "en"));

    // app.setGlobalPrefix('/main/v1.0');
    app.enableCors();

    const config = new DocumentBuilder()
        .setTitle("FJob API")
        .setDescription("Tìm việc làm thêm nhanh nhất")
        .setVersion("1.0")
        .addBearerAuth()
        .addServer(`http://localhost:${port}`)
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("docs", app, document);

    app.useGlobalPipes(new ValidationPipe422({ whitelist: true }))
    app.useGlobalGuards(new RolesGuard(new Reflector()))


    app.useLogger(LoggerModule.LogLevel(configService.get("logLevel")))

    await app.listen(port, "0.0.0.0");

    console.log(`Application is running on: ${await app.getUrl()}`);
}

void bootstrap();
