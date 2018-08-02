import './helper';
import test from 'ava';
import { isSimpleType, convertArrayToMap } from '../src';

test('isSimpleType', async t => {
    class CustomClass {
    }

    t.truthy(isSimpleType(String));
    t.truthy(isSimpleType(Boolean));
    t.truthy(isSimpleType(Number));
    t.truthy(isSimpleType(Object));
    t.truthy(isSimpleType(Date));
    t.falsy(isSimpleType(CustomClass));
});

test('convertArrayToMap', async t => {
    const arr = ['f1', 't2', 'j3'];
    const map = convertArrayToMap(arr);

    t.is(map.get(0), 'f1');
    t.is(map.get(1), 't2');
    t.is(map.get(2), 'j3');
});
