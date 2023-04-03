import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Cart } from './cart.schema';
import mongoose from 'mongoose';

export type OrderDocument = Order & mongoose.Document;

@Schema()
export class Order {
  @Prop()
  orderId: string;
  @Prop()
  userId: string;
  @Prop()
  items: Cart[];
  @Prop()
  totalAmount: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
