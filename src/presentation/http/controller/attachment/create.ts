import { Request, Response } from 'express';
import R from 'ramda';
import { Container } from 'typedi';
import {
  AttachmentService, IAttachmentFile,
} from '../../../../app/service/attachment.service';
import { CHANNEL, EventBus } from '../../../../app/service/event-bus.service';

export async function attachmentCreateAction(request: Request, response: Response) {
  const eventBus = Container.get(EventBus);
  const files: Express.Multer.File[] = request.files as any[];
  const filesPrepared: IAttachmentFile[] = files.map(
    R.curry(
      R.pick(['path', 'originalname', 'mimetype', 'size']),
    ),
  );
  const service = Container.get(AttachmentService);
  const uid = service.createMultiple(filesPrepared);
  eventBus.once(`${CHANNEL.ATTACHMENTS_CREATED}:${uid}`, (ids) => {
    response.json({
      ids,
    });
  });
}
