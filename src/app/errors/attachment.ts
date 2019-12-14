import { IAppError } from './error.interface';

export class AppErrorAttachmentCacheRecordNotFound implements IAppError {
    name = 'CacheRecordNotFound'
    message = '';
    constructor(uid: string) {
        this.message = `File batch ${uid} not found`;
    }
}