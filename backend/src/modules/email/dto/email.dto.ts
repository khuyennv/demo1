import {
  IsEnum,
  IsInt,
  IsString,
} from "class-validator";
import { BaseDto } from "src/base/base.dto";
import { AcceptedEmail } from "src/entities/AcceptedEmail";
import { PendingEmail } from "src/entities/PendingEmail";
import { EmailStatus } from "src/enums/app.enum";
import { Property } from "src/utils/general.util";

import { ApiProperty } from "@nestjs/swagger";

export class EmailDto extends BaseDto<PendingEmail|AcceptedEmail> {
    @ApiProperty({
        default: "0",
        required: true,
        description: "id",
        type: Number

    })
    @IsInt()
    @Property()
    id: number

    @ApiProperty({
        required: true,
        description: "mail_to",
        type: String
    })
    @Property()
    @IsString()
    // @MaxLength(255)
    mailTo: string

    @ApiProperty({
        required: true,
        description: "subject",
        type: String
    })
    @IsString()
    @Property()
    // @MaxLength(255)
    subject: string

    @ApiProperty({
        required: true,
        description: "email content",
        type: String
    })
    @Property()
    @IsString()
    content: string

    @ApiProperty({
        required: true,
        description: "status: 0-pending 1-accepted",
        type: EmailStatus
    })
    @IsEnum(EmailStatus)
    @Property()
    status: EmailStatus
}
