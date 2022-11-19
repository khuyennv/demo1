import { MigrationInterface, QueryRunner } from "typeorm";

export class initDataDemo1668849916198 implements MigrationInterface {

    async up(queryRunner: QueryRunner): Promise<void> {
        const serviceQuery = queryRunner.manager.createQueryBuilder().insert().into("pending_email")
        const pendingEmails = [
            {
                mail_to: "khuyen1@gmail.com",
                subject: "xin chao khuyen 1",
                content: "centent mail khuyen 1",
            },
            {
                mail_to: "khuyen2@gmail.com",
                subject: "xin chao khuyen 2",
                content: "centent mail khuyen 2",
            },
            {
                mail_to: "khuyen3@gmail.com",
                subject: "xin chao khuyen 4",
                content: "centent mail khuyen 5",
            }
        ];

        pendingEmails.forEach(insert => {
            void serviceQuery.values(insert).execute()
        })

        const acceptedQuery = queryRunner.manager.createQueryBuilder().insert().into("accepted_email")
        const acceptedEmails = [
            {
                mail_to: "khuyen5@gmail.com",
                subject: "xin chao khuyen 5",
                content: "centent mail khuyen 5",
            },
            {
                mail_to: "khuyen6@gmail.com",
                subject: "xin chao khuyen 6",
                content: "centent mail khuyen 6",
            },
            {
                mail_to: "khuyen7@gmail.com",
                subject: "xin chao khuyen 7",
                content: "centent mail khuyen 7",
            }
        ];

        acceptedEmails.forEach(insert => {
            void acceptedQuery.values(insert).execute()
        })
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        //
    }

}
