import { IAppError } from "./error.interface";

export class AppErrorUnexpected implements IAppError {
    name = 'Unexpected';
    message = 'An unexpected error has occurred';
    constructor(public error) {}
}