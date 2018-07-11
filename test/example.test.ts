import test from 'ava';
import './fixtures/Middleware'

test('arrays are equal', t => {
	t.deepEqual([1, 2], [1, 2]);
});