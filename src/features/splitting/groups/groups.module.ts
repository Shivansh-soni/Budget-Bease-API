import { Module } from '@nestjs/common';
import { GroupsService } from './service/groups.service';
import { GroupsController } from './controller/groups.controller';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '../../../modules/gaurds/AuthGaurd';
import { PrismaService } from '../../../prisma.service';
import { ExpenseController } from './expense/controller/expense.controller';
import { ExpenseModule } from './expense/expense.module';
import { ExpenseService } from './expense/service/expense.service';

@Module({
  imports: [ExpenseModule],
  controllers: [GroupsController, ExpenseController],
  providers: [
    GroupsService,
    JwtService,
    AuthGuard,
    ExpenseService,
    PrismaService,
  ],
  exports: [ExpenseModule],
})
export class GroupsModule {}
