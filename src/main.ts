import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { Modules } from './modules';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = isNaN(parseInt(process.env.PORT)) ? 3000 : +process.env.PORT;

  const config = new DocumentBuilder()
    .setTitle('Web3 Authentication API')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    include: [Modules],
  });

  SwaggerModule.setup('explorer', app, document);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  await app.listen(port, () => {
    console.log(`Server is listening on localhost:${port}`);
  });
}
bootstrap();
