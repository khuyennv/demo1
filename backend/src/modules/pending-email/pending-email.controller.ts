import { Controller } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiTags,
} from "@nestjs/swagger";

import { PendingEmailService } from "./pending-email.service";

@ApiBearerAuth()
@ApiTags('accepted-emails')
@Controller("pending-emails")
export class PendingEmailController {
  constructor(private readonly pendingEmailService: PendingEmailService) {}
}
