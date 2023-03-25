import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from '../../data/schemas/product.schema';
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

  // Search And Count Products
  find(options) {
    return this.product_model.find(options);
  }
  count(options) {
    return this.product_model.count(options).exec();
  }

  // Get Product By PID
  async findOne(id: string) {
    const existingProduct = await this.product_model.findById(id).exec();
    if (!existingProduct) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return existingProduct;
  }

  // Update Product By PID
  async update(
    id: string,
    updateRequestDto: ProductDto,
  ): Promise<ProductDocument> {
    const existingProduct = await this.product_model.findByIdAndUpdate(
      id,
      updateRequestDto,
      { new: true },
    );
    if (!existingProduct) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return existingProduct;
  }

  // Remove Product By PID
  async remove(id: string, res: any): Promise<any> {
    try {
      const data = await this.findOne(id);

      if (data) {
        const result = await this.product_model.findByIdAndRemove(id);
        res.status(200).send(result);
      } else {
        res.status(404).send({
          message: 'Data You are Trying to Delete Not Existed',
          statusCode: 404,
        });
      }
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
