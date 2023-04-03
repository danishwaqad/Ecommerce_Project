import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ItemDTO } from '../../data/dtos/item.dto';
import { Cart, CartDocument } from '../../data/schemas/cart.schema';
import { v4 as uuid } from 'uuid';
import * as nodemailer from 'nodemailer';
import { OrderDocument } from '../../data/schemas/order.schema';

@Injectable()
export class CartService {
  private transporter: nodemailer.Transporter;
  constructor(
    @InjectModel('Cart') private readonly cartModel: Model<CartDocument>,
    @InjectModel('Order') private readonly orderModel: Model<OrderDocument>,
  ) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // use SSL
      auth: {
        user: 'danishwaqad2@gmail.com',
        pass: 'fdcfhizvcsexiiow',
      },
    });
  }

  async createCart(
    id: string,
    itemDTO: ItemDTO,
    subTotalPrice: number,
    totalPrice: number,
  ): Promise<Cart> {
    const newCart = await this.cartModel.create({
      id,
      items: [{ ...itemDTO, subTotalPrice }],
      totalPrice,
    });
    return newCart;
  }

  async getCart(id: string): Promise<CartDocument> {
    const cart = await this.cartModel.findOne({ id });
    return cart;
  }

  // async deleteCart(id: string): Promise<Cart> {
  //   const deletedCart = await this.cartModel.findOneAndRemove({ id });
  //   return deletedCart;
  // }

  private recalculateCart(cart: CartDocument) {
    cart.totalPrice = 0;
    cart.items.forEach((item) => {
      cart.totalPrice += item.quantity * item.price;
    });
  }

  async addItemToCart(id: string, itemDTO: ItemDTO): Promise<Cart> {
    const { productId, quantity, price } = itemDTO;
    const subTotalPrice = quantity * price;

    const cart = await this.getCart(id);

    if (cart) {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId == productId,
      );

      if (itemIndex > -1) {
        const item = cart.items[itemIndex];
        item.quantity = Number(item.quantity) + Number(quantity);
        item.subTotalPrice = item.quantity * item.price;

        cart.items[itemIndex] = item;
        this.recalculateCart(cart);
        return cart.save();
      } else {
        cart.items.push({ ...itemDTO, subTotalPrice });
        this.recalculateCart(cart);
        return cart.save();
      }
    } else {
      const newCart = await this.createCart(id, itemDTO, subTotalPrice, price);
      return newCart;
    }
  }
  // Get All Cart

  async findAll(id: string): Promise<CartDocument> {
    const cartByUser = await this.getCart(id);
    if (!cartByUser) {
      throw new NotFoundException(`Cart User #${id} not found`);
    }
    return cartByUser;
  }
  // Get Cart By ID
  async findOne(id: string, userId: string): Promise<any> {
    const UserId = userId;
    const existingCart = await this.cartModel.findById(id).exec();
    if (!existingCart) {
      throw new NotFoundException(`Cart #${id} not found`);
    }
    const orderId = uuid();

    //Send a confirmation email to the user
    // const to = UserId;
    // const subject = 'Order Confirmation';
    // const body = `Thank you for placing your order with us. Your order ID is ${orderId}.`;
    // await this.sendMail(to, subject, body);

    return await this.createOrder(orderId, UserId, existingCart);
  }
  async createOrder(orderId: string, UserId, cartData: any): Promise<any> {
    const order = await this.orderModel.create({
      orderId: orderId,
      userId: UserId,
      items: cartData.items,
      totalAmount: cartData.totalPrice,
    });
    const savedOrder = await order.save();
    return savedOrder;
  }

  // async removeItemFromCart(id: string, productId: string): Promise<any> {
  //   const cart = await this.getCart(id);
  //   const itemIndex = cart.items.findIndex(
  //     (item) => item.productId == productId,
  //   );
  //
  //   if (itemIndex > -1) {
  //     cart.items.splice(itemIndex, 1);
  //     return cart.save();
  //   }
  // }
  async removeCartItem(id: string, productId: string): Promise<any> {
    const cart = await this.getCart(id);
    const removedItems = cart.items.filter(
      (item) => item.productId !== productId,
    );
    if (removedItems.length === cart.items.length) {
      throw new NotFoundException(
        `Product #${productId} not found in cart #${id}`,
      );
    }
    cart.items = removedItems;
    this.recalculateCart(cart);
    return cart.save();
  }
  async sendMail(to: string, subject: string, text: string) {
    await this.transporter.sendMail({
      from: 'danishwaqad2@gmail.com',
      to,
      subject,
      text,
    });
  }
}
