import test from 'ava'
import { helper } from './helper'
import { Property, Controller, Get, Post, BodyParam, Res, Req, PathParam, HeaderParam, QueryParam, Middleware, IMiddleware, Next, ErrorMiddleware, Err } from '../src'

const { isExpress, isFastify } = helper;

@ErrorMiddleware()
class GlobalErrorMiddleware implements IMiddleware {
    use(@Err() err, @Res() res) {
        if (isExpress()) {
            res.send(err.message)
        } else {
            res.code(200).send(err.message)
        }
    }
}

if (isExpress()) {
    @ErrorMiddleware({baseUrl: '/partial'})
    class GlobalErrorMiddleware implements IMiddleware {
        use(@Err() err, @Req() req, @Res() res, @Next() next) {
            res.send(err.message)
        }
    }
}

@Controller()
class UsersController {
    @Get('/partial')
    partialAction(@Res() res, @Next() next) {
        next(new Error('partial error'))
    }

    @Get('/global')
    globalAction(@Res() res, @Next() next) {
        const err = new Error('global error')
        if (isExpress()) {
            next(err)
        } else if (isFastify()) {
            res.send(err)
        } else {
            throw 'test framework error'
        }
    }
}


test('should handle by global error middleware', async t => {
    const response = await helper.getAxios().get('/global')
    t.is(response.status, 200)
    t.is(response.data, 'global error')
})

if (isExpress()) {
    test('should handle by partial error middleware', async t => {
        const response = await helper.getAxios().get('/partial')
        t.is(response.status, 200)
        t.is(response.data, 'partial error')
    })
}