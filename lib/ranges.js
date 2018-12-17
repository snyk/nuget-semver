const parseVersion = require('./version-parser');
const parseRange = require('./range-parser');
const comparison = require('./comparison');
const cmp = comparison.cmp;
const compare = comparison.compare;
const rcompare = comparison.rcompare;

module.exports = {
  validRange,
  satisfies,
  maxSatisfying,
  minSatisfying,
  gtr: () => { throw new Error('Not implemented'); },
  ltr: () => { throw new Error('Not implemented'); },
  outside: () => { throw new Error('Not implemented'); },
};

function validRange(input) {
  let range = parseRange(input);
  return range.getAsText();
}

function satisfies(version, range) {
  let parsedVersion = parseVersion(version).getAsText();
  let parsedRange = parseRange(range);
  return isVersionInRange(parsedVersion, parsedRange);
}

const BOUND_MIN = 'BOUND_MIN';
const BOUND_MAX = 'BOUND_MAX';

function maxSatisfying(versions, range) {
  return satisfiesBound(versions, range, BOUND_MAX);
}

function minSatisfying(versions, range) {
  return satisfiesBound(versions, range, BOUND_MIN);
}

function satisfiesBound(versions, range, bound) {
  let comparator = bound === BOUND_MIN ? compare : rcompare;
  let sortedVersions = getSortedVersionsInRange(versions, range, comparator);
  return sortedVersions.length > 0 ? sortedVersions[0] : null;
}

function getSortedVersionsInRange(versions, range, comparator) {
  let result = [];
  let parsedRange = parseRange(range);
  for (let i = 0; i < versions.length; i++) {
    let version = parseVersion(versions[i]).getAsText();
    if (isVersionInRange(version, parsedRange)) {
      result.push(version);
    }
  }
  return result.sort(comparator);
}

function isVersionInRange(version, parsedRange) {
  let ranges = parsedRange.getComponents();
  for (let i = 0; i < ranges.length; i++) {
    if (testVersion(version, ranges[i])) {
      return true;
    }
  }
  return false;
}

function testVersion(version, range) {
  let minTest = true;
  let maxTest = true;
  if (range.minOperator) {
    minTest = cmp(version, range.minOperator, range.minOperand);
  }
  if (range.maxOperator) {
    maxTest = cmp(version, range.maxOperator, range.maxOperand);
  }
  return minTest && maxTest;
}
