import {ApplicationLoader, Get, Res, ErrorMiddleware, IMiddleware, Err, Controller} from "../../../src";
import * as http from 'http'
import * as http2 from 'http2'
import * as fastify from 'fastify'


@ErrorMiddleware()
class GlobalErrorHandler implements IMiddleware {
    use(@Err() err: Error, @Res() res) {
        res.code(200).send(err.message)
    }
}

@Controller()
class ApplicationController {

  @Get('/')
  indexAction(@Res() res: fastify.FastifyReply<(http.ServerResponse | http2.Http2ServerResponse)>) {
    res.send('Hello world')
  }

  @Get('/err')
  errorAction(@Res() res) {
      res.send(new Error('mmm'))
  }
}

new ApplicationLoader('fastify', {rootDir: __dirname}).start()

