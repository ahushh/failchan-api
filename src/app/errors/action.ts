import { IAppError } from './error.interface';
import { ValidationError } from './validation';

export class AppErrorActionRequestValidation implements IAppError {
    name = '';
    message = '';
    constructor(property: string, name: ValidationError, value: any) {
        this.name = name;
        this.message = `Property: ${property}, name: ${name}, value: ${value}`
    }
}