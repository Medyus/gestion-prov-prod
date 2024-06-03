import { HttpException, HttpStatus } from "@nestjs/common";

export class ProductAlreadyExistsException extends HttpException {

  constructor() {
    super('Producto ya existe', HttpStatus.BAD_REQUEST)
  }
}