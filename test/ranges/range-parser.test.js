import test from 'ava';

import parseRange from '../../lib/range-parser';

// validRange(range): Return the valid range or null if it's not valid

test('validRange(range)', t => {
  const r1 = parseRange('(1.1,]');
  t.is(r1._components[0].minOperator, '>');
  t.is(r1._components[0].minOperand, '1.1');

  const r2 = parseRange('1.2');
  t.is(r2._components[0].minOperator, '>=');
  t.is(r2._components[0].minOperand, '1.2');

  const r3 = parseRange('[1.3]');
  t.is(r3._components[0].minOperator, '==');
  t.is(r3._components[0].minOperand, '1.3');

  const r4 = parseRange('[,1.4)');
  t.is(r4._components[0].maxOperator, '<');
  t.is(r4._components[0].maxOperand, '1.4');

  const r5 = parseRange('[5,)');
  t.is(r5._components[0].minOperator, '>=');
  t.is(r5._components[0].minOperand, '5');

  const r6 = parseRange('[,6)');
  t.is(r6._components[0].maxOperator, '<');
  t.is(r6._components[0].maxOperand, '6');

  const r7 = parseRange('(1.1,)');
  t.is(r7._components[0].minOperator, '>');
  t.is(r7._components[0].minOperand, '1.1');

  const r8 = parseRange('(,1.4)');
  t.is(r8._components[0].maxOperator, '<');
  t.is(r8._components[0].maxOperand, '1.4');

  const r11 = parseRange('[2.1,3.1]');
  t.is(r11._components[0].minOperator, '>=');
  t.is(r11._components[0].minOperand, '2.1');
  t.is(r11._components[0].maxOperator, '<=');
  t.is(r11._components[0].maxOperand, '3.1');

  const r12 = parseRange('(2.2, 3.2]');
  t.is(r12._components[0].minOperator, '>');
  t.is(r12._components[0].minOperand, '2.2');
  t.is(r12._components[0].maxOperator, '<=');
  t.is(r12._components[0].maxOperand, '3.2');

  const r13 = parseRange('[2.3, 3.3)');
  t.is(r13._components[0].minOperator, '>=');
  t.is(r13._components[0].minOperand, '2.3');
  t.is(r13._components[0].maxOperator, '<');
  t.is(r13._components[0].maxOperand, '3.3');

  const r14 = parseRange('(2.4, 3.4)');
  t.is(r14._components[0].minOperator, '>');
  t.is(r14._components[0].minOperand, '2.4');
  t.is(r14._components[0].maxOperator, '<');
  t.is(r14._components[0].maxOperand, '3.4');
});
