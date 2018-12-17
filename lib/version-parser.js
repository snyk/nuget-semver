module.exports = parseVersion;

function parseVersion(input) {
  let semver = new DotnetSemver();
  if (!validateInput(input)) {
    semver.error = true;
    return semver;
  }

  input = input.toLowerCase();

  // find the first DASH or letter
  const firstDash = input.indexOf('-');
  const firstLetter = input.match(/[a-z]/);
  let qualifierStart;
  if (firstLetter !== null && firstLetter.index === 0) {
    semver.setVersion(input);
    return semver;
  }
  if (firstDash !== -1) {
    if (firstLetter !== null && firstLetter.index < firstDash) {
      qualifierStart = firstLetter.index;
    } else {
      qualifierStart = firstDash;
    }
  } else if (firstLetter !== null) {
    qualifierStart = firstLetter.index;
  } else {
    qualifierStart = input.length;
  }
  semver.setVersion(input.substring(0, qualifierStart));
  semver.setQualifier(input.substring(qualifierStart));

  return semver;
}

// GA & Final should be "trimmed" according to:
// https://maven.apache.org/pom.html#Version_Order_Specification
// > and we decide to treat "release" just as "ga" & "final"
const TRIMMED_QUALIFIERS = [
  'ga', 'final', 'release',
];

class DotnetSemver {
  // public methods
  getAsText() {
    return this.getVersionsAsText() + this.getQualifiersAsText();
  }

  getPrereleaseComponents() {
    if (this._qualifiers.length === 0) {
      return null;
    }

    if (String(this._qualifiers[0]).indexOf('sec') === 0) {
      return null;
    }

    return this._qualifiers;
  }

  getMajorVersion() {
    return parseInt(this._versions[0]) || 0;
  }

  getMinorVersion() {
    return parseInt(this._versions[1]) || 0;
  }

  getPatchVersion() {
    return parseInt(this._versions[2]) || 0;
  }

  getVersions() {
    return this._versions;
  }

  constructor() {
    this._versions = [];
    this._qualifiers = [];
  }

  setVersion(version) {
    let parts = version.replace(/\.$/, '').split('.');
    for (let i = 0; i < parts.length; i++) {
      let integer = parseInt(parts[i]);
      this._versions.push(isNaN(integer) ? parts[i] : integer);
    }
  }

  setQualifier(qualifier) {
    let dashSeparated = qualifier.split('-');
    for (let i = 0; i < dashSeparated.length; i++) {
      this.parseQualifier(dashSeparated[i]);
    }
  }

  parseQualifier(qualifier) {
    if (qualifier === '') {
      return;
    }

    let match = qualifier.match(/\d+/);
    if (match === null) {
      this.pushQualifier(qualifier);
    } else {
      this.addNextToken(qualifier, match.index === 0);
    }
  }

  addNextToken(qualifier, isInteger) {
    if (qualifier === '') {
      return;
    }
    if (qualifier.indexOf('.') !== -1) {
      this.pushQualifier(qualifier);
      return;
    }
    let match = isInteger ?
      qualifier.match(/\d+/) :
      qualifier.match(/\D+/);
    if (match === null) {
      return;
    }
    let element = qualifier.substring(0, match[0].length);
    this.pushQualifier(isInteger ? parseInt(element) : element);
    this.addNextToken(qualifier.substring(element.length), !isInteger);
  }

  pushQualifier(qualifier) {
    if (TRIMMED_QUALIFIERS.indexOf(qualifier) >= 0) {
      return;
    }

    this._qualifiers.push(qualifier);
  }

  getVersionsAsText() {
    let result = [];
    for (let i = 0; i < this._versions.length; i++) {
      result.push(this._versions[i]);
      result.push('.');
    }
    result.pop();
    return result.join('');
  }

  getQualifiersAsText() {
    let result = [];
    for (let i = 0; i < this._qualifiers.length; i++) {
      result.push('-');
      result.push(this._qualifiers[i]);
    }
    return result.join('');
  }
}

function validateInput(input) {
  if (typeof input === 'undefined' ||
    typeof input !== 'string' ||
    input === null ||
    input === '' ||
    input.match(/[^\w\.-]/) !== null) {
    return false;
  }
  // edge case: only dots and dashes
  let dotsAndDashes = input.match(/^(\W+)$/g);
  if (dotsAndDashes !== null && dotsAndDashes[0] === input) {
    return false;
  }
  return true;
}
