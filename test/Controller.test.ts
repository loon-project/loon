import { helper } from './helper';
import test from 'ava';
import { Controller, Get, Res, Post, Patch, Put, Delete, Head, Options, All } from '../src';

@Controller('/rest')
class UsersController {

    @Get('/get')
    public indexAction(@Res() res) {
        res.send('rest get');
    }

    @Post('/post')
    public createAction(@Res() res) {
        res.send('rest post');
    }

    @Put('/put')
    @Patch('/patch')
    public updateAction(@Res() res) {
        res.send('rest update');
    }

    @Delete('/delete')
    public deleteAction(@Res() res) {
        res.send('rest delete');
    }

    @Head('/head')
    public headAction(@Res() res) {
        res.send('');
    }

    @Options('/options')
    public optionsAction(@Res() res) {
        res.send('');
    }

    @All('/all')
    public allAction(@Res() res) {
        res.send('rest all');
    }
}

test('Controller get', async t => {
    const response = await helper.getAxios().get('/rest/get');
    t.is(response.status, 200);
    t.is(response.data, 'rest get');
});

test('Controller post', async t => {
    const response = await helper.getAxios().post('/rest/post');
    t.is(response.status, 200);
    t.is(response.data, 'rest post');
});

test('Controller put', async t => {
    const response = await helper.getAxios().put('/rest/put');
    t.is(response.status, 200);
    t.is(response.data, 'rest update');
});

test('Controller patch', async t => {
    const response = await helper.getAxios().patch('/rest/patch');
    t.is(response.status, 200);
    t.is(response.data, 'rest update');
});

test('Controller delete', async t => {
    const response = await helper.getAxios().delete('/rest/delete');
    t.is(response.status, 200);
    t.is(response.data, 'rest delete');
});

test('Controller head', async t => {
    const response = await helper.getAxios().head('/rest/head');
    t.is(response.status, 200);
});

test('Controller options', async t => {
    const response = await helper.getAxios().options('/rest/options');
    t.is(response.status, 200);
});

test('Controller all', async t => {

    const ret = ['get', 'post', 'put', 'patch', 'delete'].map(async method => {
        const response = await helper.getAxios()[method]('/rest/all');
        t.is(response.status, 200);
        t.is(response.data, 'rest all');
    });

    await Promise.all(ret);
});
