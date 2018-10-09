import { Request, Response } from "express";
import { ExtendedRequest } from "../../interfaces/extended-request";

export async function postsListAction(request: ExtendedRequest, response: Response) {
  const posts = await request.context.repos.Post.find();
  response.json({ posts });
}