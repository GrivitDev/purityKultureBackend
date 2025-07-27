import { IsOptional, IsString } from 'class-validator';

export class UpdateBtsDto {
  @IsOptional()
  @IsString()
  caption?: string;
}
