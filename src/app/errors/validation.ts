import Joi from '@hapi/joi';
import { prop } from 'ramda';

import { APP_ERRORS, AppErrorAbstract } from './error.interface';

export class AppValidationError extends AppErrorAbstract<Joi.ValidationError[]> {
  name = APP_ERRORS.ValidationError;
  message = 'Passed arguments do not match the schema';
  constructor(public details: Joi.ValidationError[]) {
    super();
  }
}

export function validate(...schemas: Joi.Schema[]) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value as Function;
    descriptor.value = function (...args: any[]) {
      if (args.length !== schemas.length) {
        throw new Error(`Incorrect number of arguments and validator schemas in ${propertyKey} method of ${target.constructor.name}`);
      }
      const errors = schemas
        .map((schema, i) => schema.validate(args[i], { abortEarly: false }))
        .map(prop('error') as any)
        .filter(Boolean) as Joi.ValidationError[];

      if (errors.length) {
        throw new AppValidationError(errors);
      }
      return originalMethod.apply(this, args);
    };
  };
}
