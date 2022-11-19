import {
  MigrationInterface,
  QueryRunner,
  Table,
} from "typeorm";

export class CreatePendingEmailTable1668849916196 implements MigrationInterface {
    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "pending_email",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        length: "11",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment"
                    },
                    {
                        name: "mail_to",
                        type: "varchar",
                        length: "255",
                        isNullable: false,
                    },
                    {
                        name: "subject",
                        type: "varchar",
                        length: "255",
                        isNullable: false,
                        default: "''",
                    },
                    {
                        name: "content",
                        type: "text",
                        isNullable: false,
                    }
                ],
            }),
        );

    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("pending_email");
    }
}
