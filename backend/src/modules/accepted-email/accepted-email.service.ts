import { BaseService } from "src/base/base.service";
import { AcceptedEmail } from "src/entities/AcceptedEmail";
import { LoggerService } from "src/logger/custom.logger";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { AcceptedEmailRepository } from "./accepted-email.repository";

@Injectable()
export class AcceptedEmailService extends BaseService<AcceptedEmail, AcceptedEmailRepository> {
    constructor(
        @InjectRepository(AcceptedEmail)
        protected readonly repo: AcceptedEmailRepository,
        protected readonly logger: LoggerService,
    ) {
        super(repo, logger)
    }
}

