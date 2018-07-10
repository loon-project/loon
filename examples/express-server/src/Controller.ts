import * as express from 'express'
import {Controller, RestController, Get, Res, Next, Middleware, IMiddleware} from "../../../src/index"

@Middleware()
export class GlobalMiddleware implements IMiddleware {
  public use(@Res() res: express.Response, @Next() next: express.NextFunction) {
    res.locals.var = "text"
    next()
  }
}


@RestController("/api/v2")
export default class ExampleController {

  @Get("/")
  public indexAction(@Res() res) {
    res.send({
      a: "B",
      var: res.locals.var
    })
  }

  @Get('/err')
  public errAction(@Next() next: express.NextFunction) {
    next(new Error('hey'))
  }
}