import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateSavingDto } from '../dto/create-saving.dto';
import { UpdateSavingDto } from '../dto/update-saving.dto';
import { PrismaService } from '../../../../prisma.service';

@Injectable()
export class SavingsService {
  private readonly logger = new Logger(SavingsService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async create(createSavingDto: CreateSavingDto, user_id: number) {
    try {
      const { total_savings, ...rest } = createSavingDto;

      const saving = await this.prismaService.savings.create({
        data: {
          ...rest,
          total_savings,
          amount_remaining: total_savings, // Initialize with total_savings
          user_id,
        },
      });

      return saving;
    } catch (error) {
      this.logger.error(
        `Failed to create saving: ${error.message}`,
        error.stack,
      );

      if (error.code === 'P2002') {
        throw new BadRequestException('A saving with this name already exists');
      }

      throw new BadRequestException('Failed to create saving');
    }
  }

  async findAll(user_id: number) {
    try {
      const res = await this.prismaService.savings.findMany({
        where: { user_id },
      });
      return res;
    } catch (error) {
      console.log('error', error);
      throw new NotFoundException('No savings found');
    }
  }

  async findOne(id: number) {
    if (!id) {
      throw new BadRequestException('kindly provide a savings ID');
    }
    try {
      const res = await this.prismaService.savings.findUnique({
        where: { savings_id: id },
      });

      if (!res) {
        throw new NotFoundException('No savings found');
      }
    } catch (error) {
      console.log('error', error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  async addSavingTransaction(
    id: number,
    amount: number,
    type: 'income' | 'expense',
    user_id: number,
  ) {
    if ((!id && !user_id) || (!amount && !type)) {
      throw new BadRequestException('kindly provide proper fields');
    }

    try {
      const oldSavings = await this.prismaService.savings.findUnique({
        where: { savings_id: id },
      });

      if (!oldSavings) {
        throw new NotFoundException('No savings found');
      }

      const res = await this.prismaService.savings.update({
        where: {
          user_id,
          savings_id: id,
        },
        data: {
          amount_saved:
            type === 'expense'
              ? oldSavings.amount_saved - amount
              : oldSavings.amount_saved + +amount,

          amount_remaining:
            type === 'expense'
              ? oldSavings.amount_remaining + +amount
              : oldSavings.amount_remaining - amount,
        },
      });
      if (!res) {
        throw new NotFoundException('No savings found');
      }
      return res;
    } catch (error) {
      console.log('error', error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: number, user_id: number) {
    if (!id && !user_id) {
      throw new BadRequestException('kindly provide proper fields');
    }
    try {
      const res = await this.prismaService.savings.delete({
        where: {
          user_id,
          savings_id: id,
        },
      });
      if (!res) {
        throw new NotFoundException('No savings found');
      }
      return res;
    } catch (error) {
      console.log('error', error);
      throw new InternalServerErrorException(error.message);
    }
  }
}
