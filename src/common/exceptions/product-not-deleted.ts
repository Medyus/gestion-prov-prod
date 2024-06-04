import { HttpException, HttpStatus } from "@nestjs/common";

export class ProductNotDeletedException extends HttpException {

  constructor() {
    super('Producto no borrado', HttpStatus.BAD_REQUEST)
  }
}