import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Provider extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ type: String, enum: { values: ['mayorista', 'minorista'], message: 'Tipo de proveedor inválido' } })
  type: string;

  @Prop({ required: false })
  products: string[];
}
export const ProviderSchema = SchemaFactory.createForClass(Provider);