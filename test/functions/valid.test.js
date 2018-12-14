import test from 'ava';

import { valid } from '../../';

// valid(v): Return the parsed version, or null if it's not valid.

test('valid(v)', t => {
  t.is(valid(null), '');
  t.is(valid(''), '');
  t.is(valid('.'), '');
  t.is(valid('.-.'), '');

  t.is(valid('nonsense'), 'nonsense');

  t.is(valid('1'), '1');
  t.is(valid('1.1'), '1.1');
  t.is(valid('1.1.2'), '1.1.2');
  t.is(valid('1.1.2.3'), '1.1.2.3');

  t.is(valid('1.1.2.'), '1.1.2');
  t.is(valid('1.1.2.GA'), '1.1.2');
  t.is(valid('1.1.2-Final'), '1.1.2');
  t.is(valid('1.1.2.RELEASE-3'), '1.1.2-3');
  t.is(valid('1.1.2.GA-almost'), '1.1.2-almost');
  // TODO: bug? this should probably be '1.1.2-almost' instead
  t.is(valid('1.1.2.GA.almost'), '1.1.2-ga.almost');

  t.is(valid('1.1.2-4'), '1.1.2-4');
  t.is(valid('1.2-12-alpha-4'), '1.2-12-alpha-4');
  t.is(valid('1.2-12alpha-4'), '1.2-12-alpha-4');
  t.is(valid('1.2-alpha34-4'), '1.2-alpha-34-4');
  t.is(valid('1.2alpha34-4'), '1.2-alpha-34-4');
  t.is(valid('1.2ga34-4'), '1.2-34-4');

  t.is(valid('1.2alpha34BEtA4'), '1.2-alpha-34-beta-4');

  t.is(valid('1.1.2-4'), '1.1.2-4');
  t.is(valid('1.2-12-ga-4'), '1.2-12-4');
  t.is(valid('1.2-12Final-4'), '1.2-12-4');
  t.is(valid('1.2-release34-4'), '1.2-34-4');
  t.is(valid('1.2-release-34-4'), '1.2-34-4');
  t.is(valid('1.2ga34-4'), '1.2-34-4');

  t.is(valid('1.2FiNaL34BEtA4'), '1.2-34-beta-4');
});
