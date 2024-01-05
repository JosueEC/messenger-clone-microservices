import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { SharedService } from '@app/shared';
import { AuthGuard } from '@app/shared';
import { PresenceService } from './presence.service';

@Controller()
export class PresenceController {
  constructor(
    private readonly presenceService: PresenceService,
    private readonly sharedService: SharedService,
    private readonly authGuard: AuthGuard,
  ) {}

  @MessagePattern({ cmd: 'get-presence' })
  public async getPresence(@Ctx() context: RmqContext) {
    this.sharedService.acknowledgeMessage(context);

    // TEMP
    console.log(123, this.authGuard.hasJWT());
    return this.presenceService.getHello();
  }
}
