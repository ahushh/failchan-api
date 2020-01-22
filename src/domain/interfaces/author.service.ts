import { Author } from '../entity/author';

export interface IAuthorService {
    getAuthorByToken(token?: string): Promise<{ author: Author; isNew: boolean; }>;

}
