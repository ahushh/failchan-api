import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IAction } from '../../../app/interfaces/action';
import { BoardService } from '../../../app/service/board.service';
import { IOC_TYPE } from '../../../config/type';

@provide(IOC_TYPE.ListBoardAction, true)
@provide('action', true)
export class ListBoardAction implements IAction  {
  payloadExample = '';
  description = '';
  constructor(
    @inject(IOC_TYPE.BoardService) public service: BoardService,
  ) {}
  execute() {
    return this.service.list();
  }
}
