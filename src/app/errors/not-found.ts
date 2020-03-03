import { APP_ERRORS, AppErrorAbstract } from './error.interface';

export class AppErrorEntityNotFound extends AppErrorAbstract {
  name = APP_ERRORS.EntityNotFound;
  constructor(public error: any, entityName: string) {
    super();
    this.message = `${entityName} does not exist`;
  }
}
