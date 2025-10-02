import { Module } from '@nestjs/common';
import { GroupsModule } from './groups/groups.module';
// import { ExpenseModule } from './groups/expense/expense.module';

@Module({
  imports: [GroupsModule],
  exports: [GroupsModule],
})
export class SplittingModule {}
