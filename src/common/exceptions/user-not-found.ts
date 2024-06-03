import { HttpException, HttpStatus } from "@nestjs/common";

export class UserNotFoundException extends HttpException {

  constructor() {
    super('Usuario no encontrado', HttpStatus.BAD_REQUEST)
  }
}