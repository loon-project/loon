import { helper } from './helper';
import test from 'ava';
import { Controller, Get, Res, Inject, Initialize, IInitializer, ApplicationLoader } from '../src';

@Initialize()
class InitializeClass implements IInitializer {

    @Inject()
    private application: ApplicationLoader;

    init() {
        (this.application as any).initProperty = 'init';
    }
}

@Controller()
class UsersController {

    @Inject()
    private application: ApplicationLoader;

    @Get('/')
    indexAction(@Res() res) {
        res.send((this.application as any).initProperty);
    }
}

test('should run initializer', async t => {
    const response = await helper.getAxios().get('/');
    t.is(response.status, 200);
    t.is(response.data, 'init');
});
