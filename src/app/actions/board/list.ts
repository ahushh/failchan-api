import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IOC_TYPE } from '../../../config/type';
import { IAction } from '../action';
import { BoardService } from '../../service/board.service';

@provide(IOC_TYPE.ListBoardAction)
export class ListBoardAction implements IAction  {
  constructor(
    @inject(IOC_TYPE.BoardService) public service: BoardService,
  ) {}
  execute() {
    return this.service.list();
  }
}
