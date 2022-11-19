import { MaxLength } from "class-validator";
import { BaseDto } from "src/base/base.dto";
import { AcceptedEmail } from "src/entities/AcceptedEmail";
import { PendingEmail } from "src/entities/PendingEmail";
import { Property } from "src/utils/general.util";

import { ApiProperty } from "@nestjs/swagger";

export class CreateEmailDto extends BaseDto<PendingEmail|AcceptedEmail> {
    @ApiProperty({
        required: true,
        description: "mail_to"
    })
    @Property()
    @MaxLength(255)
    mailTo: string

    @ApiProperty({
        required: true,
        description: "subject"
    })
    @Property()
    @MaxLength(255)
    subject: string

    @ApiProperty({
        required: true,
        description: "email content"
    })
    @Property()
    content: string
}
