import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IOC_TYPE } from '../../../config/type';
import { IAction } from '../../../app/interfaces/action';
import { BoardService } from '../../../app/service/board.service';

@provide(IOC_TYPE.CreateBoardAction)
export class CreateBoardAction implements IAction {
  constructor(
    @inject(IOC_TYPE.BoardService) public service: BoardService,
  ) { }
  execute(request: { slug: string; name: string }) {
    return this.service.create(request);
  }
}
