import { HttpException, HttpStatus } from "@nestjs/common";

export class ProductNotValidException extends HttpException {

  constructor() {
    super('Tipo de producto inválido', HttpStatus.BAD_REQUEST)
  }
}