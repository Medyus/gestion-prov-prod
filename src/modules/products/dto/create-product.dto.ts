import { IsString, IsNotEmpty, IsObject } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly type: string;

  @IsObject()
  providers: string[];
}