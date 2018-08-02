import { helper } from './helper';
import test from 'ava';
import { Controller, Get, Res, Component, Inject } from '../src';

@Component()
class InjectableComponent {
    tag() {
        return 'injectable';
    }
}

@Controller()
class UsersController {

    @Inject()
    private component: InjectableComponent;

    @Get('/')
    indexAction(@Res() res) {
        res.send(this.component.tag());
    }
}

test('should inject a component', async t => {
    const response = await helper.getAxios().get('/');
    t.is(response.status, 200);
    t.is(response.data, 'injectable');
});
