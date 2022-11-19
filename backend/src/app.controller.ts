import Request from "fastify";

import {
  Controller,
  Get,
  Req,
  UseGuards,
} from "@nestjs/common";

import { AppService } from "./app.service";
import { BaseError } from "./exceptions/errors/base.error";
import { DatabaseError } from "./exceptions/errors/database.error";
import { ValidateError } from "./exceptions/errors/validate.error";
import { startTimeOfDay } from "./utils/general.util";
import { RolesGuard } from "./validators/roles.guard";

@Controller()
@UseGuards(RolesGuard)
export class AppController {
    constructor(
        private readonly appService: AppService,
    ) { }

    @Get("profile")
    async getHello(@Req() request: Request): Promise<string> {
        console.log(startTimeOfDay())
        console.log(startTimeOfDay(false))

        return JSON.stringify([this.appService.getHello(), request.headers]);
    }

    @Get("exceptions")
    async TestException(@Req() request: Request): Promise<string> {
        try {
            throw new ValidateError("validate", "test", 400)
        } catch (e) {
            if (e instanceof ValidateError) {
                console.log("ValidateError", e)
            } else if (e instanceof DatabaseError) {
                console.log("DatabaseError", e);
            } else if (e instanceof BaseError) {
                console.log("BaseError", e);
            }
        }

        return "test"
    }

    @Get("healthz")
    selfCheck(): unknown {
        return { message: "Request Succeed!" };
    }
}
