import {
  BaseEntity,
  Column,
  Entity,
} from "typeorm";

@Entity("pending_email")
export class PendingEmail extends BaseEntity {
    @Column("int", { primary: true, generated: "increment", name: "id" })
    id: number;

    @Column("varchar", {  name: "mail_to", length: 255 })
    mailTo: string;

    @Column("varchar", { name: "subject", length: 255 })
    subject: string;

    @Column("text", {
        name: "content",
        nullable: true,
        default: "''",
    })
    content: string;
}
