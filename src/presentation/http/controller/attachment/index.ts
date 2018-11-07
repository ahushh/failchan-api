import { attachmentCreateAction } from './create';
import { attachmentDeleteAction } from './delete';
export const attachmentController = {
  create: attachmentCreateAction,
  delete: attachmentDeleteAction,
};
