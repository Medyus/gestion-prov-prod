import { HttpException, HttpStatus } from "@nestjs/common";

export class UserNotDeletedException extends HttpException {

  constructor() {
    super('Usuario no borrado', HttpStatus.BAD_REQUEST)
  }
}