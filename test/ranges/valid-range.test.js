import test from 'ava';

import { validRange } from '../../';

// validRange(range): Return the valid range or null if it's not valid

test('validRange(range)', t => {
  t.is(validRange('(1.0,]'), '(1.0,]');
  t.is(validRange('1.0'), '[1.0,)');
  t.is(validRange('(1.0)'), null);
  t.is(validRange('[1.0]'), '[1.0]');
  t.is(validRange('[1.2,1.3]'), '[1.2,1.3]');
  t.is(validRange('[1.0,2.0)'), '[1.0,2.0)');
  t.is(validRange('[1.5,)'), '[1.5,)');
  t.is(validRange('(,1.0],[1.2,)'), null);
  t.is(validRange('(,1.1),(1.1,)'), null);

  t.is(validRange('[2,2.1.18]'), '[2,2.1.18]');
  t.is(validRange('[2.1.19,3)'), '[2.1.19,3)');
  t.is(validRange('[3.9,3.9.1.Final]'), null);
  t.is(validRange('[1.0.10.GA_CP03,)'), null);
  t.is(validRange('[1.0.10.GA], [1.0.10.GA_CP01], [1.0.10.GA_CP02]'), null);
  t.is(validRange('[4,4.3.2.Final]'), null);
  t.is(validRange('[4.3.3-Final,5)'), '[4.3.3-Final,5)');
  t.is(validRange('(,1.0.4]'), '(,1.0.4]');
  t.is(validRange('[1.0.5,)'), '[1.0.5,)');
  t.is(validRange('[1.0.1.Final], (,1.0-final]'), null);
  t.is(validRange('[1.1.0-Alpha1,)'), '[1.1.0-Alpha1,)');
  t.is(validRange('[1.1.0-Alpha.1,)'), '[1.1.0-Alpha.1,)');
  t.is(validRange('[7,7.2.1], [3,3.0.0-CR2]'), null);
  t.is(validRange('[7.2.0.Final-redhat-2], [7.2.2,8)'), null);

  t.is(validRange('[1.0,)'), '[1.0,)');
  t.is(validRange('(,1.0]'), '(,1.0]');
  t.is(validRange('(1.0,2.0]'), '(1.0,2.0]');

  t.is(validRange(' [ 1.0 , 2.0 ) '), '[1.0,2.0)');

  // t.is(validRange('10a44'), '10-alpha-44');
  // t.is(validRange('10b44'), '10-beta-44');
  // t.is(validRange('10m44'), '10-milestone-44');
  // t.is(validRange('[3.9.2Final3,3.10)'), '[3.9.2,3.10)');
  // t.is(validRange('[10:44]'), [10-:-44]);
  // t.is(validRange('{1}'), '[{-1-}]');

  t.is(validRange('(1.0'), null);
  t.is(validRange('[1.0'), null);
  t.is(validRange('1.0)'), null);
  t.is(validRange('1.0]'), null);

  t.is(validRange(['1.0]']), null);

  t.is(validRange('(,1.4'), null);
  t.is(validRange(']1.5['), null);
  t.is(validRange('[[1.5]'), null);
  t.is(validRange('[1.5]]]'), null);
  t.is(validRange('),1.4('), null);
  t.is(validRange('>=5'), null);
  t.is(validRange('>5'), null);
  t.is(validRange('<=5'), null);
  t.is(validRange('<5'), null);
  t.is(validRange('=5'), null);
  // t.is(validRange('[1]||[2]'), null);
  // t.is(validRange('[1][2]'), null);
  // t.is(validRange('[>1,<1) ?'), null);

  // not yet supported (checking that brackets make sense)
  // t.is(validRange('[]1[]'), null);
});
