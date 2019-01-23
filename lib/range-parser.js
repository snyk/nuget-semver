const parseVersion = require('./version-parser');

module.exports = parseRange;

const WHITESPACE_RE = /\s/g;
const BLACKLIST_RE = /[>=<]/g;
const EXCLUSIVE_SINGLE_RANGE_RE = /\(([^,]*)\)/;
const RANGE_CHECK_RE = /\(|\[|\)|\]/;
const BOUNDS_RE = /^(\(|\[)(\S{0,150})(\)|\])$/;
const OPENERS_RE = /[\(\[]/g;
const CLOSERS_RE = /[\)\]]/g;
const STRING_RE = /[A-Za-z]/;
const WILDCARD_RANGE = /\*/;

function parseRange(input) {
  input = normalizeRangeString(input);
  let components = getComponentsAsStrings(input);
  if (components.length === 0) {
    // no legal components found - this is not a valid range
    return new DotnetVersionRange();
  }
  return new DotnetVersionRange(input, components);
}

function normalizeRangeString(input) {
  // make sure it's a string
  if (typeof input !== 'string') {
    return '';
  }
  // NuGet doesn't support more ranges
  const commas = input.match(/(,)/g);
  if (commas && commas.length > 2) {
    return '';
  }
  // remove all white-spaces
  input = input.replace(WHITESPACE_RE,'');
  // sanity (no npm-style stuffs)
  if (input.match(BLACKLIST_RE) !== null) {
    return '';
  }
  // (1.0) is invalid
  if (input.match(EXCLUSIVE_SINGLE_RANGE_RE) !== null) {
    return '';
  }
  // strings are only allowed with - prefix
  const stringStart = input.search(STRING_RE);
  const stringPrefix = stringStart - 1;
  if (stringStart > -1 && input[stringPrefix] !== '-') {
    return '';
  }

  // for the wildcard range make it a single version range
  if (input.match(WILDCARD_RANGE) !== null) {
    input = '[' + input + ')';
  } else if (input.match(RANGE_CHECK_RE) === null) {
    // ensure range
    input = '[' + input + ',)';
  }
  // starts with opener and ends with closer
  if (input.match(BOUNDS_RE) === null) {
    return '';
  }
  // validate range (simple)
  const openers = (input.match(OPENERS_RE) || []).length;
  const closers = (input.match(CLOSERS_RE) || []).length;
  if (openers !== closers) {
    return '';
  }

  return input;
}

class DotnetVersionRange {
  constructor(range, components) {
    this._rangeAsText = range || '';
    this._components = [];
    components = components || [];
    for (let i = 0; i < components.length; i++) {
      this.addComponent(processComponent(components[i]));
    }
  }

  addComponent(component) {
    this._components.push(component);
  }

  getComponents() {
    return this._components;
  }

  getAsText() {
    return this._rangeAsText === '' ? null : this._rangeAsText;
  }
}

function getComponentsAsStrings(input) {
  let componentStrings = [];
  while (true) {
    let compMarker = getNextComponent(input);
    if (compMarker) {
      componentStrings.push(
        input.substring(compMarker.startIndex, compMarker.endIndex + 1));
      input = input.substring(compMarker.endIndex + 1);
    } else {
      break;
    }
  }
  return componentStrings;
}

// return the next component's string
function getNextComponent(input) {
  let openingBrace = getNextOpeningBraceIndex(input);
  if (openingBrace === -1) {
    return false;
  }
  let closingBrace = getNextClosingBraceIndex(input);
  if (closingBrace === -1) {
    return false;
  }
  return {
    startIndex: openingBrace,
    endIndex: closingBrace,
  };
}

// find the index of the next opening brace - either '(' or '['
// return -1 if none is found
function getNextOpeningBraceIndex(input) {
  let match = input.match(/\(|\[/);
  return match === null ? -1 : match.index;
}

// find the index of the next closing brace - either ')' or ']'
// return -1 if none is found
function getNextClosingBraceIndex(input) {
  let match = input.match(/\]|\)/);
  return match === null ? -1 : match.index;
}

function processComponent(input) {
  let component = {};
  let minBound = input[0];
  let maxBound = input[input.length - 1];
  let version = getVersions(input.substring(1, input.length - 1));
  if (version.singleVersion) {
    if (minBound === '[' && maxBound === ']') {
      component.minOperator = '==';
      component.minOperand = version.singleVersion.getAsText();
    }
  } else if (version.wildcardVersion) {
    component.minOperator = '<=';
    component.minOperand = version.wildcardVersion.getAsText();
  } else {
    if (version.minVersion) {
      component.minOperator = (minBound === '(' ? '>' : '>=');
      component.minOperand = version.minVersion.getAsText();
    }
    if (version.maxVersion) {
      component.maxOperator = (maxBound === ')' ? '<' : '<=');
      component.maxOperand = version.maxVersion.getAsText();
    }
  }
  return component;
}

function getVersions(input) {
  let commaIndex = input.indexOf(',');
  if (commaIndex === -1) {
    if (input.match(WILDCARD_RANGE)) {
      return {wildcardVersion: parseVersion(input)};
    }
    return {singleVersion: parseVersion(input)};
  }
  let result = {};
  if (commaIndex >= 1) {
    result.minVersion = parseVersion(
      input.substring(0, commaIndex));
  }
  if (commaIndex <= input.length - 2) {
    result.maxVersion = parseVersion(
      input.substring(commaIndex + 1, input.length));
  }
  return result;
}
