import { ForbiddenException, Injectable } from '@nestjs/common';
import { AddDayDto, CreateCounterDto, EditCounterDto } from './dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class CounterService {
  constructor(private database: DatabaseService) {}
  getCounters(userId: number) {
    return this.database.counter.findMany({
      where: {
        userId,
      },
    });
  }

  async createCounter(userId: number, dto: CreateCounterDto) {
    const counter = await this.database.counter.create({
      data: {
        userId,
        ...dto,
      },
    });
    console.log(counter);
    return counter;
  }

  getCounterById(userId: number, counterId: number) {
    return this.database.counter.findFirst({
      where: {
        id: counterId,
        userId,
      },
    });
  }

  async editCounterById(
    userId: number,
    counterId: number,
    dto: EditCounterDto,
  ) {
    const counter = await this.database.counter.findUnique({
      where: {
        id: counterId,
      },
    });

    if (!counter || counter.userId !== userId) {
      throw new ForbiddenException(
        'You do not have access to that specific resource!',
      );
    }

    return this.database.counter.update({
      where: {
        id: counterId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteCounterById(userId: number, counterId: number) {
    const counter = await this.database.counter.findUnique({
      where: {
        id: counterId,
      },
    });

    if (!counter || counter.userId !== userId) {
      throw new ForbiddenException(
        'You do not have access to that specific resource!',
      );
    }

    await this.database.counter.delete({
      where: {
        id: counterId,
      },
    });
  }

  addNewDayById(userId: number, counterId: number, dto: AddDayDto) {}
}
