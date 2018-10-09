import { Request, Response } from "express";
import { ExtendedRequest } from "../../interfaces/extended-request";
import { Post } from "../../entity/post";

export async function postsCreateAction(request: ExtendedRequest, response: Response) {
  const post = new Post();
  post.body = request.body.body;
  const createdPost = await request.context.repos.Post.save(post);
  response.json({ post: createdPost });
}