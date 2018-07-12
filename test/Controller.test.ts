import test from 'ava'
import { bootstrapServer } from './util'
import { Controller, Get, Req, Res, Post, Patch, Put, Delete, Head, Options, All } from '../src'

@Controller('/rest')
class UsersController {

    @Get('/get')
    public indexAction(@Res() res) {
        res.send('rest get')
    }

    @Post('/post')
    public createAction(@Res() res) {
        res.send('rest post')
    }

    @Put('/put')
    @Patch('/patch')
    public updateAction(@Res() res) {
        res.send('rest update')
    }

    @Delete('/delete')
    public deleteAction(@Res() res) {
        res.send('rest delete')
    }

    @Head('/head')
    public headAction(@Res() res) {
        res.send('')
    }

    @Options('/options')
    public optionsAction(@Res() res) {
        res.send('')
    }

    @All('/all')
    public allAction(@Res() res) {
        res.send('rest all')
    }
}

bootstrapServer(({getAxios}) => {

    test('Controller get', async t => {
        const response = await getAxios().get('/rest/get')
        t.is(response.status, 200)
        t.is(response.data, 'rest get')
    })

    test('Controller post', async t => {
        const response = await getAxios().post('/rest/post')
        t.is(response.status, 200)
        t.is(response.data, 'rest post')
    })

    test('Controller put', async t => {
        const response = await getAxios().put('/rest/put')
        t.is(response.status, 200)
        t.is(response.data, 'rest update')
    })

    test('Controller patch', async t => {
        const response = await getAxios().patch('/rest/patch')
        t.is(response.status, 200)
        t.is(response.data, 'rest update')
    })

    test('Controller delete', async t => {
        const response = await getAxios().delete('/rest/delete')
        t.is(response.status, 200)
        t.is(response.data, 'rest delete')
    })

    test('Controller head', async t => {
        const response = await getAxios().head('/rest/head')
        t.is(response.status, 200)
    })

    test('Controller options', async t => {
        const response = await getAxios().options('/rest/options')
        t.is(response.status, 200)
    })

    test('Controller all', async t => {

        const ret = ['get', 'post', 'put', 'patch', 'delete'].map(async method => {
            const response = await getAxios()[method]('/rest/all')
            t.is(response.status, 200)
            t.is(response.data, 'rest all')
        })

        await Promise.all(ret)
    })
})

