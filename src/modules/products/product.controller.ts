import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  Req,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ProductService } from './product.service';
import { ProductDto } from '../../data/dtos/product.dto';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Public } from '../../Common/auth/decorators/setmetadata.decorator';
import * as fs from 'fs';
//import sharp from 'sharp';
import * as sharp from 'sharp';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductDocument } from '../../data/schemas/product.schema';
@ApiTags('Product')
@ApiBearerAuth('access-token')
@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    @InjectModel('Product') private product_model: Model<ProductDocument>,
  ) {}
  // Create New Product
  @ApiOkResponse({
    type: ProductDto,
    description: 'Product Created Successfully',
  })
  @ApiBadRequestResponse({ description: 'Something went Wrong' })
  @ApiUnauthorizedResponse({ description: 'UnAuthorized' })
  @ApiNotFoundResponse({ description: 'What You Are Looking For Not Found' })
  @ApiConflictResponse({ description: 'Data Already Exists' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiOperation({ description: 'Creating Product Data' })
  @ApiBody({ type: ProductDto })
  @UsePipes(ValidationPipe)
  //Create New Product With Upload A File
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req) {
    const fileName = file.filename;
    const compressedFileName = `${fileName}-compressed.jpg`;
    const readStream = fs.createReadStream(file.path);
    const writeStream = fs.createWriteStream(`./uploads/${compressedFileName}`);

    const pipeline = sharp()
      .resize(800)
      .jpeg({ quality: 60, chromaSubsampling: '4:4:4' });

    readStream.pipe(pipeline).pipe(writeStream);

    // Wait for the compressed file to finish writing
    await new Promise<void>((resolve, reject) => {
      writeStream.on('finish', () => {
        fs.unlinkSync(file.path); // Remove the original file
        resolve();
      });
      writeStream.on('error', reject);
    });

    return this.productService.create(req);
  }
  // async create(@UploadedFile() file: Express.Multer.File, @Req() req) {
  //   // console.log(req.body.product_name);
  //   // console.log(req.file);
  //   return this.productService.create(req);
  // }
  // End Create Product

  // Find All Products
  @ApiOkResponse({
    type: ProductDto,
    description: 'Product Found Successfully',
  })
  @ApiBadRequestResponse({ description: 'Something went Wrong' })
  @ApiUnauthorizedResponse({ description: 'UnAuthorized' })
  @ApiNotFoundResponse({ description: 'What You Are Looking For Not Found' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiOperation({ description: 'Get Product All Data' })
  @Get()
  @Public()
  findAll() {
    return this.productService.findAll();
  }
  // End Find All Products
  // Search All Products
  @Get('search')
  @Public()
  async findDocuments(@Query() query: any) {
    const documents = await this.productService.find(query);
    return documents;
  }
  // End Search Products

  // Show All Products By ID
  @ApiOkResponse({
    type: ProductDto,
    description: 'Product Found Successfully',
  })
  @ApiBadRequestResponse({ description: 'Something went Wrong' })
  @ApiUnauthorizedResponse({ description: 'UnAuthorized' })
  @ApiNotFoundResponse({ description: 'What You Are Looking For Not Found' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiOperation({ description: 'Get Product By Pid' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const myData = await this.productService.findOne(id);
    return myData;
  }
  // End Show Products By ID

  // Update Products By ID
  @ApiOkResponse({
    type: ProductDto,
    description: 'Product Updated Successfully By PID',
  })
  @ApiBadRequestResponse({ description: 'Something went Wrong' })
  @ApiUnauthorizedResponse({ description: 'UnAuthorized' })
  @ApiNotFoundResponse({ description: 'What You Are Looking For Not Found' })
  @ApiConflictResponse({ description: 'Data Already Exists' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiOperation({ description: 'Update Product By Pid' })
  @ApiBody({ type: ProductDto })
  @Put(':id')
  update(
    @Param('id') id: string,
    @Req() req,
    @Body() updateRequestDto: ProductDto,
  ) {
    const user_id = req.user.id;
    return this.productService.update(id, user_id, updateRequestDto);
  }
  // End Update Products By ID

  // Delete Products By ID
  @ApiOkResponse({
    type: ProductDto,
    description: 'Data Deleted Successfully By PID',
  })
  @ApiBadRequestResponse({ description: 'Something went Wrong' })
  @ApiUnauthorizedResponse({ description: 'UnAuthorized' })
  @ApiNotFoundResponse({ description: 'What You Are Looking For Not Found' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiOperation({ description: 'Delete Specific Data By PiD' })
  @Delete('/:id')
  // remove(@Param('id') id: string, @Body('user_id') user_id: string) {
  //   return this.productService.remove(id, user_id);
  // }
  remove(@Param('id') id: string, @Req() req) {
    return this.productService.remove(id, req);
  }
  // End Delete Products By ID
}
