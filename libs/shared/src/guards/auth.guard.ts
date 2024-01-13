import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, catchError, of, switchMap } from 'rxjs';

/**
 * la clase Guard es la que contiene todo el codigo que se ejecuta
 * antes de avanzar a la function del controller que fue marcada
 * con este Guard.
 *
 * Toda esa logica estara dentro del metodo canActivate.
 * Este metodo debe retornar un booleano, cuando este sea false,
 * significa que el gaurd no permite avanzar por X razon, caso
 * contrario con true.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('AUTH_SERVICE')
    private readonly authService: ClientProxy,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    /**
     * La linea del throw es usada cuando aun no tenemos
     * implementado el metodo:
     * * throw new Error('Method not implemented.');
     */
    /**
     * A traves del context, podemos acceder a diferentes
     * propiedades de la request recibida y evaluada. En este
     * caso primero se verifica que sea una request de tipo
     * HTTP, caso contrario el Guard la rechaza
     */
    if (context.getType() !== 'http') {
      return false;
    }

    /**
     * Asi mismo, a traves del metodo .switchToHttp podemos acceder
     * a la request, response y next function de la peticion HTTP.
     *
     * Para este guard necesitamos acceder al token que deberia
     * venir en el header de la peticion, especificamente en la
     * propiedad 'authorization'. Esta propiedad se esta accediendo
     * mediante la brackets notation.
     *
     * El 'as string' es para castear el valor a un string y poder
     * evaluarlo como una cadena de caracteres
     */
    const authHeader = context.switchToHttp().getRequest().headers[
      'authorization'
    ] as string;

    /**
     * Si el token no esta presente en la peticion, el guard no
     * permite el avance de la misma.
     */
    if (!authHeader) return false;

    /**
     * El token viene compuesto por 2 partes, un prefijo y el token:
     * * Bearer ksadhsd7843943094503
     * Debemos extraer solo el token, ya que es lo que necesitamos.
     */
    const jwt = authHeader.split(' ')[1] ?? false;

    /**
     * Una vez obtenido el token, en este caso, estamos inyectando
     * el microservicio de auth, para poder hacer uso de su endpoint
     * 'verify-token' el cual hace uso de la funciones que verifican
     * la validez del token.
     */
    /**
     * El metodo .pipe(), en el contexto de un 'observable', seria
     * el equivalente al metodo .then() en una 'promise'.
     *
     * Con este metodo podemos mapear la respuesta del 'observable'
     * devuelta por el auth microservice.
     *
     * Dado que el microservicio nos devuelve la fecha de expiracion
     * podemos hacer mas validaciones para aprobar o rechar el
     * pase del Guard.
     */
    return this.authService
      .send(
        { cmd: 'verify-token' },
        {
          jwt,
        },
      )
      .pipe(
        switchMap(({ exp }) => {
          /**
           * Para los retornos dentro de un 'observable' usamos
           * el operador 'of' de 'rxjs'
           */
          console.log('exp:', exp);
          if (!exp) return of(false);

          const TOKEN_EXP_MS = exp * 1000;
          const isJwtValid = Date.now() < TOKEN_EXP_MS;

          return of(isJwtValid);
        }),
        catchError(() => {
          throw new UnauthorizedException(
            'Something went wrong with the jwt validation',
          );
        }),
      );
  }
}
