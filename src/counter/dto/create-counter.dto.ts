import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCounterDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsOptional()
  description?: string;
}
