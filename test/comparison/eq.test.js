import test from 'ava';

import { eq } from '../../';

test('eq(a, b) === true', t => {
  t.true(eq('2', '2'));
  t.true(eq('2', '2.0'));
  t.true(eq('2', '2.0.0'));
  t.true(eq('2', '2.0.0.0'));
  t.true(eq('2', '2.0.0.0.0'));
  t.true(eq('2.0', '2.0.0.0.0'));
  t.true(eq('2.0.0', '2.0.0.0.0'));
  t.true(eq('2.0.0.0', '2.0.0.0.0'));
  t.true(eq('2.0.0.0.0', '2.0.0.0.0'));
  t.true(eq('2.0.0.0.0', '2.0.0.0'));
  t.true(eq('2.0.0.0.0', '2.0.0'));
  t.true(eq('2.0.0.0.0', '2.0'));
  t.true(eq('2.0.0.0.0', '2'));
  t.true(eq('2.0.0.0', '2'));
  t.true(eq('2.0.0', '2'));
  t.true(eq('2.0', '2'));
  t.true(eq('5.4', '5.4'));
  t.true(eq('5.4', '5.4.0'));
  t.true(eq('5.0.1', '5.0.1'));
  t.true(eq('5.0.1.52', '5.0.1.52'));
  t.true(eq('5.0.1.52.200', '5.0.1.52.200'));
  t.true(eq('5.0.1-beta.3', '5.0.1-beta.3'));
  t.true(eq('5.0.1-beta.3', '5.0.1.beta.3'));
  t.true(eq('5.0.1-beta', '5.0.1-beta'));
  t.true(eq('5.0.1-beta', '5.0.1.beta'));
  t.true(eq('5.0.1.Final', '5.0.1'));
  t.true(eq('5.0.1.1-GA', '5.0.1.1'));
});

test('eq(a, b) !== true', t => {
  t.false(eq('2', '1'));
  t.false(eq('5.4', '5.3'));
  t.false(eq('5.0.1', '5.0.0'));
  t.false(eq('5.0.1.52', '5.0.1.34'));
  t.false(eq('5.0.1.52.200', '5.0.1.52.176'));
  t.false(eq('5.0.1-beta.3', '5.0.1-beta.1'));
  t.false(eq('5.0.1-beta', '5.0.1-alpha'));
  t.false(eq('5.0.1.Final', '5.0.1.a'));
  t.false(eq('5.0.1.1-GA', '5.0.1-a'));
  t.false(eq('5.0.1', '5.0.1.a'));
});
