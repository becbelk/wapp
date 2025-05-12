import { IsString, IsOptional, IsNotEmpty, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class UpdateEntry {
  @IsString()
  @IsNotEmpty()
  date!: string;

  @IsString()
  @IsNotEmpty()
  userId!: string;
}

export class CreateConsumptionDto {
  @IsString()
  @IsNotEmpty()
  watermeter!: string;

  @IsString()
  @IsNotEmpty()
  periode!: string;

  @IsNumber()
  @Type(() => Number)
  oldConsumption!: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  newConsumption?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateEntry)
  updates?: UpdateEntry[];

  @IsOptional()
  @IsString()
  dataHash?: string;
}

export class ConsumptionDto {
  @IsOptional()
  @IsString()
  periode?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  oldConsumption?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  newConsumption?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateEntry)
  updates?: UpdateEntry[];

  @IsOptional()
  @IsString()
  dataHash?: string;
}
