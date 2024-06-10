import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}

// local es una estrategia que te permite utilizar el passport que es una autenticación mediante usuario y contraseña pero nosotros la configuramos para correo electronico y contraseña.