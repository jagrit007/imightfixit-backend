import 'reflect-metadata';
import { DataSource, EntityTarget, ObjectLiteral, Repository } from 'typeorm';

let typeORMDB: DataSource;

export default async function typeORMConnect(): Promise<void> {
    const dataSource = new DataSource({
        type: 'postgres',
        host: "localhost",
        port: 5432,
        username: "root",
        password: "meonly123",
        database: "test",
        entities: [
            `${__dirname}/entity/*.entity.ts`
        ],
        synchronize: true,
    });

    typeORMDB = await dataSource.initialize();
}

// Executes TypeORM query for the provided entity model
export function useTypeORM(
    entity: EntityTarget<ObjectLiteral>
): Repository<ObjectLiteral> {
    if (!typeORMDB) {
        throw new Error('TypeORM has not been initialized!');
    }

    return typeORMDB.getRepository(entity);
}