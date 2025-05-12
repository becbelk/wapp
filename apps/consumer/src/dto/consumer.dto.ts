import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class ConsumerDto {
  @IsString()
  no!: string;

  @IsString()
  name!: string;

  @IsString()
  address!: string;

  @IsString()
  watermeter!: string;

  @IsOptional()
  @IsBoolean()
  deleted?: boolean;
  
}
