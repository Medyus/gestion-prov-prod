import { HttpException, HttpStatus } from "@nestjs/common";

export class EmailAlreadyExistsException extends HttpException {

  constructor() {
    super('Email ya existe', HttpStatus.BAD_REQUEST)
  }
}