import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Product extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ type: String, enum: { values: ['electronico', 'ropa', 'alimentos', 'herramientas', 'juguetes'], message: 'Tipo de producto inválido' } })
  type: string;

  @Prop({ required: false })
  providers: string[];
}
export const ProductSchema = SchemaFactory.createForClass(Product);
