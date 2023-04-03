import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Cart } from '../schemas/cart.schema';

export class OrderDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  orderId: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  items: Cart[];
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  totalAmount: Cart[];
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: Cart[];
}
