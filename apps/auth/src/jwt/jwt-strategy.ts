import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtRequest } from './jwt-request';

/**
 * En esta clase, estamos pasando al constructor de la clase
 * PassprtStrategy un objeto con el token y algunas propiedades
 * mas necesarias para la misma.
 *
 * * ExtractJwt
 * Es una funcion de passport-jwt la cual recupera el token de la
 * request recibida. Como puedes ver, estamos usando la interface
 * que creamos para JWT donde inyectamos la propiedad jwt
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: JwtRequest) => {
          return request?.jwt;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  public async validate(payload: any) {
    return { ...payload };
  }
}
