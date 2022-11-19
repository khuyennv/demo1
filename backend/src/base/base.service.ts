import queryString from "query-string";
import { PaginationDto } from "src/base/pagination.dto";
import { ErrorCodes } from "src/constants/error-code.const";
import {
  toSnakeCase,
  trim,
} from "src/utils/general.util";
import { throwNotFound } from "src/utils/throw-exception.util";
import {
  BaseEntity,
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  ObjectID,
  Repository,
  SelectQueryBuilder,
  UpdateResult,
} from "typeorm";
import { EntityId } from "typeorm/repository/EntityId";

import { LoggerService } from "../logger/custom.logger";
import { BaseDto } from "./base.dto";
import { BaseServiceInterface } from "./base.service.interface";

export class BaseService<T extends BaseEntity, R extends Repository<T>> implements BaseServiceInterface<T> {
    protected readonly repository: R
    protected readonly logger: LoggerService

    /**
     * @param {R} repository 
     * @param {LoggerService} logger 
     */
    constructor(repository: R, logger?: LoggerService) {
        this.repository = repository
        this.logger = logger
    }

    /**
     * @returns Promise<T[]>
     */
    index(): Promise<T[]> {
        return this.repository.find()
    }

    /**
     * @param {FindManyOptions<T>} options 
     * @returns Promise<number>
     */
    async count(options?: FindManyOptions<T>): Promise<number> {

        return this.repository.count(options)
    }

    /**
     * @param {EntityId} id 
     * @returns Promise<T>
     */
     findById(where: FindOptionsWhere<T> | FindOptionsWhere<T>[]): Promise<T> {
        return this.repository.findOneBy(where)
    }

    /**
     * @param {number[]} ids 
     * @returns
     */
    findByIds(ids: number[]) {
        return this.repository.findByIds(ids)
    }

    /**
     * @param {EntityId} id 
     * @returns Promise<DeleteResult>
     */
    delete(id: EntityId): Promise<DeleteResult> {
        return this.repository.delete(id)
    }

    /**
     * @returns Promise<T>
     */
     async findOne(conditions: FindOptionsWhere<T>): Promise<T> {
        return this.repository.findOne({ where: conditions })
    }

    /**
     * @param {FindConditions<T>} conditions 
     * @param {FindOneOptions<T>} options 
     * @returns Promise<T>
     */
     async getOne(contidions: FindOptionsWhere<T>, fields?: string[]): Promise<T> {
        const findOneoptions: FindOneOptions<T> = { where: contidions }

        if (fields) {
            findOneoptions.select = fields as (keyof T)[]
        }

        return this.repository.findOne(findOneoptions)
    }

    /**
     * @param {number} id 
     * @returns Promise<DeleteResult>
     */
    async remove(id: number): Promise<DeleteResult> {
        return this.repository.delete(id);
    }

    /**
     * @param {FindConditions<T>} conditions 
     * @returns Promise<DeleteResult>
     */
     async removeOne(criteria: string | string[] | number | number[] | Date | Date[] | ObjectID | ObjectID[] | FindOptionsWhere<T>) {
        return await this.repository.delete(criteria)
    }


    /**
     * @param {Record<string, unknown>} data 
     * @returns 
     */
    save(data: any): Promise<T> {
        return this.repository.save(data)
    }

    /**
     * @param {number} id 
     * @param {any} data 
     * @returns 
     */
     async update(id: number, data: any): Promise<UpdateResult> {
        return this.repository.update(id, data)
    }

    /**
     * @param {number} page 
     * @param {number} limit 
     * @param {string[]} fields 
     * @returns Promise<PaginationDto<T>>
     */
    async paginate(page: number, limit: number, fields?: string[]): Promise<PaginationDto<T>> {
        const totalRecords = await this.repository.count()
        const totalPage = (totalRecords % limit) === 0 ? totalRecords / limit : Math.floor(totalRecords / limit) + 1

        if (page > totalPage || page <= 0) {
            throwNotFound(
                "RECORD_NOT_FOUND",
                "No record was found",
                ErrorCodes.RECORD_NOT_FOUND
            )
        }


        const offset = page === 1 ? 0 : limit * (page - 1)

        const data = await this.repository.find({
            select: (fields) ? fields as (keyof T)[] : null,
            skip: offset,
            take: limit
        })

        const next = (page < totalPage) ? `page=${page - -1}&limit=${limit}` : ""
        const prev = (page > 1) ? `page=${page - 1}&limit=${limit}` : ""

        return {
            data: data,
            meta: {
                pagination: {
                    currentPage: Number(page),

                    links: {
                        next: next,
                        prev: prev
                    },
                    limit: limit,
                    total: totalRecords,
                    totalPages: totalPage
                }
            }
        }
    }

