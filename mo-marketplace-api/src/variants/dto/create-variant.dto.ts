import {
  IsString,
  IsOptional,
  IsNumber,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

export class CreateVariantDto {
  @ApiPropertyOptional({ example: 'red' })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiPropertyOptional({ example: 'M' })
  @IsOptional()
  @IsString()
  size?: string;

  @ApiPropertyOptional({ example: 'cotton' })
  @IsOptional()
  @IsString()
  material?: string;

  @ApiProperty({ example: 29.99 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  price: number;

  @ApiProperty({ example: 100 })
  @IsInt()
  @Min(0)
  @Max(99999)
  @Type(() => Number)
  stock: number;
}
