import { PendingEmail } from "src/entities/PendingEmail";
import { DataSource, Repository } from "typeorm";

import { Injectable } from "@nestjs/common";

@Injectable()
export class PendingEmailRepository extends Repository<PendingEmail> {
    constructor(private dataSource: DataSource)
    {
        super(PendingEmail, dataSource.createEntityManager());
    }
}
