import { helper } from './helper';
import test from 'ava';
import { ApplicationLoader } from '../src';

const Hooks = ['$beforeInit', '$afterInit', '$beforeLoadMiddlewares', '$afterLoadMiddlewares', '$beforeLoadErrorMiddlewares', '$afterLoadErrorMiddlewares'];

function hookCalled(hook) {
    return `${hook}Call`;
}

class Application extends ApplicationLoader {
}

Hooks.forEach(hook => {
    Object.defineProperty(Application.prototype, hook, {
        value: function () {
            this[hookCalled(hook)] = true;
        }
    })
})

helper.setCustomApplication(Application);

test('should invoke $beforeInit', t => {
    Hooks.forEach(hook => {
        t.truthy((t.context as any).app[hookCalled(hook)]);
    })
});