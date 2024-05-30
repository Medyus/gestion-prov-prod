import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { ProductsService } from './components/products/products.service';
import { ProvidersService } from './components/providers/providers.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './components/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MongooseModule.forRoot('mongodb://localhost/db-gestion-prov-prod'),
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService, AuthService, ProductsService, ProvidersService],
})
export class AppModule {}
