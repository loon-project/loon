import test from 'ava'
import { bootstrapServer } from './util'
import { Property, Controller, Get, Post, BodyParam, Res, Req, PathParam, HeaderParam, QueryParam, Middleware, IMiddleware, Next } from '../src'


@Middleware()
class GlobalMiddleware implements IMiddleware {
    use(@Req() req, @Res() res, @Next() next) {
        res.setHeader('global', 'true')
        next()
    }
}

@Middleware({baseUrl: '/partial'})
class PartialMiddleware implements IMiddleware {
    use(@Req() req, @Res() res, @Next() next) {
        res.setHeader('partial', 'true')
        next()
    }
}

@Controller()
class UsersController {

    @Get('/partial')
    partialAction(@Res() res) {
        res.send('')
    }

    @Get('/global')
    globalAction(@Res() res) {
        res.send('')
    }
}

bootstrapServer(({getAxios}) => {

    test('global middleware', async t => {
        const response1 = await getAxios().get('/global')
        t.is(response1.status, 200)
        t.is(response1.headers['global'], 'true')

        const response2 = await getAxios().get('/partial')
        t.is(response2.status, 200)
        t.is(response2.headers['global'], 'true')
    })

    test('partial middleware', async t => {
        const response1 = await getAxios().get('/global')
        t.is(response1.status, 200)
        t.is(response1.headers['partial'], undefined)

        const response2 = await getAxios().get('/partial')
        t.is(response2.status, 200)
        t.is(response2.headers['partial'], 'true')
    })
})

