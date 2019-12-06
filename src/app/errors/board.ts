import { IAppError } from './error.interface';

export class AppErrorBoardAlreadyExist implements IAppError {
  name = 'AlreadyExist';
  message = 'Board with such slug already exists';

  constructor(public error) { }
}

