import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  product_name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  product_category: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  product_price: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  product_path: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  product_original_name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsOptional()
  product_description: string;
}
