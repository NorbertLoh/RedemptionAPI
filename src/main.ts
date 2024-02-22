import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Redemption')
    .setDescription('The redemption API')
    .setVersion('1.0')
    .addTag('Redemption')
    .build();
  
  // Enable Swagger.
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Enable ValidationPipe.
  app.useGlobalPipes(new ValidationPipe({
    skipMissingProperties: false
  }));

  app.enableCors();
  await app.listen(3000);

  // Enable hotreload.
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
