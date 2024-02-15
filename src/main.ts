import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const config = new DocumentBuilder()
    .setTitle('Customer_Freelancer')
    .setDescription(`Այստեղ user-ի համար ունենք 3 role -> ADMIN(0), CUSTOMER(1), FREELANCER(2)
    \n\n ինչպես նաև job-ի համար ունենք 3 status -> START(0), PROCESS(1), FINISHED(2)
    `)
    .setVersion('')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', 
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(8080);
}
bootstrap();
