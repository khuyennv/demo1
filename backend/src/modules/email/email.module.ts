import { MessageComponent } from "src/components/message.component";
import { AcceptedEmail } from "src/entities/AcceptedEmail";
import { PendingEmail } from "src/entities/PendingEmail";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import {
  AcceptedEmailRepository,
} from "../accepted-email/accepted-email.repository";
import { AcceptedEmailService } from "../accepted-email/accepted-email.service";
import {
  PendingEmailRepository,
} from "../pending-email/pending-email.repository";
import { PendingEmailService } from "../pending-email/pending-email.service";
import { EmailController } from "./email.controller";
import { EmailService } from "./email.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            PendingEmail,
            AcceptedEmail
        ])

    ],
    controllers: [EmailController],
    providers: [
        EmailService,
        PendingEmailService,
        AcceptedEmailService,
        PendingEmailRepository,
        AcceptedEmailRepository, 
        MessageComponent
    ]
})
export class EmailModule {}
