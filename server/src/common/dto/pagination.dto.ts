import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    example: 10,
    default: 10,
    description: 'Number of items to skip',
  })
  @IsOptional()
  @IsNumber()
  @IsInt()
  @Min(0)
  offset?: number;
  @ApiProperty({
    example: 0,
    default: 10,
    description: 'Number of items to return',
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Min(1)
  limit?: number;
}
