import {
  Controller,
  Post,
  Body,
  Request,
  Delete,
  NotFoundException,
  Param,
  Get,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { ItemDTO } from '../../data/dtos/item.dto';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}
  @Post('/')
  async addItemToCart(@Request() req, @Body() itemDTO: ItemDTO) {
    const userId = req.user.id;
    const cart = await this.cartService.addItemToCart(userId, itemDTO);
    return cart;
  }

  @Delete('/')
  async removeItemFromCart(@Request() req, @Body() { productId }) {
    const userId = req.user.id;
    const cart = await this.cartService.removeItemFromCart(userId, productId);
    if (!cart) throw new NotFoundException('Item does not exist');
    return cart;
  }

  @Delete('/:id')
  async deleteCart(@Param('id') id: string) {
    const cart = await this.cartService.deleteCart(id);
    if (!cart) throw new NotFoundException('Cart does not exist');
    return cart;
  }
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    const userEmail = req.user.email;
    return this.cartService.findOne(id, userEmail);
  }
  @Get()
  async findAll(@Request() req) {
    //return this.cartService.findAll();
    const userId = req.user.id;
    const cart = await this.cartService.findAll(userId);
    if (!cart) throw new NotFoundException('Cart does not exist');
    return cart;
  }
}
