import { IAppError } from "./error.interface";

export class AppErrorInvalidToken implements IAppError {
  name = 'InvalidToken';
  message = 'Supplied token is invalid';

  constructor(public error) { }
}
  
  
export class AppErrorNotAuthorized implements IAppError {
  name = 'NotAuthorized'
  message = 'You are not authorized to do it'
  constructor(public error?) {}
}