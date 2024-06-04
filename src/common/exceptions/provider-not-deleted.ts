import { HttpException, HttpStatus } from "@nestjs/common";

export class ProviderNotDeletedException extends HttpException {

  constructor() {
    super('Proveedor no borrado', HttpStatus.BAD_REQUEST)
  }
}