import { Request, Response } from 'express';
import { CreateBoardAction } from '../../../../app/actions/board/create';
import { BOARD_ERRORS } from '../../../../app/errors/board';

export async function boardsCreateAction(request: Request, response: Response, next: Function) {
  try {
    const board = await new CreateBoardAction(request.body).execute();
    response.json({ board });
  } catch (e) {
    if (e.name === 'AlreadyExists') {
      response.status(400).json({ error: e.message });
    }
    next(e);
  }
}
