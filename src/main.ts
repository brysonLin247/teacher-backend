import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './core/filters/http-execption.filter';
import { TransformInterceptor } from './core/interceptor/transform.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import * as csurf from 'csurf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 设置全局路由前缀
  app.setGlobalPrefix('api');
  // 注册全局管道
  app.useGlobalPipes(new ValidationPipe());
  // 注册全局拦截器
  app.useGlobalInterceptors(new TransformInterceptor())
  // 注册全局错误的过滤器
  app.useGlobalFilters(new HttpExceptionFilter());
 // CSRF保护
  // app.use(csurf());
  
  const config = new DocumentBuilder()
    .setTitle('师资管理系统')
    .setDescription('师资管理系统的描述～')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}
bootstrap();
