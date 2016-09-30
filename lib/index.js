'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (options) {

  var manifest = {};
  //use assert to require filesPath, outputDir
  (0, _assert2.default)(options.files, 'files property is required');
  var filesPath = options.files;
  var outputDir = options.outputDir || __dirname;
  var outputDest = _path2.default.resolve(outputDir);
  var file = options.file;
  var hash = options.hash || false;
  var removeOriginals = options.removeOriginals || false;

  function writeManifest(manifest) {
    if (file) {
      _fsExtra2.default.ensureFileSync(_path2.default.resolve(file));
      _fsExtra2.default.writeFileSync(_path2.default.resolve(file), JSON.stringify(manifest), 'utf8');
    } else {
      _fsExtra2.default.writeFileSync(_path2.default.join(__dirname, 'assets.json'), JSON.stringify(manifest), 'utf8');
    }
  }

  var filesPathParts = filesPath.split(',');
  var files = [];
  filesPathParts.forEach(function (filePathPart) {
    files = files.concat(files, _glob2.default.sync(_path2.default.resolve(filePathPart), {}));
  });

  var baseDir = void 0;
  if (files && files.length === 1) {
    baseDir = files[0].split('/').slice(0, -1).join('/');
  } else {
    baseDir = (0, _commondir2.default)(files);
  }
  if (files && files.length) {
    files.forEach(function (file) {
      var parsedPath = _path2.default.parse(file);
      var filename = parsedPath.base;
      var dirParts = parsedPath.dir.split('/');
      var fileDir = '';
      if (baseDir !== parsedPath.dir) {
        fileDir = dirParts.pop();
      }
      var buffer = _fsExtra2.default.readFileSync(file);
      if (hash) {
        var _hash = (0, _revHash2.default)(buffer);
        var revdPath = (0, _revPath2.default)(_path2.default.join(fileDir, filename), _hash);
        manifest[_path2.default.join(fileDir, filename)] = revdPath;
        _fsExtra2.default.ensureFileSync(_path2.default.join(outputDest, revdPath));
        _fsExtra2.default.writeFileSync(_path2.default.join(outputDest, revdPath), buffer);
      } else {
        manifest[_path2.default.join(fileDir, filename)] = _path2.default.join(fileDir, filename);
        _fsExtra2.default.ensureFileSync(_path2.default.join(outputDest, _path2.default.join(fileDir, filename)));
        _fsExtra2.default.writeFileSync(_path2.default.join(outputDest, _path2.default.join(fileDir, filename)), buffer);
      }

      if (removeOriginals) {
        _fsExtra2.default.unlinkSync(file);
      }
    });

    writeManifest(manifest);
  } else {
    console.warn('No files found matching ' + _path2.default.resolve(filesPath));
    writeManifest({});
  }
};

var _revHash = require('rev-hash');

var _revHash2 = _interopRequireDefault(_revHash);

var _revPath = require('rev-path');

var _revPath2 = _interopRequireDefault(_revPath);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _commondir = require('commondir');

var _commondir2 = _interopRequireDefault(_commondir);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=index.js.map