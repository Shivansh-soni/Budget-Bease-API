import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/features/auth/auth.module';
import { PrismaService } from 'src/prisma.service';
import { FinanceModule } from '../features/Finance/finance.module';
import { UsersModule } from '../features/users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SplittingModule } from '../features/splitting/splitting.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FinanceModule,
    UsersModule,
    AuthModule,
    SplittingModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
