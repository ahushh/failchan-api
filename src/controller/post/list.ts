import { Request, Response } from "express";

export async function postsListAction(request: Request, response: Response) {
  const posts = await request.context.repos.Post.find();
  response.json({ posts });
}