import { AcceptedEmail } from "src/entities/AcceptedEmail";
import { DataSource, Repository } from "typeorm";

import { Injectable } from "@nestjs/common";

@Injectable()
export class AcceptedEmailRepository extends Repository<AcceptedEmail> {
    constructor(private dataSource: DataSource)
    {
        super(AcceptedEmail, dataSource.createEntityManager());
    }
}
