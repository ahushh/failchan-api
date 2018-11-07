import Container from 'typedi';
import { createConnection, getConnectionOptions, useContainer } from 'typeorm';

export const createORMConnection = async () => {
  useContainer(Container);
  const options = await getConnectionOptions(<string>process.env.NODE_ENV);
  return createConnection({ ...options, name: 'default' });
};
