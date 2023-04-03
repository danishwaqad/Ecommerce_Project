import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ProductDocument } from '../../data/schemas/product.schema';
import { ProductDto } from '../../data/dtos/product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product') private product_model: Model<ProductDocument>,
  ) {}

  async create(req: any): Promise<any> {
    const data: ProductDto = {
      product_category: req.body.product_category || '',
      product_description: req.body.product_description || '',
      product_name: req.body.product_name || '',
      user_id: req.user.id || '',
      product_original_name: req.file.originalname || '',
      product_path: req.file.path || '',
      product_price: req.body.product_price || '',
    };
    return await this.product_model.create(data);
  }

  // Get All Products
  async findAll(): Promise<ProductDocument[]> {
    const productData = await this.product_model.find();
    if (!productData || productData.length == 0) {
      throw new NotFoundException('Product Data Not Found!');
    } else {
      return productData;
    }
  }

  // Get Product By PID
  async findOne(id: string) {
    const existingProduct = await this.product_model.findById(id).exec();
    if (!existingProduct) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return existingProduct;
  }

  // Get Product By PID for Delete
  // async findDelOne(id: string, user_id: string): Promise<ProductDocument> {
  //   const myData = await this.product_model
  //     .findOne({ _id: id, user_id: user_id })
  //     .exec();
  //   return myData;
  // }

  async find(query: any): Promise<ProductDocument[]> {
    const existingProduct = await this.product_model.find(query).exec();
    if (!existingProduct) {
      throw new NotFoundException(`Product not found`);
    }
    return existingProduct;
  }

  // Update Product By PID
  async update(
    id: string,
    user_id: string,
    updateRequestDto: ProductDto,
  ): Promise<ProductDocument> {
    const filter = { _id: id, user_id: user_id }; // Filter criteria
    const update = { ...updateRequestDto }; // New data to be updated
    const options = { new: true }; // Return the updated document
    const existingProduct = await this.product_model.findOneAndUpdate(
      filter,
      update,
      options,
    );
    if (!existingProduct) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return existingProduct;
  }

  // Remove Product By PID
  async remove(id: string, req: any): Promise<any> {
    const user_id = req.user.id;
    const existingProduct = await this.product_model.findOneAndDelete({
      _id: id,
      user_id: user_id,
    });
    if (!existingProduct) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return existingProduct;
  }
}
