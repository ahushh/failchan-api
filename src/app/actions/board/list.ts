import { IAction } from '../../interfaces/action';
import { BoardService } from '../../service/board.service';
import { inject } from 'inversify';
import { IOC_TYPE } from '../../../config/type';
import { provide } from 'inversify-binding-decorators';

@provide(IOC_TYPE.ListBoardAction)
export class ListBoardAction implements IAction  {
  constructor(
    @inject(IOC_TYPE.BoardService) public service: BoardService,
  ) {}
  execute() {
    return this.service.list();
  }
}
