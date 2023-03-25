import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModule } from './Admin/products/product.module';
import { JwtAuthGuard } from './Common/auth/guards/jwt-auth.guard';
import { AuthModule } from './Common/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CartModule } from './User/shopping_cart/cart.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot('mongodb://localhost:27017', {
      dbName: 'e-commerce_db',
      family: 4,
    }),
    ProductModule,
    AuthModule,
    CartModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_GUARD',
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
