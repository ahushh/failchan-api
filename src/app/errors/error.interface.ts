
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

  json(): { name: IAppError['name']; message: string; details: D | null; };
}

export abstract class AppErrorAbstract<D = any> {
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
  message = '';
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

  json(): { name: IAppError['name']; message: string; details: D | null; };
  json() {
    return { name: this.name, message: this.message, details: this.details || null };
  }
}
