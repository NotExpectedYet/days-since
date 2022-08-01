import { IsObject } from 'class-validator';

export class AddDayDto {
  @IsObject()
  day?: object;
}
