import {
  Logger,
  QueryRunner,
} from "typeorm";

export class MyCustomLogger implements Logger {
    /**
     * @param  {string} query
     * @param  {any[]} parameters?
     * @param  {QueryRunner} queryRunner?
     */
    logQuery(query: string, parameters?: unknown[], queryRunner?: QueryRunner): void {
        // console.log("logQuery->>>:", query, parameters)
    }

    /**
     * @param  {string|Error} error
     * @param  {string} query
     * @param  {any[]} parameters?
     * @param  {QueryRunner} queryRunner?
     */
    logQueryError(error: string | Error, query: string, parameters?: unknown[], queryRunner?: QueryRunner): void {
        console.log("logQueryError->>>:", error, query, parameters)
    }

    /**
     * @param  {number} time
     * @param  {string} query
     * @param  {any[]} parameters?
     * @param  {QueryRunner} queryRunner?
     */
    logQuerySlow(time: number, query: string, parameters?: unknown[], queryRunner?: QueryRunner): void {
        console.log("logQuerySlow->>>:", time, query, parameters)
    }

    /**
     * @param  {string} message
     * @param  {QueryRunner} queryRunner?
     */
    logSchemaBuild(message: string, queryRunner?: QueryRunner): void {
        console.log("logSchemaBuild->>>:", message)
    }

    /**
     * @param  {string} message
     * @param  {QueryRunner} queryRunner?
     */
    logMigration(message: string, queryRunner?: QueryRunner): void {
        console.log("logSchelogMigrationmaBuild->>>:", message)
    }

    /**
     * @param  {"log"|"info"|"warn"} level
     * @param  {any} message
     * @param  {QueryRunner} queryRunner?
     */
    log(level: "log" | "info" | "warn", message: unknown, queryRunner?: QueryRunner): void {
        // console.log("log->>>:", level, message)
    }
}