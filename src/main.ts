import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './core/filters/http-execption.filter';
import { TransformInterceptor } from './core/interceptor/transform.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { json, urlencoded } from 'express';
// import * as csurf from 'csurf';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'upload_dist'));
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
  app.enableCors({credentials:true,origin:'http://localhost:8000'});
  
  
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  
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
