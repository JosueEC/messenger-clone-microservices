import { Request } from 'express';

/**
 * Esto es solo para poder inyectar el JWT en las request que se
 * reciben al servidor, y asi mismo obtener el autocompletado
 * que nos proporsiona TypeScript
 */
export interface JwtRequest extends Request {
  jwt?: string;
}
