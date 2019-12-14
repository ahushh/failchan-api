import { IAppError } from './error.interface';

export class AppErrorBoardAlreadyExist implements IAppError {
  name = 'AlreadyExists';
  message = 'Board with such slug already exists';

  constructor(public error) { }
}

