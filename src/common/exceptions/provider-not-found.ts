import { HttpException, HttpStatus } from "@nestjs/common";

export class ProviderNotFoundException extends HttpException {

  constructor() {
    super('Proveedor no encontrado', HttpStatus.BAD_REQUEST)
  }
}