import { PendingEmail } from "src/entities/PendingEmail";
import { LoggerService } from "src/logger/custom.logger";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { PendingEmailController } from "./pending-email.controller";
import { PendingEmailRepository } from "./pending-email.repository";
import { PendingEmailService } from "./pending-email.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([PendingEmail]),
    ],
    controllers: [PendingEmailController],
    providers: [PendingEmailService, LoggerService, PendingEmailRepository]
  
})

export class PendingEmailModule {}
