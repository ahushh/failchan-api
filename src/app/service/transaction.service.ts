import { EntityManager, Connection } from "typeorm";
import { inject, injectable } from 'inversify';
import { IOC_TYPE } from "../../config/type";
import { provide } from "inversify-binding-decorators";

interface ITransactionService {
    run: (manager: EntityManager) => Promise<any>;
}

@provide(IOC_TYPE.TransactionService)
export class TransactionService implements ITransactionService {
    constructor(
        @inject(IOC_TYPE.ORMConnection) private connection: Connection
    ) {}
    async run(query) {
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            await query(queryRunner.connection.manager);
            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }
}