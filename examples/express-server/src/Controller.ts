import {Controller, RestController, Get, Res} from "../../../src/index"


@RestController("/api/v2")
export default class ExampleController {

  @Get("/")
  public indexAction(@Res() res) {
    res.send({
      a: "B"
    })
  }
}