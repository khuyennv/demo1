import { Type } from "class-transformer";
import { IsArray, ValidateNested } from "class-validator";
import { BaseDto } from "src/base/base.dto";
import { AcceptedEmail } from "src/entities/AcceptedEmail";
import { PendingEmail } from "src/entities/PendingEmail";
import { Property } from "src/utils/general.util";

import { ApiProperty } from "@nestjs/swagger";

import { EmailDto } from "./email.dto";

export class UpdateEmailsDto extends BaseDto<PendingEmail|AcceptedEmail> {
    @ApiProperty({
        required: true,
        description: "[]",
    })
    @Property()
    @IsArray()
    @ValidateNested()
    @Type(() => EmailDto)
    pending: EmailDto[]

    @ApiProperty({
        required: true,
        description: "[]",
    })
    @Property()
    @IsArray()
    @ValidateNested()
    @Type(() => EmailDto)
    accepted: EmailDto[]
}
