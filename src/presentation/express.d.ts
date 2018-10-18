declare global {
  namespace Express {
    export interface Request {
      context: any;
    }
  }
}
