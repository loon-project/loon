import { RestController, Get, Req, Res, Post } from '../../src'

@RestController('/rest')
export class RestController1 {

    @Get('/get')
    public indexAction(@Req() req, @Res() res) {
        res.send('rest get')
    }

    @Post('/post')
    public createAction(@Res() res) {
        res.send('rest post')
    }

}