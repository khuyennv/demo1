import { Controller } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiTags,
} from "@nestjs/swagger";

import { AcceptedEmailService } from "./accepted-email.service";

@ApiBearerAuth()
@ApiTags('accepted-emails')
@Controller("accepted-emails")
export class AcceptedEmailController {
  constructor(private readonly acceptedEmailService: AcceptedEmailService) {}
}
