import { BaseService } from "src/base/base.service";
import { PendingEmail } from "src/entities/PendingEmail";
import { LoggerService } from "src/logger/custom.logger";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { PendingEmailRepository } from "./pending-email.repository";

@Injectable()
export class PendingEmailService extends BaseService<PendingEmail, PendingEmailRepository>  {
    constructor(
        @InjectRepository(PendingEmail)
        protected readonly repo: PendingEmailRepository,
        protected readonly logger: LoggerService,
    ) {
        super(repo, logger)
    }
}
