import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Product extends Document {

  @Prop({required: true, unique: true})
  name: string;

  @Prop({required: true})
  type: string;

  @Prop({required: false })
  providers: string[];
}
export const ProductSchema = SchemaFactory.createForClass(Product);