import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { OrderDocument } from '../../data/schemas/order.schema';
//import { Cart } from "../../data/schemas/cart.schema";

@Injectable()
export class OrderService {
  constructor(
    @InjectModel('Order') private order_model: Model<OrderDocument>,
  ) {}

  async findAll(userId: string): Promise<OrderDocument> {
    const orderByUser = await this.getorder(userId);
    if (!orderByUser) {
      throw new NotFoundException(`Cart User #${userId} not found`);
    }
    return orderByUser;
  }

  async findOne(id: string): Promise<any> {
    const existingOrder = await this.order_model.findById(id).exec();
    if (!existingOrder) {
      throw new NotFoundException(`Order #${id} not found`);
    }
    return existingOrder;
  }
  async getorder(userId: string): Promise<OrderDocument> {
    const order = await this.order_model.findOne({ userId });
    return order;
  }
  // Remove Order By OID
  async remove(id: string, req: any): Promise<any> {
    const user_id = req.user.id;
    const existingProduct = await this.order_model.findOneAndDelete({
      _id: id,
      userId: user_id,
    });
    if (!existingProduct) {
      throw new NotFoundException(`Order #${id} not found`);
    }
    return existingProduct;
  }
}
