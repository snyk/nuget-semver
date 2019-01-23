const test = require('ava');

const { maxSatisfying } = require('../../');

// maxSatisfying(versions, range): Return the highest version in the list that
// satisfies the range, or null if none of them do.

test('maxSatisfying(versions, range)', t => {
  t.is(maxSatisfying(['1.2.3', '1.2.4'], '[1.2,)'), '1.2.4');
  t.is(maxSatisfying(['1.2.3', '1.2.4'], '1.2'), '1.2.4');
  t.is(maxSatisfying(['1.2.3', '1.2.4', '1.2.5'], '[1.1,1.2.4]'), '1.2.4');
  t.is(maxSatisfying(['1.2.4', '1.2.3'], '(1.2,)'), '1.2.4');
  t.is(maxSatisfying(['1.2.3', '1.2.4', '1.2.5', '1.2.6'],'(1.2.3,)'), '1.2.6');
  t.is(maxSatisfying(['1.1.0', '1.2.0', '1.2.1', '1.3.0', '2.0.0b1', '2.0.0b2',
    '2.0.0b3', '2.0.0', '2.1.0',], '[2.0.0,2.1.0)'), '2.0.0');
  t.is(maxSatisfying(['11.0.1', '11.0.2', '12.0.1-beta1', '12.0.1-beta2',], '11.0.2'), '12.0.1-beta2');

  t.is(maxSatisfying(['1.2.3', '1.2.4'], '[3.2,)'), null);

  // verify * matching
  const versions = [
    '2.5.7.10213',
    '2.5.9.10348',
    '2.5.10.11092',
    '2.6.0.12051',
    '2.6.0.12054',
    '2.6.1',
    '2.6.2',
    '2.6.3',
    '2.6.4',
    '2.6.5',
    '2.6.6',
    '2.6.7',
    '2.7.0',
    '3.0.0-alpha',
    '3.0.0-alpha-2',
    '3.0.0-alpha-5',
    '3.0.0-beta-1',
    '3.0.0-beta-2',
    '3.0.0-beta-3',
    '3.0.0-rc',
    '3.0.0-rc-2',
    '3.0.0-rc-3',
    '3.0.0',
    '3.0.1',
    '3.2.0',
    '3.2.1',
    '3.4.0',
    '3.4.1',
    '3.5.0',
    '3.6.0',
    '3.6.1',
    '3.7.0',
    '3.7.1',
    '3.8.0',
    '3.8.1',
    '3.9.0',
    '3.10.0',
    '3.10.1',
    '3.11.0',
  ];
  t.is(maxSatisfying(versions, '*'), '3.11.0');
  t.is(maxSatisfying(versions, '2.*'), '2.7.0');
  t.is(maxSatisfying(versions, '3.6.*'), '3.6.1');
});
