import { HttpException, HttpStatus } from "@nestjs/common";

export class ProviderAlreadyExistsException extends HttpException {

  constructor() {
    super('Proveedor ya existe', HttpStatus.BAD_REQUEST)
  }
}