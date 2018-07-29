import { helper } from './helper'
import test from 'ava'
import { Property, Controller, Get, Post, BodyParam, Res, PathParam, HeaderParam, QueryParam } from '../src'

@Controller()
class UsersController {

    @Get('/header')
    headerAction(@HeaderParam('authorization') authorization: string, @Res() res) {
        res.send(authorization === '123')
    }

    @Get('/path/:id')
    pathAction(@PathParam('id') id: number, @Res() res) {
        res.send(id === 1)
    }

    @Get('/query')
    queryAction(@QueryParam('id') id: number, @Res() res) {
        res.send(id === 1)
    }

    @Post('/body')
    bodyAction(@BodyParam() body: number, @Res() res) {
        res.send(body === 1)
    }
}

test('should get header param', async t => {
    const response = await helper.getAxios().get('/header', {
        headers: {
            'authorization': '123'
        }
    })
    t.is(response.status, 200)
    t.is(response.data, true)
})

test('should get path param', async t => {
    const response = await helper.getAxios().get('/path/1')
    t.is(response.status, 200)
    t.is(response.data, true)
})

test('should get query param', async t => {
    const response = await helper.getAxios().get('/query?id=1')
    t.is(response.status, 200)
    t.is(response.data, true)
})

test('should get body param', async t => {
    const response = await helper.getAxios().post('/body?id=1', "1", {
        headers: {
            'content-type': 'text/plain'
        }
    })
    t.is(response.status, 200)
    t.is(response.data, true)
})


