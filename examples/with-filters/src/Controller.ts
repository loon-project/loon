import {Controller, RestController, Get, Res, BeforeFilter} from "../../../src/index"
import {AuthFilter} from './Filters'


@RestController("/api/v2")
@BeforeFilter(AuthFilter)
export default class ExampleController {

  @Get("/")
  public indexAction(@Res() res) {
    res.send({
      a: "B"
    })
  }
}