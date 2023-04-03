import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Req,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderService } from './order.service';
import { OrderDocument } from '../../data/schemas/order.schema';
@ApiTags('Order')
@ApiBearerAuth('access-token')
@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    @InjectModel('Order') private order_model: Model<OrderDocument>,
  ) {}
  // Find All Orders
  @Get()
  async findAll(@Request() req) {
    //return this.cartService.findAll();
    const userId = req.user.id;
    const order = await this.orderService.findAll(userId);
    if (!order) throw new NotFoundException('Order does not exist');
    return order;
  }
  // End Find All Orders

  // Show All Orders By ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }
  // End Show Orders By ID

  // Delete Orders By ID
  @Delete('/:id')
  remove(@Param('id') id: string, @Req() req) {
    return this.orderService.remove(id, req);
  }
}
