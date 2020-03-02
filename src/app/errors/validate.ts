import Joi from '@hapi/joi';
import { prop } from 'ramda';

import { IAppError } from './error.interface';

export class ValidationError implements IAppError {
  name = 'ValidationError';
  message = 'Passed arguments do not match the schema';
  constructor(public errors: Joi.ValidationError[]) { }

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
        throw new ValidationError(errors);
      }
      return originalMethod.apply(this, args);
    };
  };
}