    /**
     * @param page 
     * @param limit 
     * @param fields 
     * @returns 
     */
    async iPaginateSelect(filters: BaseDto<T>, page: number, limit: number, fields?: string[]): Promise<PaginationDto<T>> {
        const jobTable = this.repository.metadata.tableName

        const query = this.repository.createQueryBuilder(jobTable);
        if (fields) {
            query.select(`${jobTable}.${toSnakeCase("id")}`)

            fields.forEach(field => {
                query.addSelect(`${jobTable}.${field}`)
            })
        }

        Object.keys(filters).forEach(key => {
            const obj: Record<string, unknown> = {}
            obj[key] = filters[key]

            query.andWhere(`${jobTable}.${toSnakeCase(key)}=:${key}`, obj)
        });

        this.logger.debug(query.getSql());

        return await this.iPaginate(
            query,
            page,
            limit,
            queryString.stringify(filters)
        );
    }

    /**
     * @param queryBuilder 
     * @param page 
     * @param limit 
     * @param queryString 
     * @returns 
     */
    async iPaginate<T>(
        queryBuilder: SelectQueryBuilder<T>,
        page: number,
        limit: number,
        queryString?: string
    ): Promise<PaginationDto<T>> {
        const skip = (page - 1) * limit;
        const [items, total] = await queryBuilder
            .take(limit)
            .skip(skip)
            .getManyAndCount();

        if (total <= 0) {
            throwNotFound(
                "RECORD_NOT_FOUND",
                "No record was found",
                ErrorCodes.RECORD_NOT_FOUND
            )
        }

        const totalPage = (total % limit) === 0 ? 0 : Math.ceil(total / limit)
        const next = page < totalPage ? `${queryString ? queryString + "&" : ""}page=${page - -1}&limit=${limit}` : queryString ?? ""
        const prev = page > 1 ? `${queryString ? queryString + "&" : ""}page=${page - 1}&limit=${limit}` : queryString ?? ""

        return {
            data: items,
            meta: {
                pagination: {
                    currentPage: Number(page),
                    links: {
                        next: next,
                        prev: prev
                    },
                    limit: limit,
                    total: total,
                    totalPages: totalPage
                }
            }
        }
    }

    /**
     * @param queryBuilder 
     * @param page 
     * @param limit 
     * @param queryString
     * @returns 
     */
    async iPaginateCustom<T>(
        queryBuilder: SelectQueryBuilder<T>,
        page: number,
        limit: number,
        queryString?: string,
        customTable = null
    ): Promise<PaginationDto<T>> {
        const skip = (page - 1) * limit;

        const total = await queryBuilder.getCount()
        const list = await queryBuilder.getRawMany()
        const jobTable = customTable ?? this.repository.metadata.tableName

        let listResult: T[] = list.map(item => {
            let a: Record<string, unknown> = {}

            Object.keys(item).forEach(key => {
                if (key.lastIndexOf("id") === key.length - 2) {
                    a[trim(key, jobTable + "_", true)] = parseInt(item[key], 10)
                } else {
                    a[trim(key, jobTable + "_", true)] = item[key], 10
                }
            })

            return a as T
        })

        if (total <= 0) {
            throwNotFound(
                "RECORD_NOT_FOUND",
                "No record was found",
                ErrorCodes.RECORD_NOT_FOUND
            )
        }

        const totalPage = (total % limit) === 0 ? 0 : Math.ceil(total / limit)
        const next = page < totalPage ? `${queryString ? queryString + "&" : ""}page=${page - -1}&limit=${limit}` : queryString ?? ""
        const prev = page > 1 ? `${queryString ? queryString + "&" : ""}page=${page - 1}&limit=${limit}` : queryString ?? ""

        return {
            data: listResult,
            meta: {
                pagination: {
                    currentPage: Number(page),
                    links: {
                        next: next,
                        prev: prev
                    },
                    limit: limit,
                    total: total,
                    totalPages: totalPage
                }
            }
        }
    }

}

