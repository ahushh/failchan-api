import { createConnection, getConnectionOptions, Connection } from 'typeorm';

export interface IORMConnection extends Connection {

}

export const createORMConnection = async () => {
  const options = await getConnectionOptions(<string>process.env.NODE_ENV);
  return createConnection({ ...options, name: 'default' }) as Promise<IORMConnection>;
};
