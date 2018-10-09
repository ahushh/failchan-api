import { Request, Response } from "express";
import { ExtendedRequest } from "../../interfaces/extended-request";

export async function postsGetAction(
  request: ExtendedRequest,
  response: Response
) {
  const post = request.context.models.Post;
  if (!post) {
    response.status(404).json({ message: 'Not found' })
  }
  response.json({ post });
}
