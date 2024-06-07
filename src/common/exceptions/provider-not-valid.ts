import { HttpException, HttpStatus } from "@nestjs/common";

export class ProviderNotValidException extends HttpException {

  constructor() {
    super('Tipo de proveedor inválido', HttpStatus.BAD_REQUEST)
  }
}