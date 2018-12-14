import test from 'ava';

import { prerelease } from '../../';

// prerelease(v): Returns an array of prerelease components, or null if none
// exist. Example: prerelease('1.2.3-alpha.1') -> ['alpha', 1]

test('prerelease(v)', t => {
  t.deepEqual(prerelease('1.2.3.alpha-1'), ['alpha', 1]);
  t.deepEqual(prerelease('1.2.3.alpha.1-2'), ['alpha.1', 2]);
  t.deepEqual(prerelease('1.2.3-1'), [1]);
  t.deepEqual(prerelease('1.2.3-1.2'), ['1.2']);

  t.is(prerelease('1'), null);
  t.is(prerelease('1.2'), null);
  t.is(prerelease('1.2.3'), null);
  t.is(prerelease('1.2.3.4'), null);
  t.is(prerelease('1.2.3.4.5'), null);

  t.is(prerelease('nonsense'), null);
  t.is(prerelease(''), null);
  t.is(prerelease(), null);
  t.is(prerelease(null), null);

  t.is(prerelease('1.2.3.Final'), null);
  t.is(prerelease('1.2.3-Final'), null);
  t.is(prerelease('1.2.3.GA'), null);
  t.is(prerelease('1.2.3-GA'), null);
  t.is(prerelease('1.2.3.RELEASE'), null);
  t.is(prerelease('1.2.3-RELEASE'), null);
  t.deepEqual(prerelease('1.2.3.RELEASE-1'), [1]);
  t.deepEqual(prerelease('1.2.3.RELEASE1'), [1]);
  t.is(prerelease('1.2.3.FINAL-RELEASE'), null);

  t.is(prerelease('1.2.3.SEC'), null);
  t.is(prerelease('1.2.3.SEC01'), null);
  t.deepEqual(prerelease('1.2.3.NONO-SEC01'), ['nono', 'sec', 1]);
  // TODO: these are not really "correct",
  //   but it's a vey edgy case - worth to handle?
  t.is(prerelease('1.2.3.SEC-ALPHA'), null);
  t.is(prerelease('1.2.3.SEC01-ALPHA'), null);
});
