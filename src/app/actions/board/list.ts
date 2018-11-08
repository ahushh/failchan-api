import Container from 'typedi';
import { IAction } from '../../interfaces/action';
import { BoardService } from '../../service/board.service';

export class ListBoardAction implements IAction  {
  execute() {
    const service = Container.get(BoardService);
    return service.list();
  }
}
