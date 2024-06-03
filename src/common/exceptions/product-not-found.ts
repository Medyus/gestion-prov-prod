import { HttpException, HttpStatus } from "@nestjs/common";

export class ProductNotFoundException extends HttpException {

  constructor() {
    super('Producto no encontrado', HttpStatus.BAD_REQUEST)
  }
}