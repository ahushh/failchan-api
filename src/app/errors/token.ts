import { IAppError } from "./error.interface";

export class AppErrorInvalidToken implements IAppError {
    name = 'InvalidToken';
    message = 'Supplied token is invalid';
  
    constructor(public error) { }
  }
  
  