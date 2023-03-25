import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  Req,
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
import { Request } from 'express';
import { Public } from '../../Common/auth/decorators/setmetadata.decorator';
@ApiTags('Product')
@ApiBearerAuth('access-token')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
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
  // Create New Product With Upload A File
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
  async create(@UploadedFile() file: Express.Multer.File, @Req() req) {
    // console.log(req.body.product_name);
    // console.log(req.file);
    return this.productService.create(req);
  }
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

  // Search from Products
  @Get('search')
  @Public()
  async backend(@Req() req: Request) {
    let options = {};

    if (req.query.s) {
      options = {
        $or: [
          { product_name: new RegExp(req.query.s.toString(), 'i') },
          { product_category: new RegExp(req.query.s.toString(), 'i') },
          { product_price: new RegExp(req.query.s.toString(), 'i') },
        ],
      };
    }
    const query = this.productService.find(options);

    // if (req.query.sort) {
    //   query.sort({
    //     product_price: req.query.sort,
    //   });
    // }

    const page: number = parseInt(req.query.page as any) || 1;
    const limit = 3;
    const total = await this.productService.count(options);
    const data = await query
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    return {
      data,
      total,
      page,
      last_page: Math.ceil(total / limit),
    };
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
  @Public()
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
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
  update(@Param('id') id: string, @Body() updateRequestDto: ProductDto) {
    return this.productService.update(id, updateRequestDto);
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
  remove(@Param('id') id: string, @Res() res: any) {
    return this.productService.remove(id, res);
  }
  // End Delete Products By ID
}
