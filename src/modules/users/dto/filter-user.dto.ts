import { IsNumber, IsOptional } from 'class-validator';

export class FilterUserDto {
  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  name?: string;

  @IsOptional()
  sortAsc?: string;

  @IsOptional()
  sortDesc?: string;
}
