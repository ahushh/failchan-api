
export const APP_ERRORS = {
  AttachmentCacheRecordNotFound: 'AttachmentCacheRecordNotFound',
  BoardAlreadyExists: 'BoardAlreadyExists',
  InvalidToken: 'InvalidToken',
  Unexpected: 'Unexpected',
  ValidationError: 'ValidationError',
  NotAuthorized: 'NotAuthorized',
  EntityNotFound: 'EntityNotFound',
  UploadError: 'UploadError',
} as const;

export type AppErrorName = keyof typeof APP_ERRORS;

export interface IAppError<D = any> {
  /**
   * Error uniq name
   *t
   * @type {AppErrorName}
   * @memberof IAppError
   */

  name: AppErrorName;
  /**
   * User friendly message
   *
   * @type {string}
   * @memberof IAppError
   */
  message: string;
  /**
   * Original error for debug purpose
   *
   * @type {Error}
   * @memberof IAppError
   */
  error?: Error;

  /**
   * Any additional information
   *
   * @type {*}
   * @memberof IAppError
   */
  details?: D;

  json(): { name: IAppError['name']; message: string; details: D | null; stack: string | null };
}

export abstract class AppErrorAbstract<D = any> implements IAppError {
  /**
 * Error uniq name
 *t
 * @type {AppErrorName}
 * @memberof AppErrorAbstract
 */

  name: AppErrorName;
  /**
   * User friendly message
   *
   * @type {string}
   * @memberof AppErrorAbstract
   */
  message = '';
  /**
   * Original error for debug purpose
   *
   * @type {Error}
   * @memberof AppErrorAbstract
   */
  error?: Error;

  /**
   * Any additional information
   *
   * @type {*}
   * @memberof AppErrorAbstract
   */
  details?: D;

  json() {
    return {
      name: this.name,
      message: this.message,
      details: this.details || null,
      stack: (this.error && this.error.stack) || null,
    };
  }
}
