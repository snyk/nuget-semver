const parseVersion = require('./version-parser');

module.exports = {
  gt,
  gte,
  lt,
  lte,
  eq,
  neq,
  cmp,
  compare,
  rcompare,
  diff,
};

function gt(v1, v2) {
  let semver1 = parseVersion(v1);
  let semver2 = parseVersion(v2);
  let versionCompare = compareVersions(semver1, semver2);
  if (versionCompare === 0 && compareQualifiers(semver1, semver2) === 1) {
    return true;
  }
  if (versionCompare === 1) {
    return true;
  }
  return false;
}

function gte(v1, v2) {
  let semver1 = parseVersion(v1);
  let semver2 = parseVersion(v2);
  let versionCompare = compareVersions(semver1, semver2);
  if (versionCompare === 0 && compareQualifiers(semver1, semver2) !== -1) {
    return true;
  }
  if (versionCompare === 1) {
    return true;
  }
  return false;
}

function lt(v1, v2) {
  let semver1 = parseVersion(v1);
  let semver2 = parseVersion(v2);
  let versionCompare = compareVersions(semver1, semver2);
  if (versionCompare === 0 && compareQualifiers(semver1, semver2) === -1) {
    return true;
  }
  if (versionCompare === -1) {
    return true;
  }
  return false;
}

function lte(v1, v2) {
  let semver1 = parseVersion(v1);
  let semver2 = parseVersion(v2);
  let versionCompare = compareVersions(semver1, semver2);
  if (versionCompare === 0 && compareQualifiers(semver1, semver2) !== 1) {
    return true;
  }
  if (versionCompare === -1) {
    return true;
  }
  return false;
}

function eq(v1, v2) {
  let semver1 = parseVersion(v1);
  let semver2 = parseVersion(v2);
  return (compareVersions(semver1, semver2) === 0 &&
    compareQualifiers(semver1, semver2) === 0);
}

function neq(v1, v2) {
  let semver1 = parseVersion(v1);
  let semver2 = parseVersion(v2);
  return (compareVersions(semver1, semver2) !== 0 ||
    compareQualifiers(semver1, semver2) !== 0);
}

function cmp(v1, comparator, v2) {
  switch (comparator) {
    case '>': {
      return gt(v1, v2);
    }
    case '>=': {
      return gte(v1, v2);
    }
    case '<': {
      return lt(v1, v2);
    }
    case '<=': {
      return lte(v1, v2);
    }
    case '==': {
      return eq(v1, v2);
    }
    case '!=': {
      return neq(v1, v2);
    }
    case '===': {
      return strictEq(v1, v2);
    }
    case '!==': {
      return !strictEq(v1, v2);
    }
    default: {
      throw new Error(`Invalid comparator: ${comparator}`);
    }
  }
}

function strictEq(v1, v2) {
  return parseVersion(v1).getAsText() === parseVersion(v2).getAsText();
}

function compare(v1, v2) {
  let semver1 = parseVersion(v1);
  let semver2 = parseVersion(v2);
  let versionCompare = compareVersions(semver1, semver2);
  if (versionCompare === 0) {
    return compareQualifiers(semver1, semver2);
  }
  return versionCompare;
}

function rcompare(v1, v2) {
  let semver1 = parseVersion(v1);
  let semver2 = parseVersion(v2);
  let versionCompare = compareVersions(semver2, semver1);
  if (versionCompare === 0) {
    return compareQualifiers(semver2, semver1);
  }
  return versionCompare;
}

function compareVersions(semver1, semver2) {
  let v1 = semver1.getVersions();
  let v2 = semver2.getVersions();
  let max = v1.length > v2.length ? v1.length : v2.length;
  for (let i = 0; i < max; i++) {
    // handle wildcard comparison. since for wildcard we always compare 2.*
    // with 2.3.4,for the * we should return * as if it matches the comparison
    if (v1[i] === '*' || v2[i] === '*') {
      return 0;
    }
    if ((v1[i] || 0) < (v2[i] || 0)) {
      return -1;
    }
    if ((v1[i] || 0) > (v2[i] || 0)) {
      return 1;
    }
  }
  return 0;
}

function compareQualifiers(semver1, semver2) {
  let q1 = semver1.getQualifiersAsText();
  let q2 = semver2.getQualifiersAsText();

  // remove the leading dash so "sec" will be bigger than all other qualifiers
  if (q1.indexOf('-sec') === 0) { q1 = q1.slice(1); }
  if (q2.indexOf('-sec') === 0) { q2 = q2.slice(1); }

  if (q1.length > 0 && q2.length === 0) {
    return q1.indexOf('sec') === 0 ? 1 : -1;
  }
  if (q2.length > 0 && q1.length === 0) {
    return q2.indexOf('sec') === 0 ? -1 : 1;
  }

  if (q1 > q2) {
    return 1;
  }
  if (q1 < q2) {
    return -1;
  }
  return 0;
}


function diff(version1, version2) {
  if (eq(version1, version2)) { return null; }

  const v1 = parseVersion(version1);
  const v2 = parseVersion(version2);

  const types = ['major', 'minor', 'patch'];
  const length = Math.max(v1._versions.length, v2._versions.length);

  if (v1._qualifiers.length || v2._qualifiers.length) {
    for (let i = 0; i < length; i++) {
      if (v1._versions[i] !== v2._versions[i]) {
        return 'pre' + (types[i] || 'patch');
      }
    }
    return 'prerelease';
  }
  for (let i = 0; i < length; i++) {
    if (v1._versions[i] !== v2._versions[i]) {
      return types[i] || 'patch';
    }
  }
  return null;
}
