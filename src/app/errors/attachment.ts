import { APP_ERRORS, AppErrorAbstract } from './error.interface';

export class AppErrorAttachmentCacheRecordNotFound extends AppErrorAbstract {
    name = APP_ERRORS.AttachmentCacheRecordNotFound;
    constructor(uid: string) {
        super();
        this.message = `File batch ${uid} not found`;
    }
}

// export class AppErrorAttachmentCacheRecordNotFound extends AppErrorAbstract {
//     name = APP_ERRORS.AttachmentCacheRecordNotFound;
//     constructor(uid: string) {
//         super();
//         this.message = `File batch ${uid} not found`;
//     }
// }
