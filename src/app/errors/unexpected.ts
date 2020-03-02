import { APP_ERRORS, AppErrorAbstract } from './error.interface';

export class AppErrorUnexpected extends AppErrorAbstract {
  name = APP_ERRORS.Unexpected;
  message = 'An unexpected error has occurred';
  constructor(public error) {
    super();
    console.error('Unexpected error', JSON.stringify(error));
  }
}
