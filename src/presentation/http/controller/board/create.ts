import { Request, Response } from 'express';
import { Container } from 'typedi';
import { BOARD_ERRORS } from '../../../../app/errors/board';
import { BoardService } from '../../../../app/service/board.service';

export async function boardsCreateAction(request: Request, response: Response, next: Function) {
  const service = Container.get(BoardService);
  try {
    const createdBoard = await service.create(request.body);
    response.json({ board: createdBoard });
  } catch (e) {
    if (e.message === BOARD_ERRORS.ALREADY_EXISTS) {
      response.status(400).json({ error: e.message });
    }
    next(e);
  }
}
