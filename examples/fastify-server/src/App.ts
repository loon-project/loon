import {ApplicationLoader, ApplicationSettings, RestController, Get, Res} from "../../../src/index";
import * as http from 'http'
import * as http2 from 'http2'
import * as fastify from 'fastify'


@ApplicationSettings({
    rootDir: `${__dirname}/../`
})
class Application extends ApplicationLoader {
}

@RestController('/')
class ApplicationController {

  @Get('/')
  get(@Res() res: fastify.FastifyReply<(http.ServerResponse | http2.Http2ServerResponse)>) {
    res.send('Hello world')
  }
}

(async () => {
  const server = await new Application('express').init() as fastify.FastifyInstance
  server.listen(8800, () => {
      console.log('server is up')
  })
})()

