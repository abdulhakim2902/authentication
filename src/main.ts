import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = isNaN(parseInt(process.env.PORT)) ? 3000 : +process.env.PORT;

  const firstConfig = new DocumentBuilder()
    .setTitle('Auth API')
    .setDescription('Auth API description')
    .build();

  const authDocument = SwaggerModule.createDocument(app, firstConfig, {
    include: [AuthModule],
  });
  SwaggerModule.setup('explorer/auth', app, authDocument);

  const secondConfig = new DocumentBuilder()
    .setTitle('User API')
    .setDescription('User API description')
    .addBearerAuth()
    .build();
  const userDocument = SwaggerModule.createDocument(app, secondConfig, {
    include: [UserModule],
  });
  SwaggerModule.setup('explorer/user', app, userDocument);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  await app.listen(port, () => {
    console.log(`Server is listening on localhost:${port}`);
  });
}
bootstrap();
