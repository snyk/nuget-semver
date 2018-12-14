const parseVersion = require('./version-parser');

module.exports = {
  valid,
  prerelease,
  major,
  minor,
  patch,
  inc: () => { throw new Error('Not implemented'); },
};

function valid(input) {
  return parseVersion(input).getAsText();
}

function prerelease(input) {
  return parseVersion(input).getPrereleaseComponents();
}

function major(input) {
  return parseVersion(input).getMajorVersion();
}

function minor(input) {
  return parseVersion(input).getMinorVersion();
}

function patch(input) {
  return parseVersion(input).getPatchVersion();
}
