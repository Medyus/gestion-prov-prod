import { HttpException, HttpStatus } from "@nestjs/common";

export class EmailNotFoundException extends HttpException {

  constructor() {
    super('Email no encontrado', HttpStatus.BAD_REQUEST)
  }
}