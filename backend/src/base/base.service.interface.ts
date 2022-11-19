import {
  DeleteResult,
  FindOptionsWhere,
} from "typeorm";
import { EntityId } from "typeorm/repository/EntityId";

export interface BaseServiceInterface<T> {
    index(): Promise<T[]>

    findById(where: FindOptionsWhere<T> | FindOptionsWhere<T>[]): Promise<T>

    findByIds(id: number[]): Promise<T[]>

    delete(id: EntityId): Promise<DeleteResult>
}
