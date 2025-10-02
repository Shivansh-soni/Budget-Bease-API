import { Module } from '@nestjs/common';
import { SavingsModule } from './savings/savings.module';
import { TransactionsModule } from './transactions/transactions.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [CategoriesModule, SavingsModule, TransactionsModule],
  exports: [CategoriesModule, SavingsModule, TransactionsModule],
})
export class FinanceModule {}
