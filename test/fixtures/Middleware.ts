import { Middleware, IMiddleware } from '../../src'

@Middleware()
export class GlobalMiddleware implements IMiddleware {

    public use() {
    }

}