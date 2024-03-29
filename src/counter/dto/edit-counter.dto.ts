import { IsOptional, IsString } from 'class-validator';

export class EditCounterDto {
  @IsString()
  @IsOptional()
  name?: string;
  @IsString()
  @IsOptional()
  description?: string;
}
