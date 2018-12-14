import test from 'ava';

import { rcompare } from '../../';

// rcompare(v1, v2): The reverse of compare. Sorts an array of versions in
// descending order when passed to Array.sort().

test('rcompare(v1, v2): 0 if v1 == v2', t => {
  t.is(rcompare('1', '1'), 0);
  t.is(rcompare('1.1', '1.1'), 0);
  t.is(rcompare('1.1.0', '1.1.0'), 0);
  t.is(rcompare('1.1.0.1', '1.1.0.1'), 0);
  t.is(rcompare('1.1.0.1-alpha', '1.1.0.1-alpha'), 0);
  t.is(rcompare('1.1.0.1-alpha.2', '1.1.0.1-alpha.2'), 0);
  t.is(rcompare('1.1.0.Final', '1.1.0'), 0);
  t.is(rcompare('1.1.0-GA', '1.1.0'), 0);
  t.is(rcompare('1.1.0.RELEASE', '1.1.0'), 0);
});

test('rcompare(v1, v2): -1 if v1 > v2', t => {
  t.is(rcompare('2', '1'), -1);
  t.is(rcompare('1.2', '1.1'), -1);
  t.is(rcompare('1.1.1', '1.1.0'), -1);
  t.is(rcompare('1.1.0.2', '1.1.0.1'), -1);
  t.is(rcompare('1.1.0.1-beta', '1.1.0.1-alpha'), -1);
  t.is(rcompare('1.1.0.1-alpha.3', '1.1.0.1-alpha.2'), -1);
  t.is(rcompare('1.1.1.Final', '1.1.0'), -1);
  t.is(rcompare('1.1.0.1-GA', '1.1.0.beta'), -1);
  t.is(rcompare('1.1.1.RELEASE', '1.1.0'), -1);
});

test('rcompare(v1, v2): 1 if v1 < v2', t => {
  t.is(rcompare('1', '2'), 1);
  t.is(rcompare('1.1', '1.2'), 1);
  t.is(rcompare('1.1.0', '1.1.1'), 1);
  t.is(rcompare('1.1.0.1', '1.1.0.2'), 1);
  t.is(rcompare('1.1.0.1-alpha', '1.1.0.1-beta'), 1);
  t.is(rcompare('1.1.0.1-alpha.2', '1.1.0.1-alpha.3'), 1);
  t.is(rcompare('1.1.1.Final', '1.1.2'), 1);
  t.is(rcompare('1.1.0.1-GA', '1.1.2.beta'), 1);
  t.is(rcompare('1.1.1.RELEASE', '1.1.2'), 1);
});
