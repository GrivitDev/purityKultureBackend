import { IsOptional, IsString, IsNumber, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsString()
  title: string;

  @IsString()
  style: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;
}
