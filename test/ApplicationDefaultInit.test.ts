import './helper';
import test from 'ava';
import { Component, DependencyRegistry } from '../src';

@Component()
class TestService {
}

test('should should eager init component', async t => {
    const instance = DependencyRegistry.instances.get(TestService);
    t.is(instance.constructor.name, "TestService");
});
