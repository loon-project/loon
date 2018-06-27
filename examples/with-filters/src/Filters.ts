import {BeforeFilter, AfterFilter, Filter, IMiddleware, Res, Next} from "../../../src/index";
import * as fastify from 'fastify'
import * as http from 'http'


@Filter()
export class AuthFilter implements IMiddleware {

  use(@Res() res, @Next() next) {
    res.header('x-loon-custom', '0.0.1')
    next()
  }
}

@Filter()
export class RenderFilter implements IMiddleware {

  async use(@Res() res: fastify.FastifyReply<http.ServerResponse>, @Next() next) {
  }
}