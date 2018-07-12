import test from 'ava'
import { bootstrapServer } from './util'
import { Property, Controller, Get, Post, BodyParam, Res, Req, PathParam, HeaderParam, QueryParam, Middleware, IMiddleware, Next, ErrorMiddleware, Err, Component, Inject } from '../src'

@Component()
class InjectableComponent {
    tag() {
        return 'injectable'
    }
}

@Controller()
class UsersController {

    @Inject()
    private component: InjectableComponent

    @Get('/')
    indexAction(@Res() res) {
        res.send(this.component.tag())
    }
}

bootstrapServer(({getAxios}) => {
    test('should inject a component', async t => {
        const response = await getAxios().get('/')
        t.is(response.status, 200)
        t.is(response.data, 'injectable')
    })
})
