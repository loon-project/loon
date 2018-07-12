import {ApplicationLoader, ApplicationSettings, Get, Res, ErrorMiddleware, IMiddleware, Err, Controller} from "../../../src/index";
import * as http from 'http'
import * as http2 from 'http2'
import * as fastify from 'fastify'


@ApplicationSettings({
    rootDir: `${__dirname}/../`
})
class Application extends ApplicationLoader {
}

@ErrorMiddleware()
class GlobalErrorHandler implements IMiddleware {
    use(@Err() err: Error, @Res() res) {
        console.log('rrrrrrrrrrrrrrrr')
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

(async () => {
  const server = await new Application('fastify').init() as fastify.FastifyInstance
  server.listen(8800, () => {
      console.log('server is up')
  })
})()

