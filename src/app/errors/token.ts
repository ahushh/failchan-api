import { APP_ERRORS, AppErrorAbstract } from './error.interface';

export class AppErrorInvalidToken extends AppErrorAbstract {
  name = APP_ERRORS.InvalidToken;
  message = 'Supplied token is invalid';

  constructor(public error) {
    super();
  }
}

export class AppErrorNotAuthorized extends AppErrorAbstract {
  name = APP_ERRORS.NotAuthorized;
  message = 'You are not authorized to do it';
  constructor(public error?) {
    super();
  }
}
