import {  APP_ERRORS, AppErrorAbstract } from './error.interface';

export class AppErrorBoardAlreadyExist extends AppErrorAbstract {
  name = APP_ERRORS.BoardAlreadyExists;
  message = 'Board with such slug already exists';

  constructor(public error) {
    super();
  }
}
