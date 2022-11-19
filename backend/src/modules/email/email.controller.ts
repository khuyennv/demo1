import { BaseController } from "src/base/base.controller";
import { MessageComponent } from "src/components/message.component";
import { AcceptedEmail } from "src/entities/AcceptedEmail";
import { PendingEmail } from "src/entities/PendingEmail";
import { EmailStatus } from "src/enums/app.enum";
import { DataSource, EntityManager } from "typeorm";

import {
  Body,
  Controller,
  Get,
  Post,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import {
  AcceptedEmailRepository,
} from "../accepted-email/accepted-email.repository";
import { AcceptedEmailService } from "../accepted-email/accepted-email.service";
import {
  PendingEmailRepository,
} from "../pending-email/pending-email.repository";
import { PendingEmailService } from "../pending-email/pending-email.service";
import { CreateEmailDto } from "./dto/create.email";
import { UpdateEmailsDto } from "./dto/update.dto";

@Controller('emails')
@ApiTags("emails")
export class EmailController extends BaseController {
    constructor(
        private readonly pendingEmailService: PendingEmailService, 
        private readonly acceptedEmailService: AcceptedEmailService, 
        private i18n: MessageComponent,
        private dataSource: DataSource    
    ) {
        super(i18n);
    }

    @Get()
    async findAll(
    ): Promise<{pending: PendingEmail[], accepted: AcceptedEmail[]}> {
        try {
            const pending = await this.pendingEmailService.index()
            console.log("Debug", pending);
            const accepted = await this.acceptedEmailService.index()
            console.log("Debug", accepted);

            return {pending, accepted}
        } catch (error) {
            this.throwErrorProcess(error)
        }
    }

    @Post()
    async update(
            @Body() verifyEmails: UpdateEmailsDto
        ): Promise<{pending: PendingEmail[], accepted: AcceptedEmail[]}> {
            console.log("Debug", JSON.stringify(verifyEmails));
            let result: { pending: PendingEmail[]; accepted: AcceptedEmail[]; } | PromiseLike<{ pending: PendingEmail[]; accepted: AcceptedEmail[]; }>;
            try {
                // delete pending 
                const deleteEmailPending = verifyEmails.accepted && verifyEmails.accepted.filter(email => email.status === EmailStatus.Pending)
                const deleteEmailAccept = verifyEmails.pending && verifyEmails.pending.filter(email => email.status === EmailStatus.Accepted)
                const addEmailPending = verifyEmails.pending && verifyEmails.pending.filter(email => email.status === EmailStatus.Accepted)
                const addEmailAccept = verifyEmails.accepted && verifyEmails.accepted.filter(email => email.status === EmailStatus.Pending)

                console.log("Debug", deleteEmailPending, deleteEmailAccept , addEmailPending, addEmailAccept);
                await this.dataSource.transaction(async (manager: EntityManager) => {
                    const pendingEmailRepository = manager.getRepository(PendingEmail).extend(PendingEmailRepository)
                    const acceptedEmailRepository = manager.getRepository(AcceptedEmail).extend(AcceptedEmailRepository)
                    try {

                        // delete
                        deleteEmailPending.length && await pendingEmailRepository.delete(deleteEmailPending.map(email => email.id))
                        deleteEmailAccept.length && await acceptedEmailRepository.delete(deleteEmailAccept.map(email => email.id))

                        // add
                        addEmailPending.length && await pendingEmailRepository.save(addEmailPending.map(email => new CreateEmailDto(email)))
                        addEmailAccept.length && await acceptedEmailRepository.save(addEmailAccept.map(email => new CreateEmailDto(email)))
                    } catch (error) {
                        this.throwErrorProcess(error)
                    }
                })
            } catch (error) {
                this.throwErrorProcess(error)
            }

            const pending = await this.pendingEmailService.index()
            const accepted = await this.acceptedEmailService.index()
            console.log("Debug", {pending, accepted});

            result =  {pending, accepted}

            return result
        }
    
}
