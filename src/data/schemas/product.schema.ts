import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type ProductDocument = Product & mongoose.Document;
@Schema({ timestamps: true })
export class Product {
  @Prop()
  product_name: string;

  @Prop()
  product_category: string;

  @Prop()
  product_price: string;

  @Prop()
  product_path: string;

  @Prop()
  product_original_name: string;

  @Prop({ default: 'No value is available in this field' })
  product_description: string;
  @Prop()
  user_id: string;
}
export const ProductSchema = SchemaFactory.createForClass(Product);
