import { APP_ERRORS } from '../../../app/errors/error.interface';

export const ERROR2STATUS_CODE = {
  [APP_ERRORS.NotAuthorized]: 403,
  [APP_ERRORS.InvalidToken]: 403,
  [APP_ERRORS.AttachmentCacheRecordNotFound]: 400,
  [APP_ERRORS.EntityNotFound]: 404,
  [APP_ERRORS.Unexpected]: 500,
  [APP_ERRORS.ValidationError]: 400,
};
