import Container from 'typedi';
import { IAction } from '../../interfaces/action';
import { BoardService } from '../../service/board.service';

export class CreateBoardAction implements IAction {
  constructor(public request: { slug: string; name: string }) { }
  execute() {
    const service = Container.get(BoardService);
    return service.create(this.request);
  }
}
