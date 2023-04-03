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
  //Create cart items
  @Post('/')
  async addItemToCart(@Request() req, @Body() itemDTO: ItemDTO) {
    const userId = req.user.id;
    const cart = await this.cartService.addItemToCart(userId, itemDTO);
    return cart;
  }
  //one by one cart item delete
  // @Delete('/:productId')
  // async removeItemFromCart(@Request() req, @Body() { productId }) {
  //   const userId = req.user.id;
  //   const cart = await this.cartService.removeItemFromCart(userId, productId);
  //   if (!cart) throw new NotFoundException('Item does not exist');
  //   return cart;
  // }
  //specific item delete by id
  @Delete(':productId')
  async removeCartItem(@Request() req, @Param('productId') productId: string) {
    const userId = req.user.id;
    const cart = await this.cartService.removeCartItem(userId, productId);
    if (!cart)
      throw new NotFoundException('Item you find does not exist in your cart');
    return cart;
  }
  //Complete cart delete
  // @Delete('/:id')
  // async deleteCart(@Param('id') id: string) {
  //   const cart = await this.cartService.deleteCart(id);
  //   if (!cart) throw new NotFoundException('Cart does not exist');
  //   return cart;
  // }
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    return this.cartService.findOne(id, userId);
  }
  //All Cart item related to user search
  @Get()
  async findAll(@Request() req) {
    //return this.cartService.findAll();
    const userId = req.user.id;
    const cart = await this.cartService.findAll(userId);
    if (!cart) throw new NotFoundException('Cart does not exist');
    return cart;
  }
}
