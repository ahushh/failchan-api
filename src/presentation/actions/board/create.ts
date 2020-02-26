import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IOC_TYPE } from '../../../config/type';
import { IAction } from '../../../app/interfaces/action';
import { BoardService } from '../../../app/service/board.service';

@provide(IOC_TYPE.CreateBoardAction, true)
@provide('action', true)
export class CreateBoardAction implements IAction {
  payloadExample = `"slug": "b", "name": "random"`
  description = ''
  constructor(
    @inject(IOC_TYPE.BoardService) public service: BoardService,
  ) { }
  execute(request: { slug: string; name: string }) {
    return this.service.create(request);
  }
}
