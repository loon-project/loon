import test from 'ava'
import { bootstrapServer } from './util'
import { Property, Controller, Get, Post, BodyParam, Res, Req, PathParam, HeaderParam, QueryParam, Middleware, IMiddleware, Next, ErrorMiddleware, Err, Component, Inject, Initialize, IInitializer, ApplicationLoader } from '../src'


@Initialize()
class InitializeClass implements IInitializer {
    
    @Inject()
    private application: ApplicationLoader

    init() {
        (this.application as any).initProperty = 'init'
    }
}

@Controller()
class UsersController {

    @Inject()
    private application: ApplicationLoader

    @Get('/')
    indexAction(@Res() res) {
        res.send((this.application as any).initProperty)
    }
}

bootstrapServer(({getAxios}) => {

    test('should run initializer', async t => {
        const response = await getAxios().get('/')
        t.is(response.status, 200)
        t.is(response.data, 'init')
    })
})

