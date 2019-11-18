import { Container } from 'inversify';

import './presentation/http/controller/attachment.controller';
import './presentation/http/controller/board.controller';
import './presentation/http/controller/post.controller';
import './presentation/http/controller/thread.controller';

const container = new Container();

export { container };
