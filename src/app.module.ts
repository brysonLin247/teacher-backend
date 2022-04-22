import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BaseModule } from './modules/base/base.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ResearchModule } from './modules/research/research.module';
import { UploadModule } from './modules/upload/upload.module';
import { StaticModule } from './modules/static/static.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { RolesGuard } from './modules/auth/guards/roles.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [BaseModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '12345678',
      database: 'mysql',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,// 生产环境不可用
    }),
    AuthModule,
    UserModule,
    ResearchModule,
    UploadModule,
    StaticModule,
    DocumentsModule,
    ],
  controllers: [AppController],
  providers: [AppService,
  //   {
  //   // 设置全局角色守卫
  //   provide: APP_GUARD,
  //   useClass: RolesGuard,
  // }
],
})
export class AppModule {}
