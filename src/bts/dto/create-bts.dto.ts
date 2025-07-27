import { IsOptional, IsString } from 'class-validator';

export class CreateBtsDto {
  @IsOptional()
  @IsString()
  caption?: string;
}
