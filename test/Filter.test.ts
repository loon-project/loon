import test from 'ava'
import { bootstrapServer } from './util'
import { 
    RestController, Get, Req, Res, Post, Filter, 
    IMiddleware, Next, BeforeFilter, AfterFilter } from '../src'

@Filter()
class UserFilter implements IMiddleware {
    public use(@Res() res, @Next() next) {
        if (!res.data) res.data = {}
        res.data.username = "Jack";
        next();
    }
}

@Filter()
class RenderFilter implements IMiddleware {
    public use(@Res() res, @Next() next) {
        res.send(res.data);
        next()
    }
}

@Filter()
class OnlyChangeFilter implements IMiddleware {
    public use(@Res() res, @Next() next) {
        if (!res.data) res.data = {}
        res.data.only = true;
        next();
    }
}

@Filter()
class ExceptChangeFilter implements IMiddleware {
    public use(@Res() res, @Next() next) {
        if (!res.data) res.data = {}
        res.data.except = true;
        next();
    }
}

@RestController()
@BeforeFilter(UserFilter)
@AfterFilter(RenderFilter)
@BeforeFilter(OnlyChangeFilter, {only: ['onlyAction']})
@BeforeFilter(ExceptChangeFilter, {except: ['exceptAction']})
class UsersController {

    @Get("/before")
    public beforeAction(@Res() res) {
        res.send(res.data.username);
    }

    @Get("/after")
    public afterAction(@Res() res, @Next() next) {
        if (!res.data) res.data = {}
        res.data.username = "Hill";
        if (process.env.SERVER === 'express') {
            next();
        } else if (process.env.SERVER === 'fastify') {
            res.send(res.data)
        } else {
            throw 'test framework error'
        }
    }

    @Get("/only")
    public onlyAction(@Res() res) {
        res.send(res.data)
    }

    @Get('/except')
    public exceptAction(@Res() res) {
        res.send(res.data)
    }
}


bootstrapServer(({getAxios}) => {

    test('should successfully use BeforeFilter', async t => {
        const response = await getAxios().get('/before')
        t.is(response.status, 200)
        t.is(response.data, 'Jack')
    });

    test('should successfully use AfterFilter', async t => {
        const response = await getAxios().get('/after')
        t.is(response.status, 200)
        t.is(response.data.username, 'Hill')
    });

    test('should trigger Filter with action in the only FilterOptions', async t => {
        const response1 = await getAxios().get('/only')
        t.is(response1.status, 200)
        t.is(response1.data.only, true)

        const response2 = await getAxios().get('/except')
        t.is(response2.status, 200)
        t.is(response2.data.only, undefined)
    });

    test('should not trigger Filter with action in the except FilterOptions', async t => {
        const response1 = await getAxios().get('/only')
        t.is(response1.status, 200)
        t.is(response1.data.except, true)

        const response2 = await getAxios().get('/except')
        t.is(response2.status, 200)
        t.is(response2.data.except, undefined)
    });
})

