import { helper } from './helper';
import test from 'ava';
import { Component, DependencyRegistry } from '../src';

helper.setBootOptions({lazyInit: true})

@Component()
class TestService {
}

test('should lazy init component', async t => {
    const instance = DependencyRegistry.instances.get(TestService);
    t.is(instance, undefined);

    const testService = DependencyRegistry.get(TestService) as TestService;
    t.is(testService.constructor.name, "TestService");
});
