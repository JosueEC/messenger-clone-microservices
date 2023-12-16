import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthGuard {
  public hasJWT() {
    return { jwt: 'token' };
  }
}
