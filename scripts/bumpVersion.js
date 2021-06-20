const fs = require('fs');
const commandLineArgs = require('command-line-args');
const semver = require('semver');
const { version } = require('process');

// provide all package.json files that must be updated by the script
let packagesJson = [
  { location: '../package.json', data: '', version: '' },
  // { location: '../src/package.json', data: '', version: '' },
];

// update buildnumber of the project every time the script runs
packagesJson = packagesJson
  .map((pj) => ({ ...pj, data: require(pj.location) }))
  .map((pj) => {
    return {
      ...pj,
      version:
        pj.data.version.split('-').length > 1 ? pj.data.version.split('-').slice(0, -1).join('-') : pj.data.version,
      buildNumber: pj.data.buildNumber ? parseInt(pj.data.buildNumber, 10) + 1 : 1,
    };
  });
// console.info(packagesJson);

// define bumping methods
const bumpRelease = (version, target) => semver.inc(version, target);
const bumpPreRelease = (version, target, beta) => semver.inc(version, target, beta ? 'beta' : 'alpha');

// read the parameters provided
const options = commandLineArgs([
  { name: 'major', alias: 'M', type: Boolean, defaultValue: false },
  { name: 'minor', alias: 'm', type: Boolean, defaultValue: false },
  { name: 'patch', alias: 'p', type: Boolean, defaultValue: false },
  { name: 'alpha', alias: 'a', type: Boolean, defaultValue: false },
  { name: 'beta', alias: 'b', type: Boolean, defaultValue: false },
  { name: 'build', alias: 'B', type: Boolean, defaultValue: false },
  { name: 'toRelease', alias: 'r', type: Boolean, defaultValue: false },
]);
const { major, minor, patch, alpha, beta, build, toRelease } = options;

// if the version must be beumped to remove the pre-release tag to make it an actual release
if (toRelease) {
  packagesJson = packagesJson.map((pj) => ({ ...pj, version: pj.version.split('-')[0] }));
} else {
  // if the build number must be bumped, skip all other possibilities
  if (!build) {
    // bumpers for pre-releases
    if (beta || alpha) {
      packagesJson = packagesJson.map((pj) => ({
        ...pj,
        version: bumpPreRelease(
          pj.version,
          major ? 'premajor' : minor ? 'preminor' : patch ? 'prepatch' : 'prerelease',
          beta
        ),
      }));
    }
    // bumpers for releases
    else if (major || minor || patch) {
      packagesJson = packagesJson.map((pj) => ({
        ...pj,
        version: bumpRelease(pj.version, major ? 'major' : minor ? 'minor' : 'patch'),
      }));
    }
    // default bumpers if no arguments are provided
    else {
      packagesJson = packagesJson.map((pj) => ({
        ...pj,
        version: pj.version.includes('-')
          ? bumpPreRelease(pj.version, 'prerelease', pj.version.includes('beta'))
          : bumpRelease(pj.version, 'patch'),
      }));
    }

    // if the new version is a pre-release, check if the pre-release version is 0
    // if so, ++ as version 0 is not possible
    packagesJson = packagesJson.map((pj) => ({
      ...pj,
      version: pj.version.includes('-')
        ? pj.version.endsWith('.0')
          ? `${pj.version.slice(0, pj.version.length - 1)}1`
          : pj.version
        : pj.version,
    }));
  }
}

// write results back to the files
packagesJson.map((pj) =>
  fs.writeFileSync(
    pj.location.slice(1),
    JSON.stringify({ ...pj.data, version: `${pj.version}-${pj.buildNumber}`, buildNumber: pj.buildNumber }, null, 2),
    {
      encoding: 'utf8',
      flag: 'w',
    }
  )
);
