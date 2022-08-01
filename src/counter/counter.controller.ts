import {
  Controller,
  Patch,
  UseGuards,
  Post,
  Get,
  Delete,
  ParseIntPipe,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { CounterService } from './counter.service';
import { GetUser } from '../auth/decorator';
import { AddDayDto, CreateCounterDto, EditCounterDto } from './dto';

@UseGuards(JwtGuard)
@Controller('counters')
export class CounterController {
  constructor(private counterService: CounterService) {}

  @Get()
  getCounters(@GetUser('id') userId: number) {
    return this.counterService.getCounters(userId);
  }

  @Post()
  createCounter(@GetUser('id') userId: number, @Body() dto: CreateCounterDto) {
    return this.counterService.createCounter(userId, dto);
  }

  @Get(':id')
  getCounterById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) counterId: number,
  ) {
    return this.counterService.getCounterById(userId, counterId);
  }

  @Patch(':id')
  editCounterById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) counterId: number,
    @Body() dto: EditCounterDto,
  ) {
    return this.counterService.editCounterById(userId, counterId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteCounterById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) counterId: number,
  ) {
    return this.counterService.deleteCounterById(userId, counterId);
  }

  @Patch(':id')
  addNewDayById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) counterId: number,
    @Body() dto: AddDayDto,
  ) {
    return this.counterService.addNewDayById(userId, counterId, dto);
  }
}
