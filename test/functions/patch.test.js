import test from 'ava';

import { patch } from '../../';

// patch(v): Return the patch version number.

test('patch(v)', t => {
  t.is(patch('1'), 0);
  t.is(patch('1beta'), 0);
  t.is(patch('1beta1'), 0);
  t.is(patch('1.2alpha'), 0);
  t.is(patch('1.2ga'), 0);
  t.is(patch('1.2.3'), 3);
  t.is(patch('1.2.3.4'), 3);
  t.is(patch('1.2.3.4.5'), 3);
  t.is(patch('1.2.3-123'), 3);
  t.is(patch('1.2.3.alpha.4'), 3);
  t.is(patch('1.2.3.RELEASE.4'), 3);
});
