import { Request } from "express";

export interface ExtendedRequest extends Request {
  context: { [k: string]: any };
  models: { [entity: string]: any };
}
