import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BaseModule } from './modules/base/base.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';

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
    UserModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
