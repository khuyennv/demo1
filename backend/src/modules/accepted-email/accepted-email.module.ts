import { AcceptedEmail } from "src/entities/AcceptedEmail";
import { LoggerService } from "src/logger/custom.logger";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AcceptedEmailController } from "./accepted-email.controller";
import { AcceptedEmailRepository } from "./accepted-email.repository";
import { AcceptedEmailService } from "./accepted-email.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([AcceptedEmail]),
    ],
    controllers: [AcceptedEmailController],
    providers: [AcceptedEmailService, LoggerService, AcceptedEmailRepository]
})
export class AcceptedEmailModule {}
