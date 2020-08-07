/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"intents": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// script path function
/******/ 	function jsonpScriptSrc(chunkId) {
/******/ 		return __webpack_require__.p + "" + ({}[chunkId]||chunkId) + "/drive.js"
/******/ 	}
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/ 	// The chunk loading function for additional chunks
/******/ 	// Since all referenced chunks are already included
/******/ 	// in this file, this function is empty here.
/******/ 	__webpack_require__.e = function requireEnsure() {
/******/ 		return Promise.resolve();
/******/ 	};
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// on error function for async loading
/******/ 	__webpack_require__.oe = function(err) { console.error(err); throw err; };
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push([0,"vendors"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "/WUI":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("lwsE");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("W8MJ");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("7W2i");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("a1gu");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("Nsbk");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var cozy_doctypes__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("Le8U");
/* harmony import */ var cozy_doctypes__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(cozy_doctypes__WEBPACK_IMPORTED_MODULE_5__);






function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4___default()(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4___default()(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3___default()(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }



var Contact = /*#__PURE__*/function (_DoctypeContact) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_2___default()(Contact, _DoctypeContact);

  var _super = _createSuper(Contact);

  function Contact() {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, Contact);

    return _super.apply(this, arguments);
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(Contact, null, [{
    key: "getInitials",
    value: function getInitials(contactOrRecipient) {
      var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

      if (Contact.isContact(contactOrRecipient)) {
        return cozy_doctypes__WEBPACK_IMPORTED_MODULE_5__["Contact"].getInitials(contactOrRecipient);
      } else {
        var s = contactOrRecipient.public_name || contactOrRecipient.name || contactOrRecipient.email;
        return s && s[0].toUpperCase() || defaultValue;
      }
    }
  }, {
    key: "getDisplayName",
    value: function getDisplayName(contact) {
      var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

      if (Contact.isContact(contact)) {
        return cozy_doctypes__WEBPACK_IMPORTED_MODULE_5__["Contact"].getDisplayName(contact);
      } else {
        return contact.public_name || contact.name || contact.email || defaultValue;
      }
    }
  }]);

  return Contact;
}(cozy_doctypes__WEBPACK_IMPORTED_MODULE_5__["Contact"]);

/* harmony default export */ __webpack_exports__["default"] = (Contact);

/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("201c");
__webpack_require__("7NIr");
module.exports = __webpack_require__("YsA6");


/***/ }),

/***/ "0GJX":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var svg_baker_runtime_browser_symbol__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("4BeY");
/* harmony import */ var svg_baker_runtime_browser_symbol__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(svg_baker_runtime_browser_symbol__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var svg_sprite_loader_runtime_browser_sprite_build__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("IaFt");
/* harmony import */ var svg_sprite_loader_runtime_browser_sprite_build__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(svg_sprite_loader_runtime_browser_sprite_build__WEBPACK_IMPORTED_MODULE_1__);


var symbol = new svg_baker_runtime_browser_symbol__WEBPACK_IMPORTED_MODULE_0___default.a({
  "id": "icon-type-sheet_8dd87cb4c33c98d3014c32cd9c675e90",
  "use": "icon-type-sheet_8dd87cb4c33c98d3014c32cd9c675e90-usage",
  "viewBox": "0 0 32 32",
  "content": "<symbol xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\" id=\"icon-type-sheet_8dd87cb4c33c98d3014c32cd9c675e90\">\n  <g fill=\"none\" fill-rule=\"evenodd\" transform=\"translate(3)\">\n    <path fill=\"#9FE6A2\" d=\"M0,2.00174332 C0,0.89621101 0.890925393,0 1.99742191,0 L19,0 L26,7 L26,29.9964051 C26,31.10296 25.1050211,32 24.0029953,32 L1.99700466,32 C0.89408944,32 0,31.1107383 0,29.9982567 L0,2.00174332 Z\" />\n    <path fill=\"#0FC016\" d=\"M18.5.57092175e-14C18.2238576.33045111e-13 18 .230796814 18 .500435829L18 8 25.4995642 8C25.7759472 8 26 7.76806641 26 7.5L26 7 19 0 18.5.57092175e-14zM5 9L9 9 9 11 5 11 5 9zM5 5L9 5 9 7 5 7 5 5zM5 13L9 13 9 15 5 15 5 13zM5 17L9 17 9 19 5 19 5 17zM5 21L9 21 9 23 5 23 5 21zM5 25L9 25 9 27 5 27 5 25zM11 9L15 9 15 11 11 11 11 9zM11 5L15 5 15 7 11 7 11 5zM11 13L15 13 15 15 11 15 11 13zM11 17L15 17 15 19 11 19 11 17zM11 21L15 21 15 23 11 23 11 21zM11 25L15 25 15 27 11 27 11 25zM17 13L21 13 21 15 17 15 17 13zM17 17L21 17 21 19 17 19 17 17zM17 21L21 21 21 23 17 23 17 21zM17 25L21 25 21 27 17 27 17 25z\" />\n  </g>\n</symbol>"
});
var result = svg_sprite_loader_runtime_browser_sprite_build__WEBPACK_IMPORTED_MODULE_1___default.a.add(symbol);
/* harmony default export */ __webpack_exports__["default"] = (symbol);

/***/ }),

/***/ 1:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ "1aVK":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getRootPath", function() { return getRootPath; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getTemporaryRootPath", function() { return getTemporaryRootPath; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getCozyPath", function() { return getCozyPath; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getEntry", function() { return getEntry; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getCozyEntry", function() { return getCozyEntry; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createCozyPath", function() { return createCozyPath; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getDirectory", function() { return getDirectory; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "writeFile", function() { return writeFile; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "openFileWithCordova", function() { return openFileWithCordova; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "deleteOfflineFile", function() { return deleteOfflineFile; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "saveFileWithCordova", function() { return saveFileWithCordova; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "temporarySave", function() { return temporarySave; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "saveAndOpenWithCordova", function() { return saveAndOpenWithCordova; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getNativeFile", function() { return getNativeFile; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "openOfflineFile", function() { return openOfflineFile; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createTemporaryLocalFile", function() { return createTemporaryLocalFile; });
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("o0o1");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("yXPU");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var cozy_device_helper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("snfs");
/* harmony import */ var cozy_device_helper__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(cozy_device_helper__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var lib_logger__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("OTOu");
/* harmony import */ var cozy_device_helper_dist_platform__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("923M");
/* harmony import */ var cozy_device_helper_dist_platform__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(cozy_device_helper_dist_platform__WEBPACK_IMPORTED_MODULE_4__);





var ERROR_GET_DIRECTORY = 'Error to get directory';
var ERROR_WRITE_FILE = 'Error to write file';
var ERROR_GET_FILE = 'Error to get file';
var COZY_PATH = 'Cozy';
var COZY_FILES_PATH = Object(cozy_device_helper_dist_platform__WEBPACK_IMPORTED_MODULE_4__["isIOS"])() ? 'CozyDrive' : 'Cozy Drive';
var getRootPath = function getRootPath() {
  return Object(cozy_device_helper__WEBPACK_IMPORTED_MODULE_2__["isAndroidApp"])() ? window.cordova.file.externalRootDirectory : window.cordova.file.dataDirectory;
};
var getTemporaryRootPath = function getTemporaryRootPath() {
  return Object(cozy_device_helper__WEBPACK_IMPORTED_MODULE_2__["isAndroidApp"])() ? window.cordova.file.externalCacheDirectory : window.cordova.file.cacheDirectory;
};
var getCozyPath = function getCozyPath() {
  return COZY_PATH + '/' + COZY_FILES_PATH + '/';
};
var getEntry = function getEntry(path) {
  return new Promise(function (resolve, reject) {
    window.resolveLocalFileSystemURL(path, resolve, function (err) {
      lib_logger__WEBPACK_IMPORTED_MODULE_3__["default"].error("".concat(path, " could not be resolved: ").concat(err.message));
      reject(err);
    });
  });
};
var getCozyEntry = function getCozyEntry() {
  return getEntry(getRootPath() + getCozyPath()).catch(function () {
    return createCozyPath();
  });
};
var createCozyPath = function createCozyPath() {
  return getEntry(getRootPath()).then(function (entry) {
    return getDirectory(entry, COZY_PATH).then(function (entry) {
      return getDirectory(entry, COZY_FILES_PATH);
    });
  });
};
var getDirectory = function getDirectory(rootDirEntry, folderName) {
  return new Promise(function (resolve, reject) {
    rootDirEntry.getDirectory(folderName, {
      create: true
    }, resolve, function (error) {
      lib_logger__WEBPACK_IMPORTED_MODULE_3__["default"].warn(ERROR_GET_DIRECTORY, folderName);
      lib_logger__WEBPACK_IMPORTED_MODULE_3__["default"].warn(error);
      reject(ERROR_GET_DIRECTORY);
    });
  });
};
var writeFile = function writeFile(fileEntry, dataObj) {
  return new Promise(function (resolve, reject) {
    fileEntry.createWriter(function (fileWriter) {
      fileWriter.onwriteend = function () {
        resolve(fileEntry);
      };

      fileWriter.onerror = function (error) {
        lib_logger__WEBPACK_IMPORTED_MODULE_3__["default"].warn(ERROR_WRITE_FILE);
        lib_logger__WEBPACK_IMPORTED_MODULE_3__["default"].warn(error);
        reject(ERROR_WRITE_FILE);
      };

      fileWriter.write(dataObj);
    });
  });
};

var saveFile = function saveFile(dirEntry, fileData, fileName) {
  return new Promise(function (resolve, reject) {
    dirEntry.getFile(fileName, {
      create: true,
      exclusive: false
    }, function (fileEntry) {
      writeFile(fileEntry, fileData).then(function () {
        resolve(fileEntry);
      }).catch(reject);
    }, function (error) {
      lib_logger__WEBPACK_IMPORTED_MODULE_3__["default"].warn(ERROR_GET_FILE);
      lib_logger__WEBPACK_IMPORTED_MODULE_3__["default"].warn(error);
      reject(ERROR_GET_FILE);
    });
  });
};

var openFileWithCordova = function openFileWithCordova(URI, mimetype) {
  return new Promise(function (resolve, reject) {
    var callbacks = {
      error: reject,
      success: resolve
    };
    window.cordova.plugins.fileOpener2.open(URI, mimetype, callbacks);
  });
};
var deleteOfflineFile = /*#__PURE__*/function () {
  var _ref = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(filename) {
    var entry, fileEntry;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return getCozyEntry();

          case 2:
            entry = _context.sent;
            _context.next = 5;
            return getEntry("".concat(entry.nativeURL).concat(filename));

          case 5:
            fileEntry = _context.sent;
            return _context.abrupt("return", fileEntry.remove());

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function deleteOfflineFile(_x) {
    return _ref.apply(this, arguments);
  };
}();
var saveFileWithCordova = function saveFileWithCordova(fileData, fileName) {
  return getCozyEntry().then(function (entry) {
    return saveFile(entry, fileData, fileName);
  });
};
var temporarySave = function temporarySave(file, filename) {
  return getEntry(getTemporaryRootPath()).then(function (entry) {
    return saveFile(entry, file, filename);
  });
};
/**
 *
 * @param {Blob} blob Binary of the file
 * @param {Object} file io.cozy.files object
 */

var saveAndOpenWithCordova = function saveAndOpenWithCordova(blob, file) {
  return temporarySave(blob, file.name).then(function (entry) {
    return openFileWithCordova(entry.nativeURL, file.mime);
  });
};
var getNativeFile = /*#__PURE__*/function () {
  var _ref2 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee2(file) {
    var entry;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return getCozyEntry();

          case 2:
            entry = _context2.sent;
            return _context2.abrupt("return", getEntry("".concat(entry.nativeURL).concat(file.id)));

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function getNativeFile(_x2) {
    return _ref2.apply(this, arguments);
  };
}();
var openOfflineFile = /*#__PURE__*/function () {
  var _ref3 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee3(file) {
    var fileEntry;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return getNativeFile(file);

          case 2:
            fileEntry = _context3.sent;
            return _context3.abrupt("return", openFileWithCordova(fileEntry.nativeURL, file.mime));

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function openOfflineFile(_x3) {
    return _ref3.apply(this, arguments);
  };
}();
var createTemporaryLocalFile = /*#__PURE__*/function () {
  var _ref4 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee4(client, file) {
    var response, blob, localFile;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return client.collection('io.cozy.files').fetchFileContent(file);

          case 2:
            response = _context4.sent;
            _context4.next = 5;
            return response.blob();

          case 5:
            blob = _context4.sent;
            _context4.next = 8;
            return temporarySave(blob, file.name);

          case 8:
            localFile = _context4.sent;
            return _context4.abrupt("return", localFile);

          case 10:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function createTemporaryLocalFile(_x4, _x5) {
    return _ref4.apply(this, arguments);
  };
}();

/***/ }),

/***/ 2:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ "2Ekz":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "showModal", function() { return showModal; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ModalManager", function() { return ModalManager; });
/* harmony import */ var _babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("MVZn");
/* harmony import */ var _babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("/MKj");



var SHOW_MODAL = 'SHOW_MODAL';
var HIDE_MODAL = 'HIDE_MODAL';

var reducer = function reducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
    show: false,
    component: null
  };
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case SHOW_MODAL:
      return {
        show: true,
        component: action.component
      };

    case HIDE_MODAL:
      return {
        show: false,
        component: null
      };

    default:
      return state;
  }
};

/* harmony default export */ __webpack_exports__["default"] = (reducer);
var showModal = function showModal(component) {
  return {
    type: SHOW_MODAL,
    component: component,
    meta: {
      hideActionMenu: true
    }
  };
};

var hideModal = function hideModal() {
  var meta = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return {
    type: HIDE_MODAL,
    meta: meta
  };
};

var ModalManager = Object(react_redux__WEBPACK_IMPORTED_MODULE_2__["connect"])(function (state) {
  return _babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_0___default()({}, state.ui.modal);
})(function (_ref) {
  var show = _ref.show,
      component = _ref.component,
      dispatch = _ref.dispatch;
  if (!show) return null;
  return react__WEBPACK_IMPORTED_MODULE_1___default.a.cloneElement(component, {
    onClose: function onClose(meta) {
      return dispatch(hideModal(meta));
    }
  });
});

/***/ }),

/***/ "2eL0":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("o0o1");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("yXPU");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("lwsE");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("W8MJ");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("7W2i");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("a1gu");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("Nsbk");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var cozy_ui_transpiled_react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("H+Xc");
/* harmony import */ var drive_web_modules_viewer_FileOpenerExternal__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("udIP");








function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6___default()(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6___default()(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_5___default()(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }






var Embeder = /*#__PURE__*/function (_React$Component) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4___default()(Embeder, _React$Component);

  var _super = _createSuper(Embeder);

  function Embeder(props) {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2___default()(this, Embeder);

    _this = _super.call(this, props);
    _this.state = {
      loading: true
    };
    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3___default()(Embeder, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.fetchFileUrl();
    }
  }, {
    key: "fetchFileUrl",
    value: function () {
      var _fetchFileUrl = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee() {
        var service, _service$getData, id;

        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                service = this.props.service;

                try {
                  _service$getData = service.getData(), id = _service$getData.id;
                  this.setState({
                    fileId: id,
                    loading: false
                  });
                } catch (error) {
                  this.setState({
                    error: error,
                    loading: false
                  });
                }

              case 2:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function fetchFileUrl() {
        return _fetchFileUrl.apply(this, arguments);
      }

      return fetchFileUrl;
    }()
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(cozy_ui_transpiled_react__WEBPACK_IMPORTED_MODULE_8__["IntentHeader"], {
        appName: "Drive",
        appEditor: "Cozy"
      }), this.state.loading && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(cozy_ui_transpiled_react__WEBPACK_IMPORTED_MODULE_8__["Spinner"], {
        size: "xxlarge",
        loadingType: "message",
        middle: true
      }), this.state.error && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("pre", {
        className: "u-error"
      }, this.state.error.toString()), this.state.fileId && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(drive_web_modules_viewer_FileOpenerExternal__WEBPACK_IMPORTED_MODULE_9__["default"], {
        fileId: this.state.fileId,
        withCloseButtton: false
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(cozy_ui_transpiled_react__WEBPACK_IMPORTED_MODULE_8__["IconSprite"], null));
    }
  }]);

  return Embeder;
}(react__WEBPACK_IMPORTED_MODULE_7___default.a.Component);

/* harmony default export */ __webpack_exports__["default"] = (Embeder);

/***/ }),

/***/ "2ogT":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_IntentHandler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("9xIA");

/* harmony default export */ __webpack_exports__["default"] = (_components_IntentHandler__WEBPACK_IMPORTED_MODULE_0__["default"]);

/***/ }),

/***/ 3:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ "3nSB":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var svg_baker_runtime_browser_symbol__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("4BeY");
/* harmony import */ var svg_baker_runtime_browser_symbol__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(svg_baker_runtime_browser_symbol__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var svg_sprite_loader_runtime_browser_sprite_build__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("IaFt");
/* harmony import */ var svg_sprite_loader_runtime_browser_sprite_build__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(svg_sprite_loader_runtime_browser_sprite_build__WEBPACK_IMPORTED_MODULE_1__);


var symbol = new svg_baker_runtime_browser_symbol__WEBPACK_IMPORTED_MODULE_0___default.a({
  "id": "icon-type-note_66b67c1293c24a2bdf42260d7e0388b7",
  "use": "icon-type-note_66b67c1293c24a2bdf42260d7e0388b7-usage",
  "viewBox": "0 0 32 32",
  "content": "<symbol xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\" id=\"icon-type-note_66b67c1293c24a2bdf42260d7e0388b7\"><path d=\"M2 2a2 2 0 0 1 2-2h22a2 2 0 0 1 2 2v28a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z\" fill=\"#acf5f7\" fill-rule=\"evenodd\" /><path d=\"M8 8h14v2H8zm0 4h8v2H8zm0 4h14v2H8zm0 4h10v2H8zM1.5 4h2A1.54 1.54 0 0 1 5 5.5 1.54 1.54 0 0 1 3.5 7h-2A1.54 1.54 0 0 1 0 5.5 1.54 1.54 0 0 1 1.5 4zM1.5 11h2A1.54 1.54 0 0 1 5 12.5 1.54 1.54 0 0 1 3.5 14h-2A1.54 1.54 0 0 1 0 12.5 1.54 1.54 0 0 1 1.5 11zM1.5 18h2A1.54 1.54 0 0 1 5 19.5 1.54 1.54 0 0 1 3.5 21h-2A1.54 1.54 0 0 1 0 19.5 1.54 1.54 0 0 1 1.5 18zM1.5 25h2A1.54 1.54 0 0 1 5 26.5 1.54 1.54 0 0 1 3.5 28h-2A1.54 1.54 0 0 1 0 26.5 1.54 1.54 0 0 1 1.5 25zM31.4 18.4l-2.8-2.8a2 2 0 0 1 2.8 2.8zM30.7 19.1L20.8 29l-2.5.9a1 1 0 0 1-1.3-.6.85.85 0 0 1 0-.7l.9-2.5 9.9-9.9z\" fill=\"#0dcbcf\" fill-rule=\"evenodd\" /></symbol>"
});
var result = svg_sprite_loader_runtime_browser_sprite_build__WEBPACK_IMPORTED_MODULE_1___default.a.add(symbol);
/* harmony default export */ __webpack_exports__["default"] = (symbol);

/***/ }),

/***/ 4:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ "5lZ0":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var svg_baker_runtime_browser_symbol__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("4BeY");
/* harmony import */ var svg_baker_runtime_browser_symbol__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(svg_baker_runtime_browser_symbol__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var svg_sprite_loader_runtime_browser_sprite_build__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("IaFt");
/* harmony import */ var svg_sprite_loader_runtime_browser_sprite_build__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(svg_sprite_loader_runtime_browser_sprite_build__WEBPACK_IMPORTED_MODULE_1__);


var symbol = new svg_baker_runtime_browser_symbol__WEBPACK_IMPORTED_MODULE_0___default.a({
  "id": "icon-type-code_998ba31b1b8dfd6f00ade2438c217d5a",
  "use": "icon-type-code_998ba31b1b8dfd6f00ade2438c217d5a-usage",
  "viewBox": "0 0 32 32",
  "content": "<symbol xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\" id=\"icon-type-code_998ba31b1b8dfd6f00ade2438c217d5a\">\n  <g fill=\"none\" fill-rule=\"evenodd\" transform=\"translate(3)\">\n    <path fill=\"#E6D5FF\" d=\"M0,2.00174332 C0,0.89621101 0.890925393,0 1.99742191,0 L19,0 L26,7 L26,29.9964051 C26,31.10296 25.1050211,32 24.0029953,32 L1.99700466,32 C0.89408944,32 0,31.1107383 0,29.9982567 L0,2.00174332 Z\" />\n    <path fill=\"#9C59FF\" d=\"M18.5,8.57092175e-14 C18.2238576,1.33045111e-13 18,0.230796814 18,0.500435829 L18,8 L25.4995642,8 C25.7759472,8 26,7.76806641 26,7.5 L26,7 L19,0 L18.5,8.57092175e-14 Z\" />\n    <g stroke=\"#9C59FF\" stroke-width=\"2\" transform=\"translate(5 11)\">\n      <polyline points=\"4 11 0 7 4 3\" stroke-linejoin=\"round\" />\n      <polyline points=\"16 11 12 7 16 3\" stroke-linejoin=\"round\" transform=\"matrix(-1 0 0 1 28 0)\" />\n      <path d=\"M6,14 L10,0\" />\n    </g>\n  </g>\n</symbol>"
});
var result = svg_sprite_loader_runtime_browser_sprite_build__WEBPACK_IMPORTED_MODULE_1___default.a.add(symbol);
/* harmony default export */ __webpack_exports__["default"] = (symbol);

/***/ }),

/***/ "6dOw":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),

/***/ "8IyR":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
module.exports = {"u-visuallyhidden":"u-visuallyhidden--3FX6x","u-hide":"u-hide--3mtaG","u-hide--mob":"u-hide--mob--3kmpm","u-hide--tablet":"u-hide--tablet--it1ws","u-hide--desk":"u-hide--desk--3Q41O","u-dn":"u-dn--yykwu","u-di":"u-di--2TTN0","u-db":"u-db--1mdvJ","u-dib":"u-dib--8uxgX","u-dit":"u-dit--1LNm_","u-dt":"u-dt--lceRG","u-dtc":"u-dtc--Sa8U4","u-dt-row":"u-dt-row--2PRFY","u-dt-row-group":"u-dt-row-group--2NpwX","u-dt-column":"u-dt-column--1OS0a","u-dt-column-group":"u-dt-column-group--3THd0","u-dn-t":"u-dn-t--ppOHr","u-di-t":"u-di-t--De5tT","u-db-t":"u-db-t--3vcWe","u-dib-t":"u-dib-t--3Wk2I","u-dit-t":"u-dit-t--33MBp","u-dt-t":"u-dt-t--3wm8x","u-dtc-t":"u-dtc-t--2SaSj","u-dt-row-t":"u-dt-row-t--3nYHS","u-dt-row-group-t":"u-dt-row-group-t--3HF5g","u-dt-column-t":"u-dt-column-t--1yp44","u-dt-column-group-t":"u-dt-column-group-t--33wl4","u-dn-s":"u-dn-s--JKICl","u-di-s":"u-di-s--1TbVH","u-db-s":"u-db-s--3O1lF","u-dib-s":"u-dib-s--1xu5Z","u-dit-s":"u-dit-s--3XRiB","u-dt-s":"u-dt-s--8ju-3","u-dtc-s":"u-dtc-s--8LiK_","u-dt-row-s":"u-dt-row-s--399p5","u-dt-row-group-s":"u-dt-row-group-s--2CNMD","u-dt-column-s":"u-dt-column-s--3LFG6","u-dt-column-group-s":"u-dt-column-group-s--3q85y","u-dn-m":"u-dn-m--3UWJk","u-di-m":"u-di-m--22PJf","u-db-m":"u-db-m--1wi0g","u-dib-m":"u-dib-m--2yuQi","u-dit-m":"u-dit-m--3cu6X","u-dt-m":"u-dt-m--GCbde","u-dtc-m":"u-dtc-m--2QsFk","u-dt-row-m":"u-dt-row-m--3UAYx","u-dt-row-group-m":"u-dt-row-group-m--1ryRS","u-dt-column-m":"u-dt-column-m--2gVAX","u-dt-column-group-m":"u-dt-column-group-m--Jb0Zt","u-error":"u-error--2tZHf","u-valid":"u-valid--5F7BJ","u-warn":"u-warn--2-cvq","u-black":"u-black--20iIC","u-white":"u-white--2hPof","u-paleGrey":"u-paleGrey--2iADC","u-silver":"u-silver--1UhNT","u-coolGrey":"u-coolGrey--2KB2H","u-slateGrey":"u-slateGrey--36izp","u-charcoalGrey":"u-charcoalGrey--2ywEx","u-overlay":"u-overlay--2eZxG","u-zircon":"u-zircon--9tnOf","u-frenchPass":"u-frenchPass--3gAXQ","u-dodgerBlue":"u-dodgerBlue--1FdZQ","u-scienceBlue":"u-scienceBlue--fJKij","u-puertoRico":"u-puertoRico--qhyrw","u-grannyApple":"u-grannyApple--3DUPE","u-emerald":"u-emerald--tm1Kv","u-malachite":"u-malachite--2f12f","u-seafoamGreen":"u-seafoamGreen--Tj6ns","u-brightSun":"u-brightSun--2HqxD","u-texasRose":"u-texasRose--BYoUz","u-chablis":"u-chablis--nfe-h","u-yourPink":"u-yourPink--1s6Ds","u-fuchsia":"u-fuchsia--D_lao","u-pomegranate":"u-pomegranate--1PJtm","u-monza":"u-monza--2xQ__","u-portage":"u-portage--1K5ft","u-azure":"u-azure--2wLms","u-melon":"u-melon--TplSx","u-blazeOrange":"u-blazeOrange--1eBrf","u-mango":"u-mango--3jGwL","u-pumpkinOrange":"u-pumpkinOrange--3e8ln","u-lavender":"u-lavender--3MlWO","u-darkPeriwinkle":"u-darkPeriwinkle--3OLIz","u-purpley":"u-purpley--2lH-B","u-lightishPurple":"u-lightishPurple--16y_F","u-barney":"u-barney--2F4aC","u-weirdGreen":"u-weirdGreen--3wj6h","u-primaryColor":"u-primaryColor--35V12","u-primaryColorLight":"u-primaryColorLight--1PJZn","u-primaryContrastTextColor":"u-primaryContrastTextColor--_cBQI","u-breakword":"u-breakword--1dSPn","u-ellipsis":"u-ellipsis--3K9KZ","u-midellipsis":"u-midellipsis--nnaGL","u-link":"u-link--1exGi","u-lh-tiny":"u-lh-tiny--2W_JG","u-lh-xsmall":"u-lh-xsmall--25ICU","u-lh-small":"u-lh-small--2XodP","u-lh-medium":"u-lh-medium--i338e","u-lh-large":"u-lh-large--iVt9k","u-lh-xlarge":"u-lh-xlarge--34JQd","u-fz-tiny":"u-fz-tiny--1OB-f","u-fz-xsmall":"u-fz-xsmall--1nB_w","u-fz-small":"u-fz-small--15YLO","u-fz-medium":"u-fz-medium--1yhWq","u-fz-large":"u-fz-large--33rAQ","u-fz-tiny-t":"u-fz-tiny-t--23UrO","u-fz-xsmall-t":"u-fz-xsmall-t--3ztHy","u-fz-small-t":"u-fz-small-t--Ued-S","u-fz-medium-t":"u-fz-medium-t--2f1aG","u-fz-large-t":"u-fz-large-t--NUIyb","u-fz-tiny-s":"u-fz-tiny-s--3j4yv","u-fz-xsmall-s":"u-fz-xsmall-s--2Sx3Y","u-fz-small-s":"u-fz-small-s--1LSIx","u-fz-medium-s":"u-fz-medium-s--2SxEA","u-fz-large-s":"u-fz-large-s--2YJ_G","u-fz-tiny-m":"u-fz-tiny-m--ewjQv","u-fz-xsmall-m":"u-fz-xsmall-m--xU7Y9","u-fz-small-m":"u-fz-small-m--1MrLy","u-fz-medium-m":"u-fz-medium-m--2uQX-","u-fz-large-m":"u-fz-large-m--ORypW","u-ta-left":"u-ta-left--1bUaA","u-ta-right":"u-ta-right--3D_QU","u-ta-center":"u-ta-center--34Tyd","u-ta-justify":"u-ta-justify--3iXNK","u-ta-left-t":"u-ta-left-t--pyg5a","u-ta-right-t":"u-ta-right-t--fejRN","u-ta-center-t":"u-ta-center-t--f8vf3","u-ta-justify-t":"u-ta-justify-t--2Znj-","u-ta-left-s":"u-ta-left-s--1Rk0h","u-ta-right-s":"u-ta-right-s--2H6yP","u-ta-center-s":"u-ta-center-s--2eLks","u-ta-justify-s":"u-ta-justify-s--2dbmf","u-ta-left-m":"u-ta-left-m--2xAxr","u-ta-right-m":"u-ta-right-m--MMP4S","u-ta-center-m":"u-ta-center-m--2pb6b","u-ta-justify-m":"u-ta-justify-m--1Gf3S","u-fs-normal":"u-fs-normal--2lCRF","u-fs-italic":"u-fs-italic--rEFJk","u-fs-normal-t":"u-fs-normal-t--MRfLT","u-fs-italic-t":"u-fs-italic-t--2iV9b","u-fs-normal-s":"u-fs-normal-s--159Lr","u-fs-italic-s":"u-fs-italic-s--23qYl","u-fs-normal-m":"u-fs-normal-m--Urjhm","u-fs-italic-m":"u-fs-italic-m--2gzsV","c-btn":"c-btn--3UA-V","c-btn--regular":"c-btn--regular--PwZpe","c-btn-client":"c-btn-client--2tQwf","c-btn-client-mobile":"c-btn-client-mobile--qCtpH","c-btn--ghost":"c-btn--ghost--2_lgT","c-btn--highlight":"c-btn--highlight--3vafy","c-btn--alpha":"c-btn--alpha--2q43H","c-btn--action":"c-btn--action--kLpJs","c-btn--close":"c-btn--close--3kuo8","c-btn--danger":"c-btn--danger--2XQh4","c-btn--secondary":"c-btn--secondary--urTR1","c-btn--danger-outline":"c-btn--danger-outline--ELeOr","c-btn--text":"c-btn--text--mmLkW","c-btn-alert":"c-btn-alert--22GlB","c-btn-alert--error":"c-btn-alert--error--1BaFH","c-btn-alert--info":"c-btn-alert--info--3X_r7","c-btn-alert--success":"c-btn-alert--success--2VaBQ","c-btn--left":"c-btn--left--3OD3h","c-btn--center":"c-btn--center--2of3J","c-btn--right":"c-btn--right--2l-9g","c-btn--tiny":"c-btn--tiny--2rzhV","c-btn--small":"c-btn--small--3zq7D","c-btn--large":"c-btn--large--2gEik","c-btn--full":"c-btn--full--GBaOx","c-btn--narrow":"c-btn--narrow--30Rqf","c-btn--round":"c-btn--round--_aX03","c-btn--subtle":"c-btn--subtle--3D_uR","c-label":"c-label--2qBFO","is-error":"is-error--1sgd0","c-label--block":"c-label--block--4NI1H","c-input-text":"c-input-text--1a2pY","c-textarea":"c-textarea--1tr4M","c-select":"c-select--3Umuy","wizard-select":"wizard-select--1SIu0","c-input-text--tiny":"c-input-text--tiny--1H28g","c-textarea--tiny":"c-textarea--tiny--GgwpO","c-select--tiny":"c-select--tiny--2jx9I","c-input-text--medium":"c-input-text--medium--1D6tS","c-textarea--medium":"c-textarea--medium--2K6B5","c-select--medium":"c-select--medium--3MGmK","wizard-select--medium":"wizard-select--medium--oQoal","c-input-text--large":"c-input-text--large--3xPjf","c-input-text--fullwidth":"c-input-text--fullwidth--MMc36","c-textarea--fullwidth":"c-textarea--fullwidth--2CxEM","c-select--fullwidth":"c-select--fullwidth--5j0Zo","c-input-checkbox":"c-input-checkbox--rpPFH","c-input-radio":"c-input-radio--2-8ai","o-field":"o-field--2OEF5","o-field-inline":"o-field-inline--2saLK","c-double-field":"c-double-field--3q70t","c-double-field--with-button":"c-double-field--with-button--3tMaK","c-double-field-label":"c-double-field-label--z4waM","c-double-field-button":"c-double-field-button--25ta4","c-double-field-wrapper":"c-double-field-wrapper--30B0F","c-double-field-input":"c-double-field-input--adEwN","wizard-wrapper":"wizard-wrapper--2nycg","wizard-main":"wizard-main--wXCWj","wizard-header":"wizard-header--1SbfB","wizard-footer":"wizard-footer--3nLGi","o-layout":"o-layout--b6QtC","o-layout-2panes":"o-layout-2panes--3JD2K","u-media":"u-media--3Djvn","u-media-top":"u-media-top--3V4Ea","u-media-bottom":"u-media-bottom--3l3_d","u-media-grow":"u-media-grow--Upl9-","u-media-fixed":"u-media-fixed--35gfP","o-sidebar":"o-sidebar--3pkob","c-accordion":"c-accordion--2MN5i","c-accordion-item":"c-accordion-item--1UqQz","c-accordion-title":"c-accordion-title--vUajL","is-active":"is-active--3_GzD","c-accordion-body":"c-accordion-body--2iR7R","c-avatar":"c-avatar--2i9nQ","c-avatar-image":"c-avatar-image--1BnKZ","c-chip":"c-chip--3cHDn","c-chip--round":"c-chip--round--1RN3N","c-chip--tinySize":"c-chip--tinySize--1PPjs","c-chip--smallSize":"c-chip--smallSize--1Ch-7","c-chip--normalSize":"c-chip--normalSize--4X-LH","c-chip--outlinedVariant":"c-chip--outlinedVariant--3kHV8","c-chip--dashedVariant":"c-chip--dashedVariant--1m7j7","c-chip--normalTheme":"c-chip--normalTheme--3N2fw","c-chip--primaryTheme":"c-chip--primaryTheme--jjGlD","c-chip--errorTheme":"c-chip--errorTheme--2xix4","c-chip--hoverableNormalTheme":"c-chip--hoverableNormalTheme--3-Awt","c-chip--hoverablePrimaryTheme":"c-chip--hoverablePrimaryTheme--ozFPG","c-chip--normalPrimaryTheme":"c-chip--normalPrimaryTheme--2lzBw","c-chip--hoverableErrorTheme":"c-chip--hoverableErrorTheme--2hU7F","c-chip--outlinedNormalTheme":"c-chip--outlinedNormalTheme--pqiX7","c-chip--clickable":"c-chip--clickable--J0A_M","c-chip-separator":"c-chip-separator--2DLA2","c-chip-button":"c-chip-button--34nIU","c-chip-button--disabled":"c-chip-button--disabled--3_aON","c-avatar--xsmall":"c-avatar--xsmall--9VmMk","c-avatar--small":"c-avatar--small--31FDG","c-avatar--large":"c-avatar--large--1aC96","c-avatar--xlarge":"c-avatar--xlarge--ILibE","c-avatar-initials":"c-avatar-initials--3iExZ","c-nav":"c-nav--MAJhZ","c-nav-item":"c-nav-item--18dm5","c-nav-icon":"c-nav-icon--1eL3E","c-nav-text":"c-nav-text--MK8-L","c-nav-link":"c-nav-link--1VBtf","active":"active--zuJra","u-p-0":"u-p-0--y8Xrr","u-pt-0":"u-pt-0--b3ok9","u-pb-0":"u-pb-0--3joTR","u-pl-0":"u-pl-0--_7viJ","u-pr-0":"u-pr-0--2y4IV","u-pv-0":"u-pv-0--XTdBE","u-ph-0":"u-ph-0--AHFmn","u-p-1":"u-p-1--hpKTc","u-pt-1":"u-pt-1--3FKBS","u-pb-1":"u-pb-1--2quYJ","u-pl-1":"u-pl-1--10D92","u-pr-1":"u-pr-1--2DDXw","u-pv-1":"u-pv-1--idfta","u-ph-1":"u-ph-1--1PTVh","u-p-2":"u-p-2--NlLU8","u-pt-2":"u-pt-2--MWHfO","u-pb-2":"u-pb-2--iUhsi","u-pl-2":"u-pl-2--UNmzz","u-pr-2":"u-pr-2--3shOe","u-pv-2":"u-pv-2--2Zj4A","u-ph-2":"u-ph-2--3cDpk","u-p-3":"u-p-3--2L9z6","u-pt-3":"u-pt-3--zx4zU","u-pb-3":"u-pb-3--1zUAl","u-pl-3":"u-pl-3--1YOvL","u-pr-3":"u-pr-3--3WdTS","u-pv-3":"u-pv-3--CHw8y","u-ph-3":"u-ph-3--3ZyVQ","u-p-auto":"u-p-auto--2yYME","u-pt-auto":"u-pt-auto--2mMOx","u-pb-auto":"u-pb-auto--1dxzL","u-pl-auto":"u-pl-auto--2wEQU","u-pr-auto":"u-pr-auto--31ggn","u-pv-auto":"u-pv-auto--11hBU","u-ph-auto":"u-ph-auto--2fP8f","u-p-half":"u-p-half--2J7M_","u-pt-half":"u-pt-half--3kpiC","u-pb-half":"u-pb-half--38LQ9","u-pl-half":"u-pl-half--fGFSm","u-pr-half":"u-pr-half--64oQe","u-pv-half":"u-pv-half--1mqRV","u-ph-half":"u-ph-half--PgHST","u-p-1-half":"u-p-1-half--28RpX","u-pt-1-half":"u-pt-1-half--2mf_v","u-pb-1-half":"u-pb-1-half--2n8_e","u-pl-1-half":"u-pl-1-half--3EhRb","u-pr-1-half":"u-pr-1-half--1J-5k","u-pv-1-half":"u-pv-1-half--uWGwH","u-ph-1-half":"u-ph-1-half--3E4Nt","u-p-2-half":"u-p-2-half--2NuXX","u-pt-2-half":"u-pt-2-half--3XZoy","u-pb-2-half":"u-pb-2-half--1NM3c","u-pl-2-half":"u-pl-2-half--141Zm","u-pr-2-half":"u-pr-2-half--1RXqW","u-pv-2-half":"u-pv-2-half--1r9QA","u-ph-2-half":"u-ph-2-half--2WlBv","u-m-0":"u-m-0--nxwkH","u-mt-0":"u-mt-0--3WEQ6","u-mb-0":"u-mb-0--1uCnW","u-ml-0":"u-ml-0--1NrZO","u-mr-0":"u-mr-0--21TvT","u-mv-0":"u-mv-0--xDRm6","u-mh-0":"u-mh-0--1HCFo","u-m-1":"u-m-1--14N2c","u-mt-1":"u-mt-1--1PAGV","u-mb-1":"u-mb-1--3QUNm","u-ml-1":"u-ml-1--5w57C","u-mr-1":"u-mr-1--1iET2","u-mv-1":"u-mv-1--1dYuF","u-mh-1":"u-mh-1--2QaJJ","u-m-2":"u-m-2--3ghrR","u-mt-2":"u-mt-2--3z6rm","u-mb-2":"u-mb-2--3FMsz","u-ml-2":"u-ml-2--1QFyq","u-mr-2":"u-mr-2--1hDmH","u-mv-2":"u-mv-2--8_vXa","u-mh-2":"u-mh-2--1WTwI","u-m-3":"u-m-3--3kDfD","u-mt-3":"u-mt-3--1L_AE","u-mb-3":"u-mb-3--QFxTQ","u-ml-3":"u-ml-3--2iMXf","u-mr-3":"u-mr-3--TFRUN","u-mv-3":"u-mv-3--3_YTm","u-mh-3":"u-mh-3--3txta","u-m-auto":"u-m-auto--1W2QC","u-mt-auto":"u-mt-auto--3tir0","u-mb-auto":"u-mb-auto--2xLQw","u-ml-auto":"u-ml-auto--2R7Ia","u-mr-auto":"u-mr-auto--T8VYp","u-mv-auto":"u-mv-auto--1fqvt","u-mh-auto":"u-mh-auto--1hVPT","u-m-half":"u-m-half--3KCqa","u-mt-half":"u-mt-half--1GT2C","u-mb-half":"u-mb-half--3mvG9","u-ml-half":"u-ml-half--bWq9v","u-mr-half":"u-mr-half--1-rBC","u-mv-half":"u-mv-half--24ac8","u-mh-half":"u-mh-half--2fKJD","u-m-1-half":"u-m-1-half--2Hdxz","u-mt-1-half":"u-mt-1-half--3LMGU","u-mb-1-half":"u-mb-1-half--3kWkf","u-ml-1-half":"u-ml-1-half--u_QKP","u-mr-1-half":"u-mr-1-half--3YtZU","u-mv-1-half":"u-mv-1-half--1sbtC","u-mh-1-half":"u-mh-1-half--35_aD","u-m-2-half":"u-m-2-half--3VY8-","u-mt-2-half":"u-mt-2-half--3l47x","u-mb-2-half":"u-mb-2-half--3hXpG","u-ml-2-half":"u-ml-2-half--3K2Ir","u-mr-2-half":"u-mr-2-half--1LyDZ","u-mv-2-half":"u-mv-2-half--ZGTUL","u-mh-2-half":"u-mh-2-half--1RFpa","u-p-0-t":"u-p-0-t--2QvQm","u-pt-0-t":"u-pt-0-t--3wAjV","u-pb-0-t":"u-pb-0-t--3ULGs","u-pl-0-t":"u-pl-0-t--bu3GD","u-pr-0-t":"u-pr-0-t--22Xba","u-pv-0-t":"u-pv-0-t--2lkmW","u-ph-0-t":"u-ph-0-t--2MrDj","u-p-1-t":"u-p-1-t--1pNOa","u-pt-1-t":"u-pt-1-t--2csHL","u-pb-1-t":"u-pb-1-t--1gadZ","u-pl-1-t":"u-pl-1-t--1hZ5g","u-pr-1-t":"u-pr-1-t--Ib5v4","u-pv-1-t":"u-pv-1-t--UObIs","u-ph-1-t":"u-ph-1-t--D21wD","u-p-2-t":"u-p-2-t--3touZ","u-pt-2-t":"u-pt-2-t--2iNHv","u-pb-2-t":"u-pb-2-t--3olEr","u-pl-2-t":"u-pl-2-t--1bLCM","u-pr-2-t":"u-pr-2-t--16lTE","u-pv-2-t":"u-pv-2-t--1ujed","u-ph-2-t":"u-ph-2-t--TQEPS","u-p-3-t":"u-p-3-t--3fTr4","u-pt-3-t":"u-pt-3-t--1RHBV","u-pb-3-t":"u-pb-3-t--3t8Yy","u-pl-3-t":"u-pl-3-t--IiPy7","u-pr-3-t":"u-pr-3-t--2YNxB","u-pv-3-t":"u-pv-3-t--1hhbs","u-ph-3-t":"u-ph-3-t--3DB2q","u-p-auto-t":"u-p-auto-t--2mEtM","u-pt-auto-t":"u-pt-auto-t--3j9P3","u-pb-auto-t":"u-pb-auto-t--3QDHL","u-pl-auto-t":"u-pl-auto-t--2qm17","u-pr-auto-t":"u-pr-auto-t--2n4xI","u-pv-auto-t":"u-pv-auto-t--3FNQ-","u-ph-auto-t":"u-ph-auto-t--26EGK","u-p-half-t":"u-p-half-t--3A2po","u-pt-half-t":"u-pt-half-t--DuGPy","u-pb-half-t":"u-pb-half-t--2LOfK","u-pl-half-t":"u-pl-half-t--33tnU","u-pr-half-t":"u-pr-half-t--2L8e4","u-pv-half-t":"u-pv-half-t--efcaW","u-ph-half-t":"u-ph-half-t--1Ve9R","u-p-1-half-t":"u-p-1-half-t--Do2ub","u-pt-1-half-t":"u-pt-1-half-t--1UTKD","u-pb-1-half-t":"u-pb-1-half-t--21qzv","u-pl-1-half-t":"u-pl-1-half-t--3HLDe","u-pr-1-half-t":"u-pr-1-half-t--1tGOg","u-pv-1-half-t":"u-pv-1-half-t--3pkNB","u-ph-1-half-t":"u-ph-1-half-t--1nFkO","u-p-2-half-t":"u-p-2-half-t--2ISfu","u-pt-2-half-t":"u-pt-2-half-t--SbBZG","u-pb-2-half-t":"u-pb-2-half-t--1q6in","u-pl-2-half-t":"u-pl-2-half-t--LZP3T","u-pr-2-half-t":"u-pr-2-half-t--3C5vd","u-pv-2-half-t":"u-pv-2-half-t--9QZ6i","u-ph-2-half-t":"u-ph-2-half-t--1LiYX","u-m-0-t":"u-m-0-t--3QA3z","u-mt-0-t":"u-mt-0-t--3YoXS","u-mb-0-t":"u-mb-0-t--2-e9t","u-ml-0-t":"u-ml-0-t--zDvCi","u-mr-0-t":"u-mr-0-t--w7o6v","u-mv-0-t":"u-mv-0-t--3hLKW","u-mh-0-t":"u-mh-0-t--2JKES","u-m-1-t":"u-m-1-t--1AHzF","u-mt-1-t":"u-mt-1-t--jm_tC","u-mb-1-t":"u-mb-1-t--1IpQZ","u-ml-1-t":"u-ml-1-t--3OWq6","u-mr-1-t":"u-mr-1-t--3AGBB","u-mv-1-t":"u-mv-1-t--1TK_C","u-mh-1-t":"u-mh-1-t--15nBw","u-m-2-t":"u-m-2-t--3-xx9","u-mt-2-t":"u-mt-2-t--1jtnZ","u-mb-2-t":"u-mb-2-t--1VouU","u-ml-2-t":"u-ml-2-t--3SgvZ","u-mr-2-t":"u-mr-2-t--2uVnw","u-mv-2-t":"u-mv-2-t--LD1VD","u-mh-2-t":"u-mh-2-t--DIKso","u-m-3-t":"u-m-3-t--3rxLu","u-mt-3-t":"u-mt-3-t--3Y5oD","u-mb-3-t":"u-mb-3-t--1z1MA","u-ml-3-t":"u-ml-3-t--26LDt","u-mr-3-t":"u-mr-3-t--zCI_b","u-mv-3-t":"u-mv-3-t--qD6jm","u-mh-3-t":"u-mh-3-t--2V_Cy","u-m-auto-t":"u-m-auto-t--3O13t","u-mt-auto-t":"u-mt-auto-t--HQdIe","u-mb-auto-t":"u-mb-auto-t--3Q7y6","u-ml-auto-t":"u-ml-auto-t--18Mob","u-mr-auto-t":"u-mr-auto-t--3x5Qy","u-mv-auto-t":"u-mv-auto-t--261wG","u-mh-auto-t":"u-mh-auto-t--2xHVA","u-m-half-t":"u-m-half-t--3BBEX","u-mt-half-t":"u-mt-half-t--1684f","u-mb-half-t":"u-mb-half-t--3omhK","u-ml-half-t":"u-ml-half-t--2sdGI","u-mr-half-t":"u-mr-half-t--3HkTd","u-mv-half-t":"u-mv-half-t--2SN5V","u-mh-half-t":"u-mh-half-t--263h5","u-m-1-half-t":"u-m-1-half-t--9r0RJ","u-mt-1-half-t":"u-mt-1-half-t--jOR6l","u-mb-1-half-t":"u-mb-1-half-t--4uDMs","u-ml-1-half-t":"u-ml-1-half-t--1ngj6","u-mr-1-half-t":"u-mr-1-half-t--3VL_h","u-mv-1-half-t":"u-mv-1-half-t--2RlZy","u-mh-1-half-t":"u-mh-1-half-t--C1wpt","u-m-2-half-t":"u-m-2-half-t--2P3Oz","u-mt-2-half-t":"u-mt-2-half-t--PfsuH","u-mb-2-half-t":"u-mb-2-half-t--1rFT1","u-ml-2-half-t":"u-ml-2-half-t--1O81G","u-mr-2-half-t":"u-mr-2-half-t--qn3JM","u-mv-2-half-t":"u-mv-2-half-t--299qN","u-mh-2-half-t":"u-mh-2-half-t--1rwCl","u-p-0-s":"u-p-0-s--1MSe5","u-pt-0-s":"u-pt-0-s--1WoRg","u-pb-0-s":"u-pb-0-s--2OtJJ","u-pl-0-s":"u-pl-0-s--3YYXR","u-pr-0-s":"u-pr-0-s--3rplb","u-pv-0-s":"u-pv-0-s--2jfRk","u-ph-0-s":"u-ph-0-s--xxUY8","u-p-1-s":"u-p-1-s--39988","u-pt-1-s":"u-pt-1-s--2FQZ8","u-pb-1-s":"u-pb-1-s--3oluM","u-pl-1-s":"u-pl-1-s--1DTew","u-pr-1-s":"u-pr-1-s--3Imwo","u-pv-1-s":"u-pv-1-s--3JlIO","u-ph-1-s":"u-ph-1-s--WphZd","u-p-2-s":"u-p-2-s--2aJ6L","u-pt-2-s":"u-pt-2-s--2RjCz","u-pb-2-s":"u-pb-2-s--TXwMq","u-pl-2-s":"u-pl-2-s--1joNm","u-pr-2-s":"u-pr-2-s--LaO4X","u-pv-2-s":"u-pv-2-s--1OBPg","u-ph-2-s":"u-ph-2-s--1oEfr","u-p-3-s":"u-p-3-s--2b-aZ","u-pt-3-s":"u-pt-3-s--3Mb8s","u-pb-3-s":"u-pb-3-s--LRlYx","u-pl-3-s":"u-pl-3-s--3fhIN","u-pr-3-s":"u-pr-3-s--1V7_j","u-pv-3-s":"u-pv-3-s--QqLeV","u-ph-3-s":"u-ph-3-s--1A2sL","u-p-auto-s":"u-p-auto-s--1qQQ4","u-pt-auto-s":"u-pt-auto-s--38U0g","u-pb-auto-s":"u-pb-auto-s--12692","u-pl-auto-s":"u-pl-auto-s--3mGCK","u-pr-auto-s":"u-pr-auto-s--2wgwJ","u-pv-auto-s":"u-pv-auto-s--2nOsL","u-ph-auto-s":"u-ph-auto-s--1U-PH","u-p-half-s":"u-p-half-s--FJ3kC","u-pt-half-s":"u-pt-half-s--7uxyd","u-pb-half-s":"u-pb-half-s--24NkQ","u-pl-half-s":"u-pl-half-s--D8iRP","u-pr-half-s":"u-pr-half-s--2boI3","u-pv-half-s":"u-pv-half-s--S1xZC","u-ph-half-s":"u-ph-half-s--2KVF1","u-p-1-half-s":"u-p-1-half-s--3ystf","u-pt-1-half-s":"u-pt-1-half-s--2VXv-","u-pb-1-half-s":"u-pb-1-half-s--ekRma","u-pl-1-half-s":"u-pl-1-half-s--32N21","u-pr-1-half-s":"u-pr-1-half-s--2M-9d","u-pv-1-half-s":"u-pv-1-half-s--1enXo","u-ph-1-half-s":"u-ph-1-half-s--1qaze","u-p-2-half-s":"u-p-2-half-s--2sFyi","u-pt-2-half-s":"u-pt-2-half-s--3i5rV","u-pb-2-half-s":"u-pb-2-half-s--XDUga","u-pl-2-half-s":"u-pl-2-half-s--3J-rK","u-pr-2-half-s":"u-pr-2-half-s--XoTtz","u-pv-2-half-s":"u-pv-2-half-s--3GoC7","u-ph-2-half-s":"u-ph-2-half-s--2aaKX","u-m-0-s":"u-m-0-s--1SpyQ","u-mt-0-s":"u-mt-0-s--1jF8_","u-mb-0-s":"u-mb-0-s--3XKF3","u-ml-0-s":"u-ml-0-s--y9g4h","u-mr-0-s":"u-mr-0-s--3SzNU","u-mv-0-s":"u-mv-0-s--1wpIB","u-mh-0-s":"u-mh-0-s--364eB","u-m-1-s":"u-m-1-s--cSJEs","u-mt-1-s":"u-mt-1-s--2fP-b","u-mb-1-s":"u-mb-1-s--2qEkz","u-ml-1-s":"u-ml-1-s--3W7c2","u-mr-1-s":"u-mr-1-s--GBr0i","u-mv-1-s":"u-mv-1-s--3Fc_m","u-mh-1-s":"u-mh-1-s--1f4QQ","u-m-2-s":"u-m-2-s--1e4k7","u-mt-2-s":"u-mt-2-s--2J2VI","u-mb-2-s":"u-mb-2-s--2LiRf","u-ml-2-s":"u-ml-2-s--1gL2R","u-mr-2-s":"u-mr-2-s--2-DUg","u-mv-2-s":"u-mv-2-s--Z8REp","u-mh-2-s":"u-mh-2-s--2Q8gT","u-m-3-s":"u-m-3-s--1GQRB","u-mt-3-s":"u-mt-3-s--3_Pgs","u-mb-3-s":"u-mb-3-s--1GZAN","u-ml-3-s":"u-ml-3-s--WyyjT","u-mr-3-s":"u-mr-3-s--2WVTU","u-mv-3-s":"u-mv-3-s--3JCA0","u-mh-3-s":"u-mh-3-s--1F1FW","u-m-auto-s":"u-m-auto-s--3Ok4o","u-mt-auto-s":"u-mt-auto-s--VOH6X","u-mb-auto-s":"u-mb-auto-s--rsaq1","u-ml-auto-s":"u-ml-auto-s--1wkpx","u-mr-auto-s":"u-mr-auto-s--vL9Ea","u-mv-auto-s":"u-mv-auto-s--3DbDS","u-mh-auto-s":"u-mh-auto-s--3FbF1","u-m-half-s":"u-m-half-s--2tUoH","u-mt-half-s":"u-mt-half-s--jA_pB","u-mb-half-s":"u-mb-half-s--14tWO","u-ml-half-s":"u-ml-half-s--7ENf9","u-mr-half-s":"u-mr-half-s--2Jp6R","u-mv-half-s":"u-mv-half-s--2uOKM","u-mh-half-s":"u-mh-half-s--1VIXW","u-m-1-half-s":"u-m-1-half-s--2nzte","u-mt-1-half-s":"u-mt-1-half-s--3HPhw","u-mb-1-half-s":"u-mb-1-half-s--3dIp8","u-ml-1-half-s":"u-ml-1-half-s--3xGIv","u-mr-1-half-s":"u-mr-1-half-s--3lcMx","u-mv-1-half-s":"u-mv-1-half-s--WmVLs","u-mh-1-half-s":"u-mh-1-half-s--2V0qx","u-m-2-half-s":"u-m-2-half-s--Oemtk","u-mt-2-half-s":"u-mt-2-half-s--15vM2","u-mb-2-half-s":"u-mb-2-half-s--sqESr","u-ml-2-half-s":"u-ml-2-half-s--nLmJf","u-mr-2-half-s":"u-mr-2-half-s--3tYQl","u-mv-2-half-s":"u-mv-2-half-s--3VTR0","u-mh-2-half-s":"u-mh-2-half-s--1c_UP","u-p-0-m":"u-p-0-m--dAQKV","u-pt-0-m":"u-pt-0-m--D38Sx","u-pb-0-m":"u-pb-0-m--35g3C","u-pl-0-m":"u-pl-0-m--3iTGR","u-pr-0-m":"u-pr-0-m--j2hP4","u-pv-0-m":"u-pv-0-m--3BB4R","u-ph-0-m":"u-ph-0-m--3ZG_b","u-p-1-m":"u-p-1-m--221Fn","u-pt-1-m":"u-pt-1-m--2ytb0","u-pb-1-m":"u-pb-1-m--31K8o","u-pl-1-m":"u-pl-1-m--AWGeh","u-pr-1-m":"u-pr-1-m--2w1Yf","u-pv-1-m":"u-pv-1-m--2C4Os","u-ph-1-m":"u-ph-1-m--1IJ92","u-p-2-m":"u-p-2-m--1vG0b","u-pt-2-m":"u-pt-2-m--3DUrj","u-pb-2-m":"u-pb-2-m--1sTF_","u-pl-2-m":"u-pl-2-m--3pKjH","u-pr-2-m":"u-pr-2-m--27mu1","u-pv-2-m":"u-pv-2-m--o2buk","u-ph-2-m":"u-ph-2-m--doo63","u-p-3-m":"u-p-3-m--2pP3t","u-pt-3-m":"u-pt-3-m--2gZWa","u-pb-3-m":"u-pb-3-m--1HElb","u-pl-3-m":"u-pl-3-m--2P5i2","u-pr-3-m":"u-pr-3-m--26KCi","u-pv-3-m":"u-pv-3-m--nHM6K","u-ph-3-m":"u-ph-3-m--24Izv","u-p-auto-m":"u-p-auto-m--9dnBJ","u-pt-auto-m":"u-pt-auto-m--3XnS6","u-pb-auto-m":"u-pb-auto-m--3l1eN","u-pl-auto-m":"u-pl-auto-m--2v9ru","u-pr-auto-m":"u-pr-auto-m--185m_","u-pv-auto-m":"u-pv-auto-m--2TN8e","u-ph-auto-m":"u-ph-auto-m--zokL4","u-p-half-m":"u-p-half-m--lv8Ph","u-pt-half-m":"u-pt-half-m--3fcJI","u-pb-half-m":"u-pb-half-m--3_uz_","u-pl-half-m":"u-pl-half-m--15BRi","u-pr-half-m":"u-pr-half-m--27L1r","u-pv-half-m":"u-pv-half-m--7n07P","u-ph-half-m":"u-ph-half-m--kOrxo","u-p-1-half-m":"u-p-1-half-m--ntym-","u-pt-1-half-m":"u-pt-1-half-m--3_7pE","u-pb-1-half-m":"u-pb-1-half-m--135Lv","u-pl-1-half-m":"u-pl-1-half-m--2QOYo","u-pr-1-half-m":"u-pr-1-half-m--iuR1o","u-pv-1-half-m":"u-pv-1-half-m--2BOOJ","u-ph-1-half-m":"u-ph-1-half-m--Fzqqk","u-p-2-half-m":"u-p-2-half-m--3Q4S1","u-pt-2-half-m":"u-pt-2-half-m--37FuK","u-pb-2-half-m":"u-pb-2-half-m--3VgUF","u-pl-2-half-m":"u-pl-2-half-m--1SMDl","u-pr-2-half-m":"u-pr-2-half-m--2yQCL","u-pv-2-half-m":"u-pv-2-half-m--2j0KP","u-ph-2-half-m":"u-ph-2-half-m--3xqBu","u-m-0-m":"u-m-0-m--1Wvne","u-mt-0-m":"u-mt-0-m--16sTY","u-mb-0-m":"u-mb-0-m--2D-l-","u-ml-0-m":"u-ml-0-m--5MhDz","u-mr-0-m":"u-mr-0-m--3q64u","u-mv-0-m":"u-mv-0-m--2iAt_","u-mh-0-m":"u-mh-0-m--3dO8A","u-m-1-m":"u-m-1-m--37X8G","u-mt-1-m":"u-mt-1-m--5IiFO","u-mb-1-m":"u-mb-1-m--17-rf","u-ml-1-m":"u-ml-1-m--12WO2","u-mr-1-m":"u-mr-1-m--2l5Hs","u-mv-1-m":"u-mv-1-m--1fVsj","u-mh-1-m":"u-mh-1-m--1x3nT","u-m-2-m":"u-m-2-m--2pWTK","u-mt-2-m":"u-mt-2-m--1vpEs","u-mb-2-m":"u-mb-2-m--3dBW1","u-ml-2-m":"u-ml-2-m--22Xg5","u-mr-2-m":"u-mr-2-m--2JMMm","u-mv-2-m":"u-mv-2-m--3cqFT","u-mh-2-m":"u-mh-2-m--lCJa8","u-m-3-m":"u-m-3-m--2khpK","u-mt-3-m":"u-mt-3-m--3SQCl","u-mb-3-m":"u-mb-3-m--ISeE0","u-ml-3-m":"u-ml-3-m--3VpFr","u-mr-3-m":"u-mr-3-m--39RHD","u-mv-3-m":"u-mv-3-m--3Iohe","u-mh-3-m":"u-mh-3-m--2fQ9W","u-m-auto-m":"u-m-auto-m--78amG","u-mt-auto-m":"u-mt-auto-m--12Gk7","u-mb-auto-m":"u-mb-auto-m--3M7bR","u-ml-auto-m":"u-ml-auto-m--37-5v","u-mr-auto-m":"u-mr-auto-m--1aZX2","u-mv-auto-m":"u-mv-auto-m--3bIsu","u-mh-auto-m":"u-mh-auto-m--1DLUS","u-m-half-m":"u-m-half-m--3OQBA","u-mt-half-m":"u-mt-half-m--c5HzS","u-mb-half-m":"u-mb-half-m--2dT1f","u-ml-half-m":"u-ml-half-m--36adF","u-mr-half-m":"u-mr-half-m--3_rMb","u-mv-half-m":"u-mv-half-m--2Muh9","u-mh-half-m":"u-mh-half-m--1xfqd","u-m-1-half-m":"u-m-1-half-m--2nZvc","u-mt-1-half-m":"u-mt-1-half-m--2VXOO","u-mb-1-half-m":"u-mb-1-half-m--2pOVs","u-ml-1-half-m":"u-ml-1-half-m--3o1va","u-mr-1-half-m":"u-mr-1-half-m--3TW7w","u-mv-1-half-m":"u-mv-1-half-m--2TFt9","u-mh-1-half-m":"u-mh-1-half-m--20v92","u-m-2-half-m":"u-m-2-half-m--1T6Zi","u-mt-2-half-m":"u-mt-2-half-m--pAI5a","u-mb-2-half-m":"u-mb-2-half-m--2DfwS","u-ml-2-half-m":"u-ml-2-half-m--1rmzt","u-mr-2-half-m":"u-mr-2-half-m--1DqqY","u-mv-2-half-m":"u-mv-2-half-m--2uiaw","u-mh-2-half-m":"u-mh-2-half-m--Ln-2e","c-table":"c-table--2Eigo","c-table-head":"c-table-head--2VeAw","c-table-body":"c-table-body--3nvCe","c-table-row":"c-table-row--311a2","c-table-row-head":"c-table-row-head--2GHNy","is-selected":"is-selected--3F0-n","c-table-cell":"c-table-cell--11LuC","c-table-header":"c-table-header--37EzI","c-table-cell--primary":"c-table-cell--primary--1npa2","c-table-ellipsis":"c-table-ellipsis--1Htlg","c-table-divider":"c-table-divider--1-81j","wizard":"wizard--1RApT","wizard--waiting":"wizard--waiting--17YH2","wizard--scroll":"wizard--scroll--PoXiu","wizard--dual":"wizard--dual--2WWvA","wizard-wrapper--center":"wizard-wrapper--center--2EjZf","wizard-wrapper--bleed":"wizard-wrapper--bleed--ust6d","wizard-wrapper--dual":"wizard-wrapper--dual--D42F4","wizard-dual":"wizard-dual--1Ueqc","wizard-errors":"wizard-errors--1ZQw7","wizard--welcome":"wizard--welcome--1tusZ","wizard-logo":"wizard-logo--1g-b4","wizard-logo-img":"wizard-logo-img--1Y_SU","wizard-logo-badge":"wizard-logo-badge--KO9eE","wizard-header-help":"wizard-header-help--1wEAp","wizard-disclaimer":"wizard-disclaimer--3IY-e","wizard-desc":"wizard-desc--3Sshm","wizard-desc--footer":"wizard-desc--footer--2N90G","wizard-header-fixed":"wizard-header-fixed--2ArSg","wizard-previous":"wizard-previous--O0PvA","wizard-brand":"wizard-brand--1LZMr","wizard-brand--invert":"wizard-brand--invert--3R7j9","wizard-next":"wizard-next--oEVru","wizard-button":"wizard-button--HFMZ3","wizard-buttonlink":"wizard-buttonlink--2TOVt","wizard-input":"wizard-input--3J4hO","wizard-dual-btn":"wizard-dual-btn--1WFGQ","wizard-waiting-icon":"wizard-waiting-icon--21pc5","wizard-dual-icon":"wizard-dual-icon--3KuEc","wizard-title":"wizard-title--e7zpM","wizard-dual-title":"wizard-dual-title--BRshb","wizard-title-sub":"wizard-title-sub--yvHxu","wizard-subtitle":"wizard-subtitle--3A474","wizard-dual-subtitle":"wizard-dual-subtitle--2boJm","wizard-showbutton":"wizard-showbutton--1hdHS","wizard-dualfield":"wizard-dualfield--1kOSV","wizard-dualfield--focus":"wizard-dualfield--focus--1XLSK","wizard-dualfield--error":"wizard-dualfield--error--MYtFf","wizard-dualfield-wrapper":"wizard-dualfield-wrapper--3zWkB","wizard-dualfield-input":"wizard-dualfield-input--gu6Aw","wizard-protocol":"wizard-protocol--1fKHM","wizard-domain":"wizard-domain--3gcWA","wizard-requirements":"wizard-requirements--yFMf0","wizard-agreements":"wizard-agreements--3CX_2","wizard-agreements-item":"wizard-agreements-item--LJFNQ","wizard-agreements-desc":"wizard-agreements-desc--2ZuUF","wizard-agreements-icon":"wizard-agreements-icon--4JydE","wizard-updated":"wizard-updated--328d9","wizard-progress":"wizard-progress--3wxvO","wizard-progress-bar":"wizard-progress-bar--36RhA","wizard-notice":"wizard-notice--1hNNz","wizard-notice--lost":"wizard-notice--lost--32RE6","u-bg-black":"u-bg-black--26wgT","u-bg-white":"u-bg-white--1eLGZ","u-bg-paleGrey":"u-bg-paleGrey--3UNhV","u-bg-silver":"u-bg-silver--3mlXP","u-bg-coolGrey":"u-bg-coolGrey--2naDm","u-bg-slateGrey":"u-bg-slateGrey--1AA4F","u-bg-charcoalGrey":"u-bg-charcoalGrey--1TFsy","u-bg-overlay":"u-bg-overlay--CPwTV","u-bg-zircon":"u-bg-zircon--3FtcQ","u-bg-frenchPass":"u-bg-frenchPass--jbV4M","u-bg-dodgerBlue":"u-bg-dodgerBlue--3IFjS","u-bg-scienceBlue":"u-bg-scienceBlue--3nYxg","u-bg-puertoRico":"u-bg-puertoRico--1sFxJ","u-bg-grannyApple":"u-bg-grannyApple--2HmAg","u-bg-emerald":"u-bg-emerald--1avtE","u-bg-malachite":"u-bg-malachite--dXSyj","u-bg-seafoamGreen":"u-bg-seafoamGreen--1Gw4F","u-bg-brightSun":"u-bg-brightSun--5jQl6","u-bg-texasRose":"u-bg-texasRose--1g7Nf","u-bg-chablis":"u-bg-chablis--2E7Xu","u-bg-yourPink":"u-bg-yourPink--1zf_f","u-bg-fuchsia":"u-bg-fuchsia--3bJE6","u-bg-pomegranate":"u-bg-pomegranate--1JyDt","u-bg-monza":"u-bg-monza--W5jPB","u-bg-portage":"u-bg-portage--o7rHR","u-bg-azure":"u-bg-azure--2UOvY","u-bg-melon":"u-bg-melon--1_vRv","u-bg-blazeOrange":"u-bg-blazeOrange--wfbWg","u-bg-mango":"u-bg-mango--1xGbA","u-bg-pumpkinOrange":"u-bg-pumpkinOrange--3TUOl","u-bg-lavender":"u-bg-lavender--HjpR-","u-bg-darkPeriwinkle":"u-bg-darkPeriwinkle--3Ii-k","u-bg-purpley":"u-bg-purpley--1-cwy","u-bg-lightishPurple":"u-bg-lightishPurple--2z5j3","u-bg-barney":"u-bg-barney--1MHnL","u-bg-weirdGreen":"u-bg-weirdGreen--2iT3M","u-bg-primaryColor":"u-bg-primaryColor--9ZCba","u-bg-primaryColorLight":"u-bg-primaryColorLight--1tVp2","u-bg-primaryContrastTextColor":"u-bg-primaryContrastTextColor--2lvm-","u-bdrs-0":"u-bdrs-0--3AzKd","u-bdrs-1":"u-bdrs-1--23qwH","u-bdrs-2":"u-bdrs-2--28Fa3","u-bdrs-3":"u-bdrs-3--3sAI5","u-bdrs-4":"u-bdrs-4--MrM_B","u-bdrs-circle":"u-bdrs-circle--2D8l-","u-bdw-0":"u-bdw-0--M7j1G","u-bdw-1":"u-bdw-1--2hQbJ","u-bdrs-0-t":"u-bdrs-0-t--12o2i","u-bdrs-1-t":"u-bdrs-1-t--10ahd","u-bdrs-2-t":"u-bdrs-2-t--3Tx4t","u-bdrs-3-t":"u-bdrs-3-t--1Pty7","u-bdrs-4-t":"u-bdrs-4-t--3XIaA","u-bdrs-circle-t":"u-bdrs-circle-t--3PE9R","u-bdw-0-t":"u-bdw-0-t--1KCmg","u-bdw-1-t":"u-bdw-1-t--3Df5l","u-bdrs-0-s":"u-bdrs-0-s--3q0TZ","u-bdrs-1-s":"u-bdrs-1-s--1TIth","u-bdrs-2-s":"u-bdrs-2-s--3d7tn","u-bdrs-3-s":"u-bdrs-3-s--2F0g-","u-bdrs-4-s":"u-bdrs-4-s--3mPSF","u-bdrs-circle-s":"u-bdrs-circle-s--3cf01","u-bdw-0-s":"u-bdw-0-s--HYOam","u-bdw-1-s":"u-bdw-1-s--3MqXR","u-bdrs-0-m":"u-bdrs-0-m--2CI6A","u-bdrs-1-m":"u-bdrs-1-m--dWJJK","u-bdrs-2-m":"u-bdrs-2-m--29O4y","u-bdrs-3-m":"u-bdrs-3-m--TPM9n","u-bdrs-4-m":"u-bdrs-4-m--1wnEi","u-bdrs-circle-m":"u-bdrs-circle-m--2iN6B","u-bdw-0-m":"u-bdw-0-m--3U7PJ","u-bdw-1-m":"u-bdw-1-m--QQonZ","u-bxz":"u-bxz--syplv","u-c-default":"u-c-default--2YMoo","u-c-help":"u-c-help--31Fz5","u-c-pointer":"u-c-pointer--tnNsg","u-c-wait":"u-c-wait--2jqRs","u-c-not-allowed":"u-c-not-allowed--1qxkJ","u-debug":"u-debug--3-k7H","u-miw-1":"u-miw-1--pcCHD","u-maw-1":"u-maw-1--iXa4d","u-mih-1":"u-mih-1--3ouqA","u-mah-1":"u-mah-1--2rEuh","u-miw-2":"u-miw-2--2nWbO","u-maw-2":"u-maw-2--1i9Dh","u-mih-2":"u-mih-2--1nGAH","u-mah-2":"u-mah-2--3FkMl","u-miw-3":"u-miw-3--2nUDK","u-maw-3":"u-maw-3--3TJDM","u-mih-3":"u-mih-3--2YbJw","u-mah-3":"u-mah-3--3kLYn","u-miw-4":"u-miw-4--1jqWA","u-maw-4":"u-maw-4--33z3B","u-mih-4":"u-mih-4--1aHyl","u-mah-4":"u-mah-4--3vz5M","u-miw-5":"u-miw-5--T4Pc2","u-maw-5":"u-maw-5--2Pd-w","u-mih-5":"u-mih-5--3z2JH","u-mah-5":"u-mah-5--1VJHf","u-miw-6":"u-miw-6--2Zt8U","u-maw-6":"u-maw-6--23bfp","u-mih-6":"u-mih-6--3FqZr","u-mah-6":"u-mah-6--13Rts","u-miw-7":"u-miw-7--2sVxg","u-maw-7":"u-maw-7--dhGR5","u-mih-7":"u-mih-7--2eweX","u-mah-7":"u-mah-7--1XiRk","u-miw-8":"u-miw-8--5pt2M","u-maw-8":"u-maw-8--2iGjD","u-mih-8":"u-mih-8--1v5_r","u-mah-8":"u-mah-8--1bezJ","u-miw-9":"u-miw-9--3LEyn","u-maw-9":"u-maw-9--hLdHH","u-mih-9":"u-mih-9--2tEr-","u-mah-9":"u-mah-9--1i9F9","u-miw-100":"u-miw-100--2Aslb","u-maw-100":"u-maw-100--2iuiy","u-mih-100":"u-mih-100--1wRjQ","u-mah-100":"u-mah-100--3hTbn","u-maw-none":"u-maw-none--bNAsg","u-mah-none":"u-mah-none--1r0Ny","u-miw-auto":"u-miw-auto--1QoTf","u-mih-auto":"u-mih-auto--1DYRt","u-miw-half":"u-miw-half--1J7CZ","u-maw-half":"u-maw-half--3plSd","u-mih-half":"u-mih-half--3JiUV","u-mah-half":"u-mah-half--1upzr","u-miw-1-half":"u-miw-1-half--Z8B3P","u-maw-1-half":"u-maw-1-half--SlSbf","u-mih-1-half":"u-mih-1-half--3s_KL","u-mah-1-half":"u-mah-1-half--1RLHK","u-miw-2-half":"u-miw-2-half--3hnNo","u-maw-2-half":"u-maw-2-half--1DuHs","u-mih-2-half":"u-mih-2-half--1-Cm5","u-mah-2-half":"u-mah-2-half--1QMvH","u-miw-1-t":"u-miw-1-t--1ep4R","u-maw-1-t":"u-maw-1-t--239oa","u-mih-1-t":"u-mih-1-t--39c-O","u-mah-1-t":"u-mah-1-t--2Cwu5","u-miw-2-t":"u-miw-2-t--3P--o","u-maw-2-t":"u-maw-2-t--2SpUX","u-mih-2-t":"u-mih-2-t--A9N5y","u-mah-2-t":"u-mah-2-t--3hKOY","u-miw-3-t":"u-miw-3-t--3CbGP","u-maw-3-t":"u-maw-3-t--3g3GT","u-mih-3-t":"u-mih-3-t--1Okno","u-mah-3-t":"u-mah-3-t--2MazG","u-miw-4-t":"u-miw-4-t--3PPRP","u-maw-4-t":"u-maw-4-t--2hVE_","u-mih-4-t":"u-mih-4-t---IyJr","u-mah-4-t":"u-mah-4-t--1k-bX","u-miw-5-t":"u-miw-5-t--3DRcz","u-maw-5-t":"u-maw-5-t--3fiZX","u-mih-5-t":"u-mih-5-t--2E2oy","u-mah-5-t":"u-mah-5-t--2of2l","u-miw-6-t":"u-miw-6-t--2opwp","u-maw-6-t":"u-maw-6-t--1qniv","u-mih-6-t":"u-mih-6-t--GYpGD","u-mah-6-t":"u-mah-6-t--ZKMJS","u-miw-7-t":"u-miw-7-t--I4JTt","u-maw-7-t":"u-maw-7-t--1fF_f","u-mih-7-t":"u-mih-7-t--3VwVH","u-mah-7-t":"u-mah-7-t--2A_0-","u-miw-8-t":"u-miw-8-t--1Y-iv","u-maw-8-t":"u-maw-8-t--3FW89","u-mih-8-t":"u-mih-8-t--30z09","u-mah-8-t":"u-mah-8-t--3HZ5s","u-miw-9-t":"u-miw-9-t--11B1w","u-maw-9-t":"u-maw-9-t--3HXNq","u-mih-9-t":"u-mih-9-t--30ib2","u-mah-9-t":"u-mah-9-t--RLCjB","u-miw-100-t":"u-miw-100-t--toR5s","u-maw-100-t":"u-maw-100-t--2UZFf","u-mih-100-t":"u-mih-100-t--1Cdox","u-mah-100-t":"u-mah-100-t--2tJ06","u-maw-none-t":"u-maw-none-t--2hw7F","u-mah-none-t":"u-mah-none-t--3DtRx","u-miw-auto-t":"u-miw-auto-t--10PdC","u-mih-auto-t":"u-mih-auto-t--Urlt9","u-miw-half-t":"u-miw-half-t--3O3_g","u-maw-half-t":"u-maw-half-t--D6tKG","u-mih-half-t":"u-mih-half-t--2pmEz","u-mah-half-t":"u-mah-half-t--2aXbJ","u-miw-1-half-t":"u-miw-1-half-t--2E-Nw","u-maw-1-half-t":"u-maw-1-half-t--j4J_9","u-mih-1-half-t":"u-mih-1-half-t--3xLfY","u-mah-1-half-t":"u-mah-1-half-t--2rjKx","u-miw-2-half-t":"u-miw-2-half-t--erR_5","u-maw-2-half-t":"u-maw-2-half-t--3CN80","u-mih-2-half-t":"u-mih-2-half-t--34EYt","u-mah-2-half-t":"u-mah-2-half-t--1U8VT","u-miw-1-s":"u-miw-1-s--3htCe","u-maw-1-s":"u-maw-1-s--1SvV1","u-mih-1-s":"u-mih-1-s--2UOyr","u-mah-1-s":"u-mah-1-s--jpb_1","u-miw-2-s":"u-miw-2-s--1Jszk","u-maw-2-s":"u-maw-2-s--1_Gzt","u-mih-2-s":"u-mih-2-s--1WrA_","u-mah-2-s":"u-mah-2-s--2DsY4","u-miw-3-s":"u-miw-3-s--DD44j","u-maw-3-s":"u-maw-3-s---xavh","u-mih-3-s":"u-mih-3-s--1Qh1E","u-mah-3-s":"u-mah-3-s--V-T1c","u-miw-4-s":"u-miw-4-s--kld3T","u-maw-4-s":"u-maw-4-s--WF9uP","u-mih-4-s":"u-mih-4-s--27mz4","u-mah-4-s":"u-mah-4-s--2-69d","u-miw-5-s":"u-miw-5-s--3pogj","u-maw-5-s":"u-maw-5-s--epTn_","u-mih-5-s":"u-mih-5-s--3DLqW","u-mah-5-s":"u-mah-5-s--CBchG","u-miw-6-s":"u-miw-6-s--3EhEY","u-maw-6-s":"u-maw-6-s--15A6t","u-mih-6-s":"u-mih-6-s--if4k2","u-mah-6-s":"u-mah-6-s--3QntL","u-miw-7-s":"u-miw-7-s--I70-y","u-maw-7-s":"u-maw-7-s--25N1i","u-mih-7-s":"u-mih-7-s--2Gqi3","u-mah-7-s":"u-mah-7-s--2rDps","u-miw-8-s":"u-miw-8-s--151Rv","u-maw-8-s":"u-maw-8-s--2WVkX","u-mih-8-s":"u-mih-8-s--2-z4s","u-mah-8-s":"u-mah-8-s--3-4Mh","u-miw-9-s":"u-miw-9-s--3mMpB","u-maw-9-s":"u-maw-9-s--IVDj0","u-mih-9-s":"u-mih-9-s--3cgEZ","u-mah-9-s":"u-mah-9-s--3pkZw","u-miw-100-s":"u-miw-100-s--2FN9E","u-maw-100-s":"u-maw-100-s--3NH0D","u-mih-100-s":"u-mih-100-s--3CvGV","u-mah-100-s":"u-mah-100-s--2SM8s","u-maw-none-s":"u-maw-none-s--1B77n","u-mah-none-s":"u-mah-none-s--Qz1rb","u-miw-auto-s":"u-miw-auto-s--1WbjD","u-mih-auto-s":"u-mih-auto-s--2eTUN","u-miw-half-s":"u-miw-half-s--2DNHH","u-maw-half-s":"u-maw-half-s--4LmaY","u-mih-half-s":"u-mih-half-s--2TD6h","u-mah-half-s":"u-mah-half-s--1ob87","u-miw-1-half-s":"u-miw-1-half-s--1oDzq","u-maw-1-half-s":"u-maw-1-half-s--18bb8","u-mih-1-half-s":"u-mih-1-half-s--1PLyw","u-mah-1-half-s":"u-mah-1-half-s--vP5TD","u-miw-2-half-s":"u-miw-2-half-s--238uv","u-maw-2-half-s":"u-maw-2-half-s--3cl2R","u-mih-2-half-s":"u-mih-2-half-s--2UPIn","u-mah-2-half-s":"u-mah-2-half-s--3POxh","u-miw-1-m":"u-miw-1-m--2yuzO","u-maw-1-m":"u-maw-1-m--3q840","u-mih-1-m":"u-mih-1-m--2hhlS","u-mah-1-m":"u-mah-1-m--38QjT","u-miw-2-m":"u-miw-2-m--11Xxh","u-maw-2-m":"u-maw-2-m--34NKm","u-mih-2-m":"u-mih-2-m--1nQX5","u-mah-2-m":"u-mah-2-m--2tki1","u-miw-3-m":"u-miw-3-m--2gG-i","u-maw-3-m":"u-maw-3-m--1WgTV","u-mih-3-m":"u-mih-3-m--1-O73","u-mah-3-m":"u-mah-3-m--3tKhJ","u-miw-4-m":"u-miw-4-m--3diPf","u-maw-4-m":"u-maw-4-m--10erG","u-mih-4-m":"u-mih-4-m--3Wox5","u-mah-4-m":"u-mah-4-m--3ilhH","u-miw-5-m":"u-miw-5-m--_YM0x","u-maw-5-m":"u-maw-5-m--3wCQ5","u-mih-5-m":"u-mih-5-m--2PDtZ","u-mah-5-m":"u-mah-5-m--1yS-8","u-miw-6-m":"u-miw-6-m--C4Ku1","u-maw-6-m":"u-maw-6-m--U9jea","u-mih-6-m":"u-mih-6-m--3xRY9","u-mah-6-m":"u-mah-6-m--2Fks3","u-miw-7-m":"u-miw-7-m--DEaEQ","u-maw-7-m":"u-maw-7-m--CSMBv","u-mih-7-m":"u-mih-7-m--3LeUa","u-mah-7-m":"u-mah-7-m--jcbUJ","u-miw-8-m":"u-miw-8-m--HC3xv","u-maw-8-m":"u-maw-8-m--3-WHa","u-mih-8-m":"u-mih-8-m--3GLHZ","u-mah-8-m":"u-mah-8-m--1SICL","u-miw-9-m":"u-miw-9-m--16gj1","u-maw-9-m":"u-maw-9-m--1m7M7","u-mih-9-m":"u-mih-9-m--20ZE4","u-mah-9-m":"u-mah-9-m--3RJ8m","u-miw-100-m":"u-miw-100-m--mhK9T","u-maw-100-m":"u-maw-100-m--3fwGm","u-mih-100-m":"u-mih-100-m--2zixh","u-mah-100-m":"u-mah-100-m--1HKNy","u-maw-none-m":"u-maw-none-m--3yd6n","u-mah-none-m":"u-mah-none-m--1sG3f","u-miw-auto-m":"u-miw-auto-m--31pbI","u-mih-auto-m":"u-mih-auto-m--3eKnT","u-miw-half-m":"u-miw-half-m--3OydP","u-maw-half-m":"u-maw-half-m--1vW9J","u-mih-half-m":"u-mih-half-m--23H0B","u-mah-half-m":"u-mah-half-m--3x1fi","u-miw-1-half-m":"u-miw-1-half-m--3cmvV","u-maw-1-half-m":"u-maw-1-half-m--2TJUP","u-mih-1-half-m":"u-mih-1-half-m--34HHu","u-mah-1-half-m":"u-mah-1-half-m--3eiFR","u-miw-2-half-m":"u-miw-2-half-m--3Vz9m","u-maw-2-half-m":"u-maw-2-half-m--f-hJS","u-mih-2-half-m":"u-mih-2-half-m--ypMQS","u-mah-2-half-m":"u-mah-2-half-m--2MFqE","u-w-1":"u-w-1--3VH0u","u-h-1":"u-h-1--8lBKM","u-w-2":"u-w-2--39x3l","u-h-2":"u-h-2--19u91","u-w-3":"u-w-3--1nxYM","u-h-3":"u-h-3--Eaqkv","u-w-4":"u-w-4--2aJSh","u-h-4":"u-h-4--2hH6X","u-w-5":"u-w-5--d58zs","u-h-5":"u-h-5--22TfM","u-w-6":"u-w-6--1K2ws","u-h-6":"u-h-6--1oaCr","u-w-7":"u-w-7--b19H1","u-h-7":"u-h-7--2L4Sk","u-w-8":"u-w-8--2z1Kx","u-h-8":"u-h-8--1S7jV","u-w-9":"u-w-9--2-r_m","u-h-9":"u-h-9--2lKoV","u-w-100":"u-w-100--ACXhw","u-h-100":"u-h-100--1wLjF","u-w-auto":"u-w-auto--3FORA","u-h-auto":"u-h-auto--DPkbz","u-w-half":"u-w-half--2TqeR","u-h-half":"u-h-half--3kjT4","u-w-1-half":"u-w-1-half--33E64","u-h-1-half":"u-h-1-half--2YlfG","u-w-2-half":"u-w-2-half--1633y","u-h-2-half":"u-h-2-half--2dwgW","u-w-1-t":"u-w-1-t--3oY-3","u-h-1-t":"u-h-1-t--YEPLy","u-w-2-t":"u-w-2-t--332tV","u-h-2-t":"u-h-2-t--3-2Jx","u-w-3-t":"u-w-3-t--1dQWV","u-h-3-t":"u-h-3-t--yba2Z","u-w-4-t":"u-w-4-t--3CsIY","u-h-4-t":"u-h-4-t--3Ux0e","u-w-5-t":"u-w-5-t--31qUY","u-h-5-t":"u-h-5-t--MV-M2","u-w-6-t":"u-w-6-t--1LsmJ","u-h-6-t":"u-h-6-t--3mfjl","u-w-7-t":"u-w-7-t--DUDUu","u-h-7-t":"u-h-7-t--2XhNh","u-w-8-t":"u-w-8-t--3p43s","u-h-8-t":"u-h-8-t--4W1ot","u-w-9-t":"u-w-9-t--1LCzR","u-h-9-t":"u-h-9-t--QbDMF","u-w-100-t":"u-w-100-t--3Lyij","u-h-100-t":"u-h-100-t--34Gbi","u-w-auto-t":"u-w-auto-t--H5HPc","u-h-auto-t":"u-h-auto-t--TqO6m","u-w-half-t":"u-w-half-t--N0fxN","u-h-half-t":"u-h-half-t--tVBiA","u-w-1-half-t":"u-w-1-half-t--1ojFO","u-h-1-half-t":"u-h-1-half-t--2JMf_","u-w-2-half-t":"u-w-2-half-t--3BjY6","u-h-2-half-t":"u-h-2-half-t--2N1p6","u-w-1-s":"u-w-1-s--3f124","u-h-1-s":"u-h-1-s--2hul0","u-w-2-s":"u-w-2-s--100Cj","u-h-2-s":"u-h-2-s--ecToI","u-w-3-s":"u-w-3-s--25EQa","u-h-3-s":"u-h-3-s--1xU7M","u-w-4-s":"u-w-4-s--1-5HO","u-h-4-s":"u-h-4-s--1PiwS","u-w-5-s":"u-w-5-s--1A6nl","u-h-5-s":"u-h-5-s--310oO","u-w-6-s":"u-w-6-s--2ImB6","u-h-6-s":"u-h-6-s--ZfY8m","u-w-7-s":"u-w-7-s--XlUqZ","u-h-7-s":"u-h-7-s--z0dty","u-w-8-s":"u-w-8-s--3zpeE","u-h-8-s":"u-h-8-s--3uHN4","u-w-9-s":"u-w-9-s--tNmXs","u-h-9-s":"u-h-9-s--24gYC","u-w-100-s":"u-w-100-s--TGFKu","u-h-100-s":"u-h-100-s--1UNRx","u-w-auto-s":"u-w-auto-s--1syVB","u-h-auto-s":"u-h-auto-s--2tvot","u-w-half-s":"u-w-half-s--dRpUq","u-h-half-s":"u-h-half-s--3wK05","u-w-1-half-s":"u-w-1-half-s--xm9yH","u-h-1-half-s":"u-h-1-half-s--2nyrh","u-w-2-half-s":"u-w-2-half-s--2xeIl","u-h-2-half-s":"u-h-2-half-s--3uvmX","u-w-1-m":"u-w-1-m--1fPk1","u-h-1-m":"u-h-1-m--aA2U6","u-w-2-m":"u-w-2-m--1oexe","u-h-2-m":"u-h-2-m--3QCwm","u-w-3-m":"u-w-3-m--1RRxK","u-h-3-m":"u-h-3-m--3ptj9","u-w-4-m":"u-w-4-m--11Zpc","u-h-4-m":"u-h-4-m--20rW7","u-w-5-m":"u-w-5-m--3Zsj1","u-h-5-m":"u-h-5-m--1ddoO","u-w-6-m":"u-w-6-m--37zQR","u-h-6-m":"u-h-6-m--hTuca","u-w-7-m":"u-w-7-m--10pP3","u-h-7-m":"u-h-7-m--2tHwk","u-w-8-m":"u-w-8-m--3lZUN","u-h-8-m":"u-h-8-m--fwere","u-w-9-m":"u-w-9-m--6RE2o","u-h-9-m":"u-h-9-m--y3fiN","u-w-100-m":"u-w-100-m--Lu-Xj","u-h-100-m":"u-h-100-m--1WuGH","u-w-auto-m":"u-w-auto-m--3ziIe","u-h-auto-m":"u-h-auto-m--jh31R","u-w-half-m":"u-w-half-m--1SHef","u-h-half-m":"u-h-half-m--1d-Qm","u-w-1-half-m":"u-w-1-half-m--uB7-h","u-h-1-half-m":"u-h-1-half-m--3hYjR","u-w-2-half-m":"u-w-2-half-m--3ty43","u-h-2-half-m":"u-h-2-half-m--1Rquw","u-shake":"u-shake--3X0rg","shake":"shake--Dso-n","u-flex":"u-flex--1Jo2E","u-inline-flex":"u-inline-flex--3Q8J5","u-flex-none":"u-flex-none--2VWxS","u-flex-column":"u-flex-column--2s4iH","u-flex-row":"u-flex-row--2V77z","u-flex-wrap":"u-flex-wrap--2cQ2O","u-flex-nowrap":"u-flex-nowrap--n247O","u-flex-wrap-reverse":"u-flex-wrap-reverse--YjBSy","u-flex-column-reverse":"u-flex-column-reverse--2PDG-","u-flex-row-reverse":"u-flex-row-reverse--Z9QuU","u-flex-auto":"u-flex-auto--3kbE8","u-flex-items-start":"u-flex-items-start--21v8M","u-flex-items-end":"u-flex-items-end--2vpQQ","u-flex-items-center":"u-flex-items-center--23IR3","u-flex-items-baseline":"u-flex-items-baseline--3yFBu","u-flex-items-stretch":"u-flex-items-stretch--NBoVs","u-flex-self-start":"u-flex-self-start--2SefM","u-flex-self-end":"u-flex-self-end--2sE6S","u-flex-self-center":"u-flex-self-center--3mQqU","u-flex-self-baseline":"u-flex-self-baseline--3_qpc","u-flex-self-stretch":"u-flex-self-stretch--zx-3B","u-flex-justify-start":"u-flex-justify-start--311kB","u-flex-justify-end":"u-flex-justify-end--2hr0W","u-flex-justify-center":"u-flex-justify-center--wBzbs","u-flex-justify-between":"u-flex-justify-between--2Q8ZS","u-flex-justify-around":"u-flex-justify-around--3RClL","u-flex-content-start":"u-flex-content-start--36ecT","u-flex-content-end":"u-flex-content-end--1Sly7","u-flex-content-center":"u-flex-content-center--1ifW1","u-flex-content-between":"u-flex-content-between--pJiz4","u-flex-content-around":"u-flex-content-around--3FiFF","u-flex-content-stretch":"u-flex-content-stretch--174IP","u-flex-order-0":"u-flex-order-0--2suRo","u-flex-order-1":"u-flex-order-1--1Xhhp","u-flex-order-2":"u-flex-order-2--Ffvgx","u-flex-order-3":"u-flex-order-3--wvilB","u-flex-order-4":"u-flex-order-4--1nt9T","u-flex-order-5":"u-flex-order-5--3aNh3","u-flex-order-6":"u-flex-order-6--3Vyxt","u-flex-order-7":"u-flex-order-7--wh9ld","u-flex-order-8":"u-flex-order-8--3GoA0","u-flex-order-last":"u-flex-order-last--iycIu","u-flex-grow-0":"u-flex-grow-0--1p6gS","u-flex-grow-1":"u-flex-grow-1--3MO3C","u-flex-shrink-0":"u-flex-shrink-0--2XX2K","u-flex-shrink-1":"u-flex-shrink-1--3GwWh","u-flex-t":"u-flex-t--3bx5k","u-inline-flex-t":"u-inline-flex-t--19qEj","u-flex-none-t":"u-flex-none-t--1mAKW","u-flex-column-t":"u-flex-column-t--3kLMl","u-flex-row-t":"u-flex-row-t--2XMcM","u-flex-wrap-t":"u-flex-wrap-t--1vdOn","u-flex-nowrap-t":"u-flex-nowrap-t--tNGMy","u-flex-wrap-reverse-t":"u-flex-wrap-reverse-t--1clSz","u-flex-column-reverse-t":"u-flex-column-reverse-t--3HF6H","u-flex-row-reverse-t":"u-flex-row-reverse-t--3hrHN","u-flex-auto-t":"u-flex-auto-t--2UDlP","u-flex-items-start-t":"u-flex-items-start-t--3XzjB","u-flex-items-end-t":"u-flex-items-end-t--3lGH8","u-flex-items-center-t":"u-flex-items-center-t--1lgqA","u-flex-items-baseline-t":"u-flex-items-baseline-t--3vbbI","u-flex-items-stretch-t":"u-flex-items-stretch-t--HwhzZ","u-flex-self-start-t":"u-flex-self-start-t--1TiAD","u-flex-self-end-t":"u-flex-self-end-t--1wSzs","u-flex-self-center-t":"u-flex-self-center-t--2hIdR","u-flex-self-baseline-t":"u-flex-self-baseline-t--3MZz-","u-flex-self-stretch-t":"u-flex-self-stretch-t--2V-eb","u-flex-justify-start-t":"u-flex-justify-start-t--3ykDq","u-flex-justify-end-t":"u-flex-justify-end-t--3kzy0","u-flex-justify-center-t":"u-flex-justify-center-t--2tT9W","u-flex-justify-between-t":"u-flex-justify-between-t--R61QL","u-flex-justify-around-t":"u-flex-justify-around-t--3cj88","u-flex-content-start-t":"u-flex-content-start-t--2Fe7T","u-flex-content-end-t":"u-flex-content-end-t--1MuYO","u-flex-content-center-t":"u-flex-content-center-t--2EinK","u-flex-content-between-t":"u-flex-content-between-t--3AUVq","u-flex-content-around-t":"u-flex-content-around-t--HljdH","u-flex-content-stretch-t":"u-flex-content-stretch-t--qWtlO","u-flex-order-0-t":"u-flex-order-0-t--2xCTQ","u-flex-order-1-t":"u-flex-order-1-t--2__ro","u-flex-order-2-t":"u-flex-order-2-t--3rAx8","u-flex-order-3-t":"u-flex-order-3-t--7d9Fz","u-flex-order-4-t":"u-flex-order-4-t--2UG07","u-flex-order-5-t":"u-flex-order-5-t--79iKS","u-flex-order-6-t":"u-flex-order-6-t--1SVqM","u-flex-order-7-t":"u-flex-order-7-t--1tqFg","u-flex-order-8-t":"u-flex-order-8-t--1tzS7","u-flex-order-last-t":"u-flex-order-last-t--3snHd","u-flex-grow-0-t":"u-flex-grow-0-t--38wdB","u-flex-grow-1-t":"u-flex-grow-1-t--1_llt","u-flex-shrink-0-t":"u-flex-shrink-0-t--1wp__","u-flex-shrink-1-t":"u-flex-shrink-1-t--2ANEM","u-flex-s":"u-flex-s--bRNZe","u-inline-flex-s":"u-inline-flex-s--1_4en","u-flex-none-s":"u-flex-none-s--1L_69","u-flex-column-s":"u-flex-column-s--12htc","u-flex-row-s":"u-flex-row-s--1YR08","u-flex-wrap-s":"u-flex-wrap-s--3kX0q","u-flex-nowrap-s":"u-flex-nowrap-s--5cJwP","u-flex-wrap-reverse-s":"u-flex-wrap-reverse-s--1O56z","u-flex-column-reverse-s":"u-flex-column-reverse-s--2z3o9","u-flex-row-reverse-s":"u-flex-row-reverse-s--3lMxz","u-flex-auto-s":"u-flex-auto-s--2rxun","u-flex-items-start-s":"u-flex-items-start-s--hR4LX","u-flex-items-end-s":"u-flex-items-end-s--2aYmW","u-flex-items-center-s":"u-flex-items-center-s--1SHPV","u-flex-items-baseline-s":"u-flex-items-baseline-s--2W_ZX","u-flex-items-stretch-s":"u-flex-items-stretch-s--2N5XH","u-flex-self-start-s":"u-flex-self-start-s--30pwR","u-flex-self-end-s":"u-flex-self-end-s--1b8fR","u-flex-self-center-s":"u-flex-self-center-s--3TRR5","u-flex-self-baseline-s":"u-flex-self-baseline-s--2hBRK","u-flex-self-stretch-s":"u-flex-self-stretch-s--dFk9R","u-flex-justify-start-s":"u-flex-justify-start-s--1CCGA","u-flex-justify-end-s":"u-flex-justify-end-s--1HhsX","u-flex-justify-center-s":"u-flex-justify-center-s--1utWe","u-flex-justify-between-s":"u-flex-justify-between-s--GZoki","u-flex-justify-around-s":"u-flex-justify-around-s--3Dgtv","u-flex-content-start-s":"u-flex-content-start-s--3_7Og","u-flex-content-end-s":"u-flex-content-end-s--3tBex","u-flex-content-center-s":"u-flex-content-center-s--2qbo0","u-flex-content-between-s":"u-flex-content-between-s--2YJoe","u-flex-content-around-s":"u-flex-content-around-s--2fj5A","u-flex-content-stretch-s":"u-flex-content-stretch-s--3BOsM","u-flex-order-0-s":"u-flex-order-0-s--60dJ2","u-flex-order-1-s":"u-flex-order-1-s--3JQo2","u-flex-order-2-s":"u-flex-order-2-s--1p8RM","u-flex-order-3-s":"u-flex-order-3-s--30Mki","u-flex-order-4-s":"u-flex-order-4-s--24Wt7","u-flex-order-5-s":"u-flex-order-5-s--y9Epz","u-flex-order-6-s":"u-flex-order-6-s--_nIxn","u-flex-order-7-s":"u-flex-order-7-s--2S-EJ","u-flex-order-8-s":"u-flex-order-8-s--3A_d1","u-flex-order-last-s":"u-flex-order-last-s--2PeQT","u-flex-grow-0-s":"u-flex-grow-0-s--3YUDp","u-flex-grow-1-s":"u-flex-grow-1-s--FLqvm","u-flex-shrink-0-s":"u-flex-shrink-0-s--SvoWo","u-flex-shrink-1-s":"u-flex-shrink-1-s--P84ev","u-flex-m":"u-flex-m--1Y3Er","u-inline-flex-m":"u-inline-flex-m--35LYV","u-flex-none-m":"u-flex-none-m--22TN5","u-flex-column-m":"u-flex-column-m--3Q_9D","u-flex-row-m":"u-flex-row-m--Up1oP","u-flex-wrap-m":"u-flex-wrap-m--2TD_s","u-flex-nowrap-m":"u-flex-nowrap-m--38LMk","u-flex-wrap-reverse-m":"u-flex-wrap-reverse-m--2iSic","u-flex-column-reverse-m":"u-flex-column-reverse-m--1SE83","u-flex-row-reverse-m":"u-flex-row-reverse-m--1hh5_","u-flex-auto-m":"u-flex-auto-m--LkF1x","u-flex-items-start-m":"u-flex-items-start-m--8Tp6J","u-flex-items-end-m":"u-flex-items-end-m--Dex4S","u-flex-items-center-m":"u-flex-items-center-m--2lZuF","u-flex-items-baseline-m":"u-flex-items-baseline-m--2XzRV","u-flex-items-stretch-m":"u-flex-items-stretch-m--285gK","u-flex-self-start-m":"u-flex-self-start-m--1dLa7","u-flex-self-end-m":"u-flex-self-end-m--3v-s2","u-flex-self-center-m":"u-flex-self-center-m--32ILF","u-flex-self-baseline-m":"u-flex-self-baseline-m--2NPnA","u-flex-self-stretch-m":"u-flex-self-stretch-m--2ssUS","u-flex-justify-start-m":"u-flex-justify-start-m--17_4p","u-flex-justify-end-m":"u-flex-justify-end-m--1UJG-","u-flex-justify-center-m":"u-flex-justify-center-m--2WuOM","u-flex-justify-between-m":"u-flex-justify-between-m--6sNpY","u-flex-justify-around-m":"u-flex-justify-around-m--S1Mtb","u-flex-content-start-m":"u-flex-content-start-m--3EPkS","u-flex-content-end-m":"u-flex-content-end-m--2n1W7","u-flex-content-center-m":"u-flex-content-center-m--3zFFn","u-flex-content-between-m":"u-flex-content-between-m--2m-yz","u-flex-content-around-m":"u-flex-content-around-m--1-pLV","u-flex-content-stretch-m":"u-flex-content-stretch-m--3P3KS","u-flex-order-0-m":"u-flex-order-0-m--14kGe","u-flex-order-1-m":"u-flex-order-1-m--2fQ0L","u-flex-order-2-m":"u-flex-order-2-m--18wWP","u-flex-order-3-m":"u-flex-order-3-m--2SkKY","u-flex-order-4-m":"u-flex-order-4-m--3Uy-J","u-flex-order-5-m":"u-flex-order-5-m--3aCE_","u-flex-order-6-m":"u-flex-order-6-m--3vF4-","u-flex-order-7-m":"u-flex-order-7-m--3wAiY","u-flex-order-8-m":"u-flex-order-8-m--1yOzx","u-flex-order-last-m":"u-flex-order-last-m--19U6a","u-flex-grow-0-m":"u-flex-grow-0-m--2Q7VJ","u-flex-grow-1-m":"u-flex-grow-1-m--eTqOm","u-flex-shrink-0-m":"u-flex-shrink-0-m--KXk7-","u-flex-shrink-1-m":"u-flex-shrink-1-m--20926","u-nolist":"u-nolist--3F7JW","u-nolist-t":"u-nolist-t--3BxA6","u-nolist-s":"u-nolist-s--1ZOyZ","u-nolist-m":"u-nolist-m--3Bkyb","u-o-100":"u-o-100--2qad-","u-o-90":"u-o-90--NuNtO","u-o-80":"u-o-80--18KvO","u-o-70":"u-o-70--mkgyE","u-o-60":"u-o-60--2a_eL","u-o-50":"u-o-50--2pxWq","u-o-40":"u-o-40--27sIg","u-o-30":"u-o-30--2i4gP","u-o-20":"u-o-20--1pDqb","u-o-10":"u-o-10--1mUpe","u-o-05":"u-o-05--1H0uD","u-o-025":"u-o-025--22NxD","u-o-0":"u-o-0--7GTd2","u-ov-visible":"u-ov-visible--5lv2P","u-ov-hidden":"u-ov-hidden--sWwpY","u-ov-scroll":"u-ov-scroll--3HLgf","u-ov-auto":"u-ov-auto--1O4II","u-pos-absolute":"u-pos-absolute--zocdo","u-pos-relative":"u-pos-relative--2MWm8","u-pos-fixed":"u-pos-fixed--1vQ4F","u-pos-sticky":"u-pos-sticky--XmUk9","u-pos-static":"u-pos-static--1dFKE","u-pos-absolute-t":"u-pos-absolute-t--1-4su","u-pos-relative-t":"u-pos-relative-t--15QQT","u-pos-fixed-t":"u-pos-fixed-t--3m6ti","u-pos-sticky-t":"u-pos-sticky-t--3d2mX","u-pos-static-t":"u-pos-static-t--2Zetg","u-pos-absolute-s":"u-pos-absolute-s--1Vcmz","u-pos-relative-s":"u-pos-relative-s--3R2IX","u-pos-fixed-s":"u-pos-fixed-s--gCWNg","u-pos-sticky-s":"u-pos-sticky-s--2c00g","u-pos-static-s":"u-pos-static-s--3iDSN","u-pos-absolute-m":"u-pos-absolute-m--3LduC","u-pos-relative-m":"u-pos-relative-m--3kk8R","u-pos-fixed-m":"u-pos-fixed-m--KHSz6","u-pos-sticky-m":"u-pos-sticky-m--YaMoQ","u-pos-static-m":"u-pos-static-m--1tuql","u-top-m":"u-top-m--26C5S","u-top-xs":"u-top-xs--1JcbL","u-top-s":"u-top-s--2QQsh","u-top-l":"u-top-l--sZal9","u-top-xl":"u-top-xl--Dwf9M","u-top-xxl":"u-top-xxl--2dsr2","u-top-0":"u-top-0--3BCLN","u-bottom-m":"u-bottom-m--w1kt7","u-bottom-xs":"u-bottom-xs--1rEKy","u-bottom-s":"u-bottom-s--1L52A","u-bottom-l":"u-bottom-l--342ze","u-bottom-xl":"u-bottom-xl--5C-n3","u-bottom-xxl":"u-bottom-xxl--zwlm4","u-bottom-0":"u-bottom-0--1BsqT","u-left-m":"u-left-m--36gt5","u-left-xs":"u-left-xs--2aVvu","u-left-s":"u-left-s--3kE3j","u-left-l":"u-left-l--2d-h1","u-left-xl":"u-left-xl--3hFrA","u-left-xxl":"u-left-xxl--gz965","u-left-0":"u-left-0--29kP6","u-right-m":"u-right-m--2Abg7","u-right-xs":"u-right-xs--17vUt","u-right-s":"u-right-s--3g3Lq","u-right-l":"u-right-l--1J_yB","u-right-xl":"u-right-xl--1SaBe","u-right-xxl":"u-right-xxl--3DXPa","u-right-0":"u-right-0--2tFkX","u-stack-m":"u-stack-m--MWFXD","u-stack-xs":"u-stack-xs--1Y_AK","u-stack-s":"u-stack-s--1drmi","u-stack-l":"u-stack-l--2KZ1g","u-stack-xl":"u-stack-xl--3WkaE","u-stack-xxl":"u-stack-xxl--alb2_","u-row-m":"u-row-m--33TEs","u-row-xs":"u-row-xs--1dOFb","u-row-s":"u-row-s--2UJdF","u-row-l":"u-row-l--Xlnil","u-row-xl":"u-row-xl--1fYA-","u-row-xxl":"u-row-xxl--8R_K7","u-title-h1":"u-title-h1--1SAE6","u-title-h2":"u-title-h2--2bUL8","u-title-h3":"u-title-h3--3yxk1","u-title-h4":"u-title-h4--2gAs1","u-text":"u-text--3RI5Y","u-caption":"u-caption--d81VX","u-uppercase":"u-uppercase--3k7q5","c-input-checkbox--svg":"c-input-checkbox--svg--Bogch","c-input-checkbox-icon":"c-input-checkbox-icon--30X0Q","fil-content":"fil-content--3-eRD","--working":"_--working--2fAwj","spin":"spin--3dzoz"};

/***/ }),

/***/ "9xIA":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("o0o1");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("yXPU");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("lwsE");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("W8MJ");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("7W2i");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("a1gu");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("Nsbk");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _Embeder__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("2eL0");
/* harmony import */ var _URLGetter__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("j70F");
/* harmony import */ var _SuggestionProvider__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("HtmO");








function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6___default()(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6___default()(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_5___default()(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

/* global cozy */





var IntentHandler = /*#__PURE__*/function (_React$Component) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4___default()(IntentHandler, _React$Component);

  var _super = _createSuper(IntentHandler);

  function IntentHandler(props) {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2___default()(this, IntentHandler);

    _this = _super.call(this, props);
    _this.state = {
      component: null,
      service: null,
      intent: null
    };
    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3___default()(IntentHandler, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.startService();
    }
  }, {
    key: "startService",
    value: function () {
      var _startService = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee() {
        var intentId, component, service, intent;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                intentId = this.props.intentId;
                _context.prev = 1;
                _context.next = 4;
                return cozy.client.intents.createService(intentId, window);

              case 4:
                service = _context.sent;
                intent = service.getIntent();

                if (intent.attributes.action === 'OPEN' && intent.attributes.type === 'io.cozy.suggestions') {
                  component = _SuggestionProvider__WEBPACK_IMPORTED_MODULE_10__["default"];
                } else if (intent.attributes.action === 'OPEN' && intent.attributes.type === 'io.cozy.files') {
                  component = _Embeder__WEBPACK_IMPORTED_MODULE_8__["default"];
                } else if (intent.attributes.action === 'GET_URL') {
                  component = _URLGetter__WEBPACK_IMPORTED_MODULE_9__["default"];
                }

                this.setState({
                  component: component,
                  service: service,
                  intent: intent
                });
                _context.next = 13;
                break;

              case 10:
                _context.prev = 10;
                _context.t0 = _context["catch"](1);
                service.throw(_context.t0);

              case 13:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[1, 10]]);
      }));

      function startService() {
        return _startService.apply(this, arguments);
      }

      return startService;
    }()
  }, {
    key: "render",
    value: function render() {
      var _this$state = this.state,
          service = _this$state.service,
          intent = _this$state.intent;
      var ServiceComponent = this.state.component;
      return ServiceComponent ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(ServiceComponent, {
        service: service,
        intent: intent
      }) : null;
    }
  }]);

  return IntentHandler;
}(react__WEBPACK_IMPORTED_MODULE_7___default.a.Component);

/* harmony default export */ __webpack_exports__["default"] = (IntentHandler);

/***/ }),

/***/ "FKqX":
/***/ (function(module) {

module.exports = {"promoteDesktop":{"isActivated":true}};

/***/ }),

/***/ "HtmO":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("MVZn");
/* harmony import */ var _babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("o0o1");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("yXPU");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("lwsE");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("W8MJ");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("7W2i");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("a1gu");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("Nsbk");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _FuzzyPathSearch__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("Opa8");
/* harmony import */ var drive_lib_getFileMimetype__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("Ieni");









function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_7___default()(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_7___default()(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_6___default()(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

/* global cozy */



var TYPE_DIRECTORY = 'directory';

var SuggestionProvider = /*#__PURE__*/function (_React$Component) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5___default()(SuggestionProvider, _React$Component);

  var _super = _createSuper(SuggestionProvider);

  function SuggestionProvider() {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_3___default()(this, SuggestionProvider);

    return _super.apply(this, arguments);
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4___default()(SuggestionProvider, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this = this;

      var intent = this.props.intent;
      this.hasIndexedFiles = false; // re-attach the message listener for the intent to receive the suggestion requests

      window.addEventListener('message', function (event) {
        if (event.origin !== intent.attributes.client) return null;
        var _event$data = event.data,
            query = _event$data.query,
            id = _event$data.id; // sometimes we get messages with undefined query & id, no idea why

        if (query && id) {
          _this.provideSuggestions(query, id, intent);
        }
      });
    }
  }, {
    key: "provideSuggestions",
    value: function () {
      var _provideSuggestions = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee(query, id, intent) {
        var searchResults;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (this.hasIndexedFiles) {
                  _context.next = 3;
                  break;
                }

                _context.next = 3;
                return this.indexFiles();

              case 3:
                searchResults = this.fuzzyPathSearch.search(query);
                window.parent.postMessage({
                  type: "intent-".concat(intent._id, ":data"),
                  id: id,
                  suggestions: searchResults.map(function (result) {
                    return {
                      id: result.id,
                      title: result.name,
                      subtitle: result.path,
                      term: result.name,
                      onSelect: 'open:' + result.url,
                      icon: result.icon
                    };
                  })
                }, intent.attributes.client);

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function provideSuggestions(_x, _x2, _x3) {
        return _provideSuggestions.apply(this, arguments);
      }

      return provideSuggestions;
    }() // fetches pretty much all the files and preloads FuzzyPathSearch

  }, {
    key: "indexFiles",
    value: function () {
      var _indexFiles = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee3() {
        var _this2 = this;

        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                return _context3.abrupt("return", new Promise( /*#__PURE__*/function () {
                  var _ref = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee2(resolve) {
                    var resp, files, folders, notInTrash, notOrphans, normalizedFiles;
                    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee2$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            _context2.next = 2;
                            return cozy.client.fetchJSON('GET', "/data/io.cozy.files/_all_docs?include_docs=true");

                          case 2:
                            resp = _context2.sent;
                            files = resp.rows.filter(function (row) {
                              return !row.doc.hasOwnProperty('views');
                            }).map(function (row) {
                              return _babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_0___default()({
                                id: row.id
                              }, row.doc);
                            });
                            folders = files.filter(function (file) {
                              return file.type === TYPE_DIRECTORY;
                            });

                            notInTrash = function notInTrash(file) {
                              return !file.trashed && !/^\/\.cozy_trash/.test(file.path);
                            };

                            notOrphans = function notOrphans(file) {
                              return folders.find(function (folder) {
                                return folder._id === file.dir_id;
                              }) !== undefined;
                            };

                            normalizedFiles = files.filter(notInTrash).filter(notOrphans).map(function (file) {
                              var isDir = file.type === TYPE_DIRECTORY;
                              var dirId = isDir ? file._id : file.dir_id;
                              var urlToFolder = "".concat(window.location.origin, "/#/folder/").concat(dirId);
                              var path, url;

                              if (isDir) {
                                path = file.path;
                                url = urlToFolder;
                              } else {
                                var parentDir = folders.find(function (folder) {
                                  return folder._id === file.dir_id;
                                });
                                path = parentDir && parentDir.path ? parentDir.path : '';
                                url = "".concat(urlToFolder, "/file/").concat(file._id);
                              }

                              return {
                                id: file._id,
                                name: file.name,
                                path: path,
                                url: url,
                                icon: getIconUrl(file)
                              };
                            });
                            _this2.fuzzyPathSearch = new _FuzzyPathSearch__WEBPACK_IMPORTED_MODULE_9__["default"](normalizedFiles);
                            _this2.hasIndexedFiles = true;
                            resolve();

                          case 11:
                          case "end":
                            return _context2.stop();
                        }
                      }
                    }, _callee2);
                  }));

                  return function (_x4) {
                    return _ref.apply(this, arguments);
                  };
                }()));

              case 1:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function indexFiles() {
        return _indexFiles.apply(this, arguments);
      }

      return indexFiles;
    }()
  }, {
    key: "render",
    value: function render() {
      return null;
    }
  }]);

  return SuggestionProvider;
}(react__WEBPACK_IMPORTED_MODULE_8___default.a.Component);

var iconsContext = __webpack_require__("KZBK");

var icons = iconsContext.keys().reduce(function (acc, item) {
  acc[item.replace(/\.\/icon-type-(.*)\.svg/, '$1')] = iconsContext(item);
  return acc;
}, {});

function getIconUrl(file) {
  var keyIcon = file.type === TYPE_DIRECTORY ? 'folder' : Object(drive_lib_getFileMimetype__WEBPACK_IMPORTED_MODULE_10__["getFileMimetype"])(icons)(file.mime, file.name) || 'files';
  var icon = icons[keyIcon].default;
  return "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='".concat(icon.viewBox, "'>").concat(icon.content, "<use href='#").concat(icon.id, "' x='0' y='0' width='32' height='32'/></svg>").replace(/#/g, '%23');
}

/* harmony default export */ __webpack_exports__["default"] = (SuggestionProvider);

/***/ }),

/***/ "IFEr":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DESKTOP_SOFTWARE_ID", function() { return DESKTOP_SOFTWARE_ID; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "track", function() { return track; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isLinux", function() { return isLinux; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isAndroid", function() { return isAndroid; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isIOS", function() { return isIOS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DESKTOP_BANNER", function() { return DESKTOP_BANNER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NOVIEWER_DESKTOP_CTA", function() { return NOVIEWER_DESKTOP_CTA; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isClientAlreadyInstalled", function() { return isClientAlreadyInstalled; });
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("o0o1");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("yXPU");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var cozy_ui_transpiled_react_helpers_tracker__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("4kcP");
/* harmony import */ var lodash_get__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("mwIZ");
/* harmony import */ var lodash_get__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(lodash_get__WEBPACK_IMPORTED_MODULE_3__);



var DESKTOP_SOFTWARE_ID = 'github.com/cozy-labs/cozy-desktop';

var track = function track(element) {
  var tracker = Object(cozy_ui_transpiled_react_helpers_tracker__WEBPACK_IMPORTED_MODULE_2__["getTracker"])();
  tracker && tracker.push(['trackEvent', 'interaction', 'desktop-prompt', element]);
};
var isLinux = function isLinux() {
  return window.navigator && window.navigator.appVersion.indexOf('Win') === -1 && window.navigator.appVersion.indexOf('Mac') === -1;
};
var isAndroid = function isAndroid() {
  return window.navigator.userAgent && window.navigator.userAgent.indexOf('Android') >= 0;
};
var isIOS = function isIOS() {
  return window.navigator.userAgent && /iPad|iPhone|iPod/.test(window.navigator.userAgent);
};
var DESKTOP_BANNER = 'desktop_banner';
var NOVIEWER_DESKTOP_CTA = 'noviewer_desktop_cta';
var isClientAlreadyInstalled = /*#__PURE__*/function () {
  var _ref = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(client) {
    var _yield$client$query, data;

    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return client.query(client.get('io.cozy.settings', 'clients'));

          case 2:
            _yield$client$query = _context.sent;
            data = _yield$client$query.data;
            return _context.abrupt("return", Object.values(data).some(function (device) {
              return lodash_get__WEBPACK_IMPORTED_MODULE_3___default()(device, 'attributes.software_id') === DESKTOP_SOFTWARE_ID;
            }));

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function isClientAlreadyInstalled(_x) {
    return _ref.apply(this, arguments);
  };
}();

/***/ }),

/***/ "Ieni":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getFileMimetype", function() { return getFileMimetype; });
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("J4zp");
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mime_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("zB2q");
/* harmony import */ var mime_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(mime_types__WEBPACK_IMPORTED_MODULE_1__);



var getMimetypeFromFilename = function getMimetypeFromFilename(name) {
  return mime_types__WEBPACK_IMPORTED_MODULE_1___default.a.lookup(name) || 'application/octet-stream';
};

var mappingMimetypeSubtype = {
  word: 'text',
  text: 'text',
  zip: 'zip',
  pdf: 'pdf',
  spreadsheet: 'sheet',
  excel: 'sheet',
  sheet: 'sheet',
  presentation: 'slide',
  powerpoint: 'slide'
};
var getFileMimetype = function getFileMimetype(collection) {
  return function () {
    var mime = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var mimetype = mime === 'application/octet-stream' ? getMimetypeFromFilename(name.toLowerCase()) : mime;

    var _mimetype$split = mimetype.split('/'),
        _mimetype$split2 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default()(_mimetype$split, 2),
        type = _mimetype$split2[0],
        subtype = _mimetype$split2[1];

    if (collection[type]) {
      return type;
    }

    if (type === 'application') {
      var existingType = subtype.match(Object.keys(mappingMimetypeSubtype).join('|'));
      return existingType ? mappingMimetypeSubtype[existingType[0]] : undefined;
    }

    return undefined;
  };
};

/***/ }),

/***/ "KZBK":
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./icon-type-audio.svg": "hehj",
	"./icon-type-bin.svg": "Qi6R",
	"./icon-type-code.svg": "5lZ0",
	"./icon-type-files.svg": "nhFO",
	"./icon-type-folder.svg": "w0Z6",
	"./icon-type-image.svg": "TD9l",
	"./icon-type-note.svg": "3nSB",
	"./icon-type-pdf.svg": "gbp9",
	"./icon-type-sheet.svg": "0GJX",
	"./icon-type-slide.svg": "f/2S",
	"./icon-type-text.svg": "xNZN",
	"./icon-type-video.svg": "T3Sg",
	"./icon-type-zip.svg": "pr+u"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "KZBK";

/***/ }),

/***/ "LW8N":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var cozy_realtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("oBqo");
/* harmony import */ var cozy_realtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(cozy_realtime__WEBPACK_IMPORTED_MODULE_0__);


var registerClientPlugins = function registerClientPlugins(client) {
  client.registerPlugin(cozy_realtime__WEBPACK_IMPORTED_MODULE_0__["RealtimePlugin"]);
};

/* harmony default export */ __webpack_exports__["default"] = (registerClientPlugins);

/***/ }),

/***/ "OTOu":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var minilog__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("i9cR");
/* harmony import */ var minilog__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(minilog__WEBPACK_IMPORTED_MODULE_0__);
/* global __APP_SLUG__ */

var logger = minilog__WEBPACK_IMPORTED_MODULE_0___default()("cozy-".concat("drive"));
minilog__WEBPACK_IMPORTED_MODULE_0___default.a.enable();
minilog__WEBPACK_IMPORTED_MODULE_0___default.a.suggest.allow("cozy-".concat("drive"), 'log');
minilog__WEBPACK_IMPORTED_MODULE_0___default.a.suggest.allow("cozy-".concat("drive"), 'info');
/* harmony default export */ __webpack_exports__["default"] = (logger);

/***/ }),

/***/ "OjRq":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var cozy_doctypes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("Le8U");
/* harmony import */ var cozy_doctypes__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(cozy_doctypes__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CozyFile", function() { return cozy_doctypes__WEBPACK_IMPORTED_MODULE_0__["CozyFile"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Group", function() { return cozy_doctypes__WEBPACK_IMPORTED_MODULE_0__["Group"]; });

/* harmony import */ var models_Contact__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("/WUI");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Contact", function() { return models_Contact__WEBPACK_IMPORTED_MODULE_1__["default"]; });





/***/ }),

/***/ "Opa8":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("lwsE");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("W8MJ");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var diacritics__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("C9yA");
/* harmony import */ var diacritics__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(diacritics__WEBPACK_IMPORTED_MODULE_2__);



function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

 // Search for keywords inside a list of files and folders, while being permissive regardig the order of words

var FuzzyPathSearch = /*#__PURE__*/function () {
  function FuzzyPathSearch() {
    var files = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, FuzzyPathSearch);

    // files must have a `path` and `name` property
    this.files = files;
    this.previousQuery = [];
    this.previousSuggestions = files;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(FuzzyPathSearch, [{
    key: "search",
    value: function search(query) {
      if (!query) return [];
      var queryArray = Object(diacritics__WEBPACK_IMPORTED_MODULE_2__["remove"])(query.replace(/\//g, ' ').trim().toLowerCase()).split(' ');
      var preparedQuery = queryArray.map(function (word) {
        return {
          word: word,
          isAugmentedWord: false,
          isNewWord: true
        };
      });
      var isQueryAugmented = this.isAugmentingPreviousQuery(preparedQuery);
      var sortedQuery = isQueryAugmented ? this.sortQueryByRevelance(preparedQuery) : this.sortQuerybyLength(preparedQuery);
      var suggestions;

      if (isQueryAugmented && this.previousSuggestions.length !== 0) {
        // the new query is just a more selective version of the previous one, so we narrow down the existing list
        suggestions = this.filterAndScore(this.previousSuggestions, sortedQuery.map(function (segment) {
          return segment.word;
        }));
      } else {
        suggestions = this.filterAndScore(this.files, sortedQuery.map(function (segment) {
          return segment.word;
        }));
      }

      this.previousQuery = sortedQuery;
      this.previousSuggestions = suggestions;
      return suggestions;
    }
  }, {
    key: "isAugmentingPreviousQuery",
    value: function isAugmentingPreviousQuery(query) {
      var _iterator = _createForOfIteratorHelper(query),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var currentQuerySegment = _step.value;
          var isInPreviousQuery = false;

          var _iterator2 = _createForOfIteratorHelper(this.previousQuery),
              _step2;

          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var previousQuerySegment = _step2.value;

              if (currentQuerySegment.word.includes(previousQuerySegment.word)) {
                isInPreviousQuery = true;
                break;
              }
            } // we found a word in the current query that was not included in the previous query, so we consider it a completely new query

          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }

          if (isInPreviousQuery === false) return false;
        } // all words are in the previous query

      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return true;
    }
  }, {
    key: "sortQueryByRevelance",
    value: function sortQueryByRevelance(query) {
      // query terms are sorted in two categories: those that are new or have changed, and therefore may further reduce the set of results, are prioritzed. Those that were there and have not changed come second.
      // finally, longer words are placed first to allow discarding files earlier in the scoring loop
      var priorizedWords = [];
      var wordsFromPreviousQuery = [];

      var _iterator3 = _createForOfIteratorHelper(query),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var currentQuerySegment = _step3.value;
          var wasInPreviousQuery = false;

          var _iterator4 = _createForOfIteratorHelper(this.previousQuery),
              _step4;

          try {
            for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
              var previousQuerySegment = _step4.value;

              if (currentQuerySegment.word.includes(previousQuerySegment.word)) {
                if (currentQuerySegment.word !== previousQuerySegment.word) {
                  currentQuerySegment.isAugmentedWord = true;
                  priorizedWords.push(currentQuerySegment);
                } else {
                  currentQuerySegment.isNewWord = false;
                  wordsFromPreviousQuery.push(currentQuerySegment);
                }

                wasInPreviousQuery = true;
                continue;
              }
            } // this segment wasn't included in any previous query segment so it's a new word and we prioritize it

          } catch (err) {
            _iterator4.e(err);
          } finally {
            _iterator4.f();
          }

          if (!wasInPreviousQuery) priorizedWords.push(currentQuerySegment);
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      return this.sortQuerybyLength(priorizedWords).concat(this.sortQuerybyLength(wordsFromPreviousQuery));
    }
  }, {
    key: "sortQuerybyLength",
    value: function sortQuerybyLength(query) {
      return query.sort(function (a, b) {
        return b.word.length - a.word.length;
      });
    }
  }, {
    key: "filterAndScore",
    value: function filterAndScore(files, words) {
      var suggestions = [];
      files.forEach(function (file) {
        var fileScore = 0;
        var pathArray = Object(diacritics__WEBPACK_IMPORTED_MODULE_2__["remove"])((file.path + '/' + file.name).toLowerCase()).split('/').filter(function (pathChunk) {
          return !!pathChunk;
        });

        var _iterator5 = _createForOfIteratorHelper(words),
            _step5;

        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            var word = _step5.value;
            // let the magic begin...
            // essentialy, matched words that are at the end of the path get better scores
            var wordScore = 0;
            var wordOccurenceValue = 10000;
            var firstOccurence = true;
            var maxDepth = pathArray.length;

            for (var depth = 0; depth < maxDepth; ++depth) {
              var dirName = pathArray[depth];

              if (dirName.includes(word)) {
                if (firstOccurence) {
                  wordOccurenceValue = 52428800; // that's 2^19 * 100

                  wordScore += wordOccurenceValue / 2 * (1 + word.length / dirName.length);
                  firstOccurence = false;
                } else {
                  wordScore -= wordOccurenceValue * (1 - word.length / dirName.length);
                }

                wordOccurenceValue /= 2;
              } else {
                wordScore -= wordOccurenceValue;
                wordOccurenceValue /= 2;

                if (depth === maxDepth - 1) {
                  // make the penality bigger if the last part of the path doesn't include the word at all
                  wordScore /= 2;
                }
              }

              wordOccurenceValue /= 2;
            }

            if (wordScore < 0) return;
            fileScore += wordScore;
          }
        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
        }

        if (fileScore > 0) {
          suggestions.push({
            file: file,
            score: fileScore
          });
        }
      });
      suggestions.sort(function (a, b) {
        var score = b.score - a.score;
        return score !== 0 ? score : a.file.path.localeCompare(b.file.path);
      });
      return suggestions.map(function (suggestion) {
        return suggestion.file;
      });
    }
  }]);

  return FuzzyPathSearch;
}();

/* harmony default export */ __webpack_exports__["default"] = (FuzzyPathSearch);

/***/ }),

/***/ "PhqT":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
module.exports = {"CozyTheme--normal":"CozyTheme--normal--3rdSw","pho-viewer-noviewer-cta":"pho-viewer-noviewer-cta--2RT0a","pho-viewer-noviewer-cta-cross":"pho-viewer-noviewer-cta-cross--1E-8f"};

/***/ }),

/***/ "Qi6R":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var svg_baker_runtime_browser_symbol__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("4BeY");
/* harmony import */ var svg_baker_runtime_browser_symbol__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(svg_baker_runtime_browser_symbol__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var svg_sprite_loader_runtime_browser_sprite_build__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("IaFt");
/* harmony import */ var svg_sprite_loader_runtime_browser_sprite_build__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(svg_sprite_loader_runtime_browser_sprite_build__WEBPACK_IMPORTED_MODULE_1__);


var symbol = new svg_baker_runtime_browser_symbol__WEBPACK_IMPORTED_MODULE_0___default.a({
  "id": "icon-type-bin_37ea77f144ebbef7aab118258b0f643e",
  "use": "icon-type-bin_37ea77f144ebbef7aab118258b0f643e-usage",
  "viewBox": "0 0 32 32",
  "content": "<symbol xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\" id=\"icon-type-bin_37ea77f144ebbef7aab118258b0f643e\">\n  <g fill=\"none\" fill-rule=\"evenodd\" transform=\"translate(3)\">\n    <path fill=\"#D1D5DB\" d=\"M0,2.00174332 C0,0.89621101 0.890925393,0 1.99742191,0 L19,0 L26,7 L26,29.9964051 C26,31.10296 25.1050211,32 24.0029953,32 L1.99700466,32 C0.89408944,32 0,31.1107383 0,29.9982567 L0,2.00174332 Z\" />\n    <path fill=\"#A3ACB8\" d=\"M18.5,8.57092175e-14 C18.2238576,1.33045111e-13 18,0.230796814 18,0.500435829 L18,8 L25.4995642,8 C25.7759472,8 26,7.76806641 26,7.5 L26,7 L19,0 L18.5,8.57092175e-14 Z\" />\n    <path fill=\"#4F5B69\" d=\"M4,15.5675676 C4,14.971332 4.05925097,14.4488147 4.17775468,14 C4.29625839,13.5511853 4.46309664,13.1793627 4.67827443,12.8845209 C4.89345222,12.5896791 5.15072615,12.3685511 5.45010395,12.2211302 C5.74948175,12.0737093 6.08315824,12 6.45114345,12 C7.23701017,12 7.84199372,12.2899234 8.26611227,12.8697789 C8.69023081,13.4496343 8.9022869,14.3488883 8.9022869,15.5675676 C8.9022869,16.1703552 8.84303594,16.6961485 8.72453222,17.1449631 C8.60602851,17.5937778 8.43919027,17.9672385 8.22401247,18.2653563 C8.00883468,18.5634741 7.75000151,18.78624 7.4475052,18.9336609 C7.14500888,19.0810818 6.80977315,19.1547912 6.44178794,19.1547912 C5.64968419,19.1547912 5.04470063,18.8484879 4.62681913,18.2358722 C4.20893762,17.6232566 4,16.7338306 4,15.5675676 L4,15.5675676 Z M7.7047817,15.5675676 C7.7047817,15.4627349 7.70322247,15.3628178 7.70010395,15.2678133 C7.69698543,15.1728087 7.69230772,15.0794435 7.68607069,14.987715 L5.39397089,17.1793612 C5.58731905,17.7755968 5.93970638,18.0737101 6.45114345,18.0737101 C6.85031385,18.0737101 7.15904257,17.8738759 7.37733888,17.4742015 C7.59563519,17.0745271 7.7047817,16.4389888 7.7047817,15.5675676 L7.7047817,15.5675676 Z M5.1975052,15.5675676 C5.1975052,15.6658482 5.19906443,15.7592133 5.20218295,15.8476658 C5.20530147,15.9361184 5.20997918,16.0262076 5.21621622,16.1179361 L7.4989605,13.9262899 C7.31184938,13.3628145 6.95946205,13.0810811 6.44178794,13.0810811 C6.04261755,13.0810811 5.73544806,13.2825533 5.52027027,13.6855037 C5.30509248,14.0884541 5.1975052,14.7158025 5.1975052,15.5675676 L5.1975052,15.5675676 Z M10.5488565,15.5675676 C10.5488565,14.971332 10.6081075,14.4488147 10.7266112,14 C10.8451149,13.5511853 11.0119532,13.1793627 11.227131,12.8845209 C11.4423088,12.5896791 11.6995827,12.3685511 11.9989605,12.2211302 C12.2983383,12.0737093 12.6320148,12 13,12 C13.7858667,12 14.3908503,12.2899234 14.8149688,12.8697789 C15.2390874,13.4496343 15.4511435,14.3488883 15.4511435,15.5675676 C15.4511435,16.1703552 15.3918925,16.6961485 15.2733888,17.1449631 C15.1548851,17.5937778 14.9880468,17.9672385 14.772869,18.2653563 C14.5576912,18.5634741 14.2988581,18.78624 13.9963617,18.9336609 C13.6938654,19.0810818 13.3586297,19.1547912 12.9906445,19.1547912 C12.1985407,19.1547912 11.5935572,18.8484879 11.1756757,18.2358722 C10.7577942,17.6232566 10.5488565,16.7338306 10.5488565,15.5675676 L10.5488565,15.5675676 Z M14.2536383,15.5675676 C14.2536383,15.4627349 14.252079,15.3628178 14.2489605,15.2678133 C14.245842,15.1728087 14.2411643,15.0794435 14.2349272,14.987715 L11.9428274,17.1793612 C12.1361756,17.7755968 12.4885629,18.0737101 13,18.0737101 C13.3991704,18.0737101 13.7078991,17.8738759 13.9261954,17.4742015 C14.1444917,17.0745271 14.2536383,16.4389888 14.2536383,15.5675676 L14.2536383,15.5675676 Z M11.7463617,15.5675676 C11.7463617,15.6658482 11.747921,15.7592133 11.7510395,15.8476658 C11.754158,15.9361184 11.7588357,16.0262076 11.7650728,16.1179361 L14.047817,13.9262899 C13.8607059,13.3628145 13.5083186,13.0810811 12.9906445,13.0810811 C12.5914741,13.0810811 12.2843046,13.2825533 12.0691268,13.6855037 C11.853949,14.0884541 11.7463617,14.7158025 11.7463617,15.5675676 L11.7463617,15.5675676 Z M17.7338877,17.9361179 L19.1652807,17.9361179 L19.1652807,13.6412776 L17.9303534,14.6339066 L17.3690229,13.8476658 L19.502079,12.1375921 L20.3253638,12.1375921 L20.3253638,17.9361179 L21.7286902,17.9361179 L21.7286902,19.017199 L17.7338877,19.017199 L17.7338877,17.9361179 Z M4,24.4127764 C4,23.8165408 4.05925097,23.2940235 4.17775468,22.8452088 C4.29625839,22.3963942 4.46309664,22.0245715 4.67827443,21.7297297 C4.89345222,21.434888 5.15072615,21.21376 5.45010395,21.0663391 C5.74948175,20.9189182 6.08315824,20.8452088 6.45114345,20.8452088 C7.23701017,20.8452088 7.84199372,21.1351322 8.26611227,21.7149877 C8.69023081,22.2948432 8.9022869,23.1940971 8.9022869,24.4127764 C8.9022869,25.015564 8.84303594,25.5413573 8.72453222,25.990172 C8.60602851,26.4389867 8.43919027,26.8124473 8.22401247,27.1105651 C8.00883468,27.4086829 7.75000151,27.6314489 7.4475052,27.7788698 C7.14500888,27.9262907 6.80977315,28 6.44178794,28 C5.64968419,28 5.04470063,27.6936968 4.62681913,27.0810811 C4.20893762,26.4684654 4,25.5790394 4,24.4127764 L4,24.4127764 Z M7.7047817,24.4127764 C7.7047817,24.3079438 7.70322247,24.2080267 7.70010395,24.1130221 C7.69698543,24.0180175 7.69230772,23.9246524 7.68607069,23.8329238 L5.39397089,26.02457 C5.58731905,26.6208056 5.93970638,26.9189189 6.45114345,26.9189189 C6.85031385,26.9189189 7.15904257,26.7190847 7.37733888,26.3194103 C7.59563519,25.9197359 7.7047817,25.2841976 7.7047817,24.4127764 L7.7047817,24.4127764 Z M5.1975052,24.4127764 C5.1975052,24.511057 5.19906443,24.6044222 5.20218295,24.6928747 C5.20530147,24.7813272 5.20997918,24.8714164 5.21621622,24.963145 L7.4989605,22.7714988 C7.31184938,22.2080234 6.95946205,21.9262899 6.44178794,21.9262899 C6.04261755,21.9262899 5.73544806,22.1277621 5.52027027,22.5307125 C5.30509248,22.9336629 5.1975052,23.5610113 5.1975052,24.4127764 L5.1975052,24.4127764 Z M11.1850312,26.7813268 L12.6164241,26.7813268 L12.6164241,22.4864865 L11.3814969,23.4791155 L10.8201663,22.6928747 L12.9532225,20.982801 L13.7765073,20.982801 L13.7765073,26.7813268 L15.1798337,26.7813268 L15.1798337,27.8624079 L11.1850312,27.8624079 L11.1850312,26.7813268 Z M17.0977131,24.4127764 C17.0977131,23.8165408 17.1569641,23.2940235 17.2754678,22.8452088 C17.3939715,22.3963942 17.5608097,22.0245715 17.7759875,21.7297297 C17.9911653,21.434888 18.2484393,21.21376 18.547817,21.0663391 C18.8471948,20.9189182 19.1808713,20.8452088 19.5488565,20.8452088 C20.3347233,20.8452088 20.9397068,21.1351322 21.3638254,21.7149877 C21.7879439,22.2948432 22,23.1940971 22,24.4127764 C22,25.015564 21.940749,25.5413573 21.8222453,25.990172 C21.7037416,26.4389867 21.5369034,26.8124473 21.3217256,27.1105651 C21.1065478,27.4086829 20.8477146,27.6314489 20.5452183,27.7788698 C20.242722,27.9262907 19.9074862,28 19.539501,28 C18.7473973,28 18.1424137,27.6936968 17.7245322,27.0810811 C17.3066507,26.4684654 17.0977131,25.5790394 17.0977131,24.4127764 L17.0977131,24.4127764 Z M20.8024948,24.4127764 C20.8024948,24.3079438 20.8009356,24.2080267 20.797817,24.1130221 C20.7946985,24.0180175 20.7900208,23.9246524 20.7837838,23.8329238 L18.491684,26.02457 C18.6850322,26.6208056 19.0374195,26.9189189 19.5488565,26.9189189 C19.9480269,26.9189189 20.2567557,26.7190847 20.475052,26.3194103 C20.6933483,25.9197359 20.8024948,25.2841976 20.8024948,24.4127764 L20.8024948,24.4127764 Z M18.2952183,24.4127764 C18.2952183,24.511057 18.2967775,24.6044222 18.299896,24.6928747 C18.3030146,24.7813272 18.3076923,24.8714164 18.3139293,24.963145 L20.5966736,22.7714988 C20.4095625,22.2080234 20.0571751,21.9262899 19.539501,21.9262899 C19.1403306,21.9262899 18.8331612,22.1277621 18.6179834,22.5307125 C18.4028056,22.9336629 18.2952183,23.5610113 18.2952183,24.4127764 L18.2952183,24.4127764 Z\" />\n  </g>\n</symbol>"
});
var result = svg_sprite_loader_runtime_browser_sprite_build__WEBPACK_IMPORTED_MODULE_1___default.a.add(symbol);
/* harmony default export */ __webpack_exports__["default"] = (symbol);

/***/ }),

/***/ "T3Sg":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var svg_baker_runtime_browser_symbol__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("4BeY");
/* harmony import */ var svg_baker_runtime_browser_symbol__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(svg_baker_runtime_browser_symbol__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var svg_sprite_loader_runtime_browser_sprite_build__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("IaFt");
/* harmony import */ var svg_sprite_loader_runtime_browser_sprite_build__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(svg_sprite_loader_runtime_browser_sprite_build__WEBPACK_IMPORTED_MODULE_1__);


var symbol = new svg_baker_runtime_browser_symbol__WEBPACK_IMPORTED_MODULE_0___default.a({
  "id": "icon-type-video_efbe0710a085efd6387e86cadaf16503",
  "use": "icon-type-video_efbe0710a085efd6387e86cadaf16503-usage",
  "viewBox": "0 0 32 32",
  "content": "<symbol xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\" id=\"icon-type-video_efbe0710a085efd6387e86cadaf16503\">\n  <g fill=\"none\" fill-rule=\"evenodd\" transform=\"translate(1 1)\">\n    <path fill=\"#FFC5CE\" d=\"M0,1.99161703 C0,0.891677316 0.89784041,0 1.99161703,0 L28.008383,0 C29.1083227,0 30,0.89784041 30,1.99161703 L30,28.008383 C30,29.1083227 29.1021596,30 28.008383,30 L1.99161703,30 C0.891677316,30 0,29.1021596 0,28.008383 L0,1.99161703 Z M1,14.0093689 C1,13.4519098 1.44335318,13 2.0093689,13 L3.9906311,13 C4.54809015,13 5,13.4433532 5,14.0093689 L5,15.9906311 C5,16.5480902 4.55664682,17 3.9906311,17 L2.0093689,17 C1.45190985,17 1,16.5566468 1,15.9906311 L1,14.0093689 Z M25,14.0093689 C25,13.4519098 25.4433532,13 26.0093689,13 L27.9906311,13 C28.5480902,13 29,13.4433532 29,14.0093689 L29,15.9906311 C29,16.5480902 28.5566468,17 27.9906311,17 L26.0093689,17 C25.4519098,17 25,16.5566468 25,15.9906311 L25,14.0093689 Z M1,7.99980749 C1,7.44762906 1.44335318,7 2.0093689,7 L3.9906311,7 C4.54809015,7 5,7.44371665 5,7.99980749 L5,11.0001925 C5,11.5523709 4.55664682,12 3.9906311,12 L2.0093689,12 C1.45190985,12 1,11.5562834 1,11.0001925 L1,7.99980749 Z M25,7.99980749 C25,7.44762906 25.4433532,7 26.0093689,7 L27.9906311,7 C28.5480902,7 29,7.44371665 29,7.99980749 L29,11.0001925 C29,11.5523709 28.5566468,12 27.9906311,12 L26.0093689,12 C25.4519098,12 25,11.5562834 25,11.0001925 L25,7.99980749 Z M1,24.9998075 C1,24.4476291 1.44335318,24 2.0093689,24 L3.9906311,24 C4.54809015,24 5,24.4437166 5,24.9998075 L5,28.0001925 C5,28.5523709 4.55664682,29 3.9906311,29 L2.0093689,29 C1.45190985,29 1,28.5562834 1,28.0001925 L1,24.9998075 Z M25,24.9998075 C25,24.4476291 25.4433532,24 26.0093689,24 L27.9906311,24 C28.5480902,24 29,24.4437166 29,24.9998075 L29,28.0001925 C29,28.5523709 28.5566468,29 27.9906311,29 L26.0093689,29 C25.4519098,29 25,28.5562834 25,28.0001925 L25,24.9998075 Z M1,1.99980749 C1,1.44762906 1.44335318,1 2.0093689,1 L3.9906311,1 C4.54809015,1 5,1.44371665 5,1.99980749 L5,5.00019251 C5,5.55237094 4.55664682,6 3.9906311,6 L2.0093689,6 C1.45190985,6 1,5.55628335 1,5.00019251 L1,1.99980749 Z M25,1.99980749 C25,1.44762906 25.4433532,1 26.0093689,1 L27.9906311,1 C28.5480902,1 29,1.44371665 29,1.99980749 L29,5.00019251 C29,5.55237094 28.5566468,6 27.9906311,6 L26.0093689,6 C25.4519098,6 25,5.55628335 25,5.00019251 L25,1.99980749 Z M1,18.9998075 C1,18.4476291 1.44335318,18 2.0093689,18 L3.9906311,18 C4.54809015,18 5,18.4437166 5,18.9998075 L5,22.0001925 C5,22.5523709 4.55664682,23 3.9906311,23 L2.0093689,23 C1.45190985,23 1,22.5562834 1,22.0001925 L1,18.9998075 Z M25,18.9998075 C25,18.4476291 25.4433532,18 26.0093689,18 L27.9906311,18 C28.5480902,18 29,18.4437166 29,18.9998075 L29,22.0001925 C29,22.5523709 28.5566468,23 27.9906311,23 L26.0093689,23 C25.4519098,23 25,22.5562834 25,22.0001925 L25,18.9998075 Z\" />\n    <path fill=\"#FF405D\" d=\"M11,9.61464155 C11,9.06099084 11.3798008,8.84004874 11.8525944,9.12372488 L20.1474056,14.1006116 C20.6182805,14.3831366 20.6201992,14.8400487 20.1474056,15.1237249 L11.8525944,20.1006116 C11.3817195,20.3831366 11,20.1564073 11,19.609695 L11,9.61464155 Z\" />\n  </g>\n</symbol>"
});
var result = svg_sprite_loader_runtime_browser_sprite_build__WEBPACK_IMPORTED_MODULE_1___default.a.add(symbol);
/* harmony default export */ __webpack_exports__["default"] = (symbol);

/***/ }),

/***/ "TD9l":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var svg_baker_runtime_browser_symbol__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("4BeY");
/* harmony import */ var svg_baker_runtime_browser_symbol__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(svg_baker_runtime_browser_symbol__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var svg_sprite_loader_runtime_browser_sprite_build__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("IaFt");
/* harmony import */ var svg_sprite_loader_runtime_browser_sprite_build__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(svg_sprite_loader_runtime_browser_sprite_build__WEBPACK_IMPORTED_MODULE_1__);


var symbol = new svg_baker_runtime_browser_symbol__WEBPACK_IMPORTED_MODULE_0___default.a({
  "id": "icon-type-image_5a0af3714e77328d0c04b0d83712f645",
  "use": "icon-type-image_5a0af3714e77328d0c04b0d83712f645-usage",
  "viewBox": "0 0 32 32",
  "content": "<symbol xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\" id=\"icon-type-image_5a0af3714e77328d0c04b0d83712f645\">\n  <g fill=\"none\" fill-rule=\"evenodd\" transform=\"translate(0 3)\">\n    <rect width=\"32\" height=\"26\" fill=\"#8EE39B\" rx=\"2\" />\n    <path fill=\"#1EC737\" d=\"M0,20 L6.29028051,13.7097195 C6.68224776,13.3177522 7.31387329,13.3138733 7.70591205,13.7059121 L11,17 L19.2937851,8.7062149 C19.6838168,8.31618318 20.320971,8.32097101 20.7058543,8.70585426 L32,20 L32,24.0020869 C32,25.1055038 31.1107383,26 29.9982567,26 L2.00174332,26 C0.89621101,26 0,25.1017394 0,24.0020869 L0,20 Z\" />\n    <circle cx=\"8\" cy=\"7\" r=\"3\" fill=\"#FFFFFF\" />\n    <path stroke=\"#8EE39B\" d=\"M11,16 L5.5,21.5 L11,16 Z\" stroke-linecap=\"round\" stroke-linejoin=\"round\" />\n  </g>\n</symbol>"
});
var result = svg_sprite_loader_runtime_browser_sprite_build__WEBPACK_IMPORTED_MODULE_1___default.a.add(symbol);
/* harmony default export */ __webpack_exports__["default"] = (symbol);

/***/ }),

/***/ "VL2R":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("o0o1");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("yXPU");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("lwsE");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("W8MJ");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("PJYZ");
/* harmony import */ var _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("7W2i");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("a1gu");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("Nsbk");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("lSNA");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var cozy_ui_transpiled_react_Icon__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("y6ex");
/* harmony import */ var cozy_client__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("SH7X");
/* harmony import */ var cozy_client__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(cozy_client__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var localforage__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("oAJy");
/* harmony import */ var localforage__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(localforage__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var components_pushClient__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__("IFEr");
/* harmony import */ var _styles_styl__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__("PhqT");
/* harmony import */ var _styles_styl__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(_styles_styl__WEBPACK_IMPORTED_MODULE_14__);
/* harmony import */ var drive_config_config_json__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__("FKqX");
var drive_config_config_json__WEBPACK_IMPORTED_MODULE_15___namespace = /*#__PURE__*/__webpack_require__.t("FKqX", 1);
/* harmony import */ var cozy_ui_transpiled_react_palette__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__("7jrE");
/* harmony import */ var cozy_ui_transpiled_react_palette__WEBPACK_IMPORTED_MODULE_16___default = /*#__PURE__*/__webpack_require__.n(cozy_ui_transpiled_react_palette__WEBPACK_IMPORTED_MODULE_16__);










function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_7___default()(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_7___default()(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_6___default()(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }










var CallToAction = /*#__PURE__*/function (_Component) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5___default()(CallToAction, _Component);

  var _super = _createSuper(CallToAction);

  function CallToAction() {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2___default()(this, CallToAction);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_8___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "state", {
      mustShow: false
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_8___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4___default()(_this), "markAsSeen", function () {
      localforage__WEBPACK_IMPORTED_MODULE_12___default.a.setItem(components_pushClient__WEBPACK_IMPORTED_MODULE_13__["NOVIEWER_DESKTOP_CTA"], true);

      _this.setState({
        mustShow: false
      });
    });

    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3___default()(CallToAction, [{
    key: "componentDidMount",
    value: function () {
      var _componentDidMount = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee() {
        var seen, mustSee;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(drive_config_config_json__WEBPACK_IMPORTED_MODULE_15__.promoteDesktop.isActivated !== true)) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt("return");

              case 2:
                _context.next = 4;
                return localforage__WEBPACK_IMPORTED_MODULE_12___default.a.getItem(components_pushClient__WEBPACK_IMPORTED_MODULE_13__["NOVIEWER_DESKTOP_CTA"]);

              case 4:
                _context.t0 = _context.sent;

                if (_context.t0) {
                  _context.next = 7;
                  break;
                }

                _context.t0 = false;

              case 7:
                seen = _context.t0;

                if (seen) {
                  _context.next = 19;
                  break;
                }

                _context.prev = 9;
                _context.next = 12;
                return Object(components_pushClient__WEBPACK_IMPORTED_MODULE_13__["isClientAlreadyInstalled"])(this.props.client);

              case 12:
                mustSee = !_context.sent;

                if (mustSee) {
                  this.setState({
                    mustShow: true
                  });
                }

                _context.next = 19;
                break;

              case 16:
                _context.prev = 16;
                _context.t1 = _context["catch"](9);
                this.setState({
                  mustShow: false
                });

              case 19:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[9, 16]]);
      }));

      function componentDidMount() {
        return _componentDidMount.apply(this, arguments);
      }

      return componentDidMount;
    }()
  }, {
    key: "render",
    value: function render() {
      if (!this.state.mustShow || drive_config_config_json__WEBPACK_IMPORTED_MODULE_15__.promoteDesktop.isActivated !== true) return null;
      var t = this.props.t;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_9___default.a.createElement("div", {
        className: _styles_styl__WEBPACK_IMPORTED_MODULE_14___default.a['pho-viewer-noviewer-cta']
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_9___default.a.createElement(cozy_ui_transpiled_react_Icon__WEBPACK_IMPORTED_MODULE_10__["default"], {
        className: _styles_styl__WEBPACK_IMPORTED_MODULE_14___default.a['pho-viewer-noviewer-cta-cross'],
        color: cozy_ui_transpiled_react_palette__WEBPACK_IMPORTED_MODULE_16___default.a.white,
        icon: "cross",
        onClick: this.markAsSeen
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_9___default.a.createElement("h3", null, t('Viewer.noviewer.cta.saveTime')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_9___default.a.createElement("ul", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_9___default.a.createElement("li", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_9___default.a.createElement("a", {
        //eslint-disable-next-line react/jsx-no-target-blank
        target: "_blank",
        href: t(Object(components_pushClient__WEBPACK_IMPORTED_MODULE_13__["isLinux"])() ? 'Nav.link-client' : 'Nav.link-client-desktop')
      }, t('Viewer.noviewer.cta.installDesktop'))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_9___default.a.createElement("li", null, t('Viewer.noviewer.cta.accessFiles'))));
    }
  }]);

  return CallToAction;
}(react__WEBPACK_IMPORTED_MODULE_9__["Component"]);

/* harmony default export */ __webpack_exports__["default"] = (Object(cozy_client__WEBPACK_IMPORTED_MODULE_11__["withClient"])(CallToAction));

/***/ }),

/***/ "XA+M":
/***/ (function(module, exports) {

module.exports = {"name":"Drive","name_prefix":"Cozy","slug":"drive","version":"1.27.0","type":"webapp","licence":"AGPL-3.0","icon":"public/app-icon.svg","categories":["cozy"],"source":"https://github.com/cozy/cozy-drive","editor":"Cozy","developer":{"name":"Cozy Cloud","url":"https://cozy.io"},"locales":{"en":{"short_description":"Cozy Drive helps you to save, sync and secure your files on your Cozy.","long_description":"With Cozy Drive, you can easily:\n- Store your important files and keep them secure in your Cozy\n- Access to all your documents online & offline, from your desktop, and on your smartphone or tablet\n- Share links to files ans folders with who you like;\n- Automatically retrieve bills, payrolls, tax notices and other data from your main online services (internet, energy, retail, mobile, energy, travel...)\n- Upload files to your Cozy from your Android","screenshots":["screenshots/en/screenshot01.png","screenshots/en/screenshot02.png","screenshots/en/screenshot03.png","screenshots/en/screenshot04.png"]},"fr":{"short_description":"Cozy Drive est l’application de sauvegarde, de synchronisation et de sécurisation de tous vos fichiers sur Cozy.","long_description":"Avec Cozy Drive vous pourrez :\n- Sauvegarder et synchroniser gratuitement tous vos documents importants (carte d’identité, photos de vacances, avis d’imposition, fiches de salaires…);\n- Accéder à vos documents n’importe quand, n’importe ou même en mode avion depuis votre bureau, votre smartphone ou tablette;\n- Partager vos fichiers et dossiers par lien avec qui vous le souhaitez;\n- Récupérer automatiquement vos documents administratifs de vos principaux fournisseurs de service (opérateur mobile, fournisseur d’énergie, assureur, internet, santé…);\n- Rester synchronisé·e lors de vos voyages et déplacements professionnels avec nos applications mobiles.","screenshots":["screenshots/fr/screenshot01.png","screenshots/fr/screenshot02.png","screenshots/fr/screenshot03.png","screenshots/fr/screenshot04.png"]}},"screenshots":["screenshots/fr/screenshot01.png","screenshots/fr/screenshot02.png","screenshots/fr/screenshot03.png","screenshots/fr/screenshot04.png"],"langs":["en","fr"],"platforms":[{"type":"ios","url":"https://itunes.apple.com/us/app/cozy-drive/id1224102389?mt=8"},{"type":"android","url":"https://play.google.com/store/apps/details?id=io.cozy.drive.mobile"}],"routes":{"/":{"folder":"/","index":"index.html","public":false},"/intents":{"folder":"/intents","index":"index.html","public":false},"/public":{"folder":"/public","index":"index.html","public":true},"/preview":{"folder":"/public","index":"index.html","public":true}},"intents":[{"action":"OPEN","type":["io.cozy.files"],"href":"/intents"},{"action":"GET_URL","type":["io.cozy.files"],"href":"/intents"},{"action":"OPEN","type":["io.cozy.suggestions"],"href":"/intents"}],"permissions":{"files":{"description":"Required to access the files","type":"io.cozy.files","verbs":["ALL"]},"filesversions":{"type":"io.cozy.files.versions","vebrs":["ALL"]},"apps":{"description":"Required by the cozy-bar to display the icons of the apps","type":"io.cozy.apps","verbs":["GET"]},"albums":{"description":"Required to manage photos albums","type":"io.cozy.photos.albums","verbs":["PUT"]},"contacts":{"type":"io.cozy.contacts","verbs":["GET","POST"]},"groups":{"type":"io.cozy.contacts.groups","verbs":["GET"]},"settings":{"description":"Required by the cozy-bar to display Claudy and know which applications are coming soon","type":"io.cozy.settings","verbs":["GET"]},"oauth":{"description":"Required to display the cozy-desktop banner","type":"io.cozy.oauth.clients","verbs":["GET"]},"reporting":{"description":"Allow to report unexpected errors to the support team","type":"cc.cozycloud.sentry","verbs":["POST"]},"mail":{"description":"Send feedback emails to the support team","type":"io.cozy.jobs","verbs":["POST"],"selector":"worker","values":["sendmail"]}}}

/***/ }),

/***/ "Yo2A":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("fvjX");
/* harmony import */ var _ModalManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("2Ekz");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ModalManager", function() { return _ModalManager__WEBPACK_IMPORTED_MODULE_1__["ModalManager"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "showModal", function() { return _ModalManager__WEBPACK_IMPORTED_MODULE_1__["showModal"]; });

/* harmony import */ var _QueryParameter__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("ciCs");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getQueryParameter", function() { return _QueryParameter__WEBPACK_IMPORTED_MODULE_2__["default"]; });



/* harmony default export */ __webpack_exports__["default"] = (Object(redux__WEBPACK_IMPORTED_MODULE_0__["combineReducers"])({
  modal: _ModalManager__WEBPACK_IMPORTED_MODULE_1__["default"]
}));



/***/ }),

/***/ "YsA6":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var whatwg_fetch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("bZMm");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("i8i4");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var drive_web_modules_services__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("2ogT");
/* harmony import */ var cozy_client__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("SH7X");
/* harmony import */ var cozy_client__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(cozy_client__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var cozy_ui_transpiled_react_I18n__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("buk/");
/* harmony import */ var react_cozy_helpers__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("Yo2A");
/* harmony import */ var drive_lib_registerClientPlugins__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("LW8N");
/* harmony import */ var drive_appMetadata__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("unzg");
/* harmony import */ var drive_lib_doctypes__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("z6Q1");
/* harmony import */ var drive_web_modules_drive_StyledApp__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("cV3X");
/* global cozy */











document.addEventListener('DOMContentLoaded', function () {
  var root = document.getElementById('main');
  var data = root.dataset;
  var protocol = window.location ? window.location.protocol : 'https:';
  var cozyUrl = "".concat(protocol, "//").concat(data.cozyDomain);

  var _getQueryParameter = Object(react_cozy_helpers__WEBPACK_IMPORTED_MODULE_6__["getQueryParameter"])(),
      intent = _getQueryParameter.intent;

  var client = new cozy_client__WEBPACK_IMPORTED_MODULE_4___default.a({
    uri: cozyUrl,
    token: data.cozyToken,
    appMetadata: drive_appMetadata__WEBPACK_IMPORTED_MODULE_8__["default"],
    schema: drive_lib_doctypes__WEBPACK_IMPORTED_MODULE_9__["schema"]
  });
  cozy.client.init({
    cozyURL: cozyUrl,
    token: data.cozyToken
  });
  Object(drive_lib_registerClientPlugins__WEBPACK_IMPORTED_MODULE_7__["default"])(client);
  Object(react_dom__WEBPACK_IMPORTED_MODULE_2__["render"])( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(cozy_ui_transpiled_react_I18n__WEBPACK_IMPORTED_MODULE_5__["I18n"], {
    lang: data.cozyLocale,
    dictRequire: function dictRequire(lang) {
      return __webpack_require__("tqYW")("./".concat(lang));
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(cozy_client__WEBPACK_IMPORTED_MODULE_4__["CozyProvider"], {
    client: client
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(drive_web_modules_drive_StyledApp__WEBPACK_IMPORTED_MODULE_10__["default"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(drive_web_modules_services__WEBPACK_IMPORTED_MODULE_3__["default"], {
    intentId: intent
  })))), root);
});

/***/ }),

/***/ "cV3X":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var cozy_ui_transpiled_react_stylesheet_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("/8/d");
/* harmony import */ var cozy_ui_transpiled_react_stylesheet_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(cozy_ui_transpiled_react_stylesheet_css__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var cozy_sharing_dist_stylesheet_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("3FT0");
/* harmony import */ var cozy_sharing_dist_stylesheet_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(cozy_sharing_dist_stylesheet_css__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var drive_styles_main_styl__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("8IyR");
/* harmony import */ var drive_styles_main_styl__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(drive_styles_main_styl__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var cozy_ui_transpiled_react_MuiCozyTheme__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("xIbs");


 //eslint-disable-next-line




var StyledApp = function StyledApp(_ref) {
  var children = _ref.children;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(cozy_ui_transpiled_react_MuiCozyTheme__WEBPACK_IMPORTED_MODULE_4__["default"], null, children);
};

/* harmony default export */ __webpack_exports__["default"] = (StyledApp);

/***/ }),

/***/ "ciCs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("J4zp");
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__);


var arrToObj = function arrToObj() {
  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var _ref = arguments.length > 1 ? arguments[1] : undefined,
      _ref2 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default()(_ref, 2),
      key = _ref2[0],
      _ref2$ = _ref2[1],
      val = _ref2$ === void 0 ? true : _ref2$;

  obj[key] = val;
  return obj;
};

var getQueryParameter = function getQueryParameter() {
  return window.location.search.substring(1).split('&').map(function (varval) {
    return varval.split('=');
  }).reduce(arrToObj, {});
};

/* harmony default export */ __webpack_exports__["default"] = (getQueryParameter);

/***/ }),

/***/ "f/2S":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var svg_baker_runtime_browser_symbol__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("4BeY");
/* harmony import */ var svg_baker_runtime_browser_symbol__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(svg_baker_runtime_browser_symbol__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var svg_sprite_loader_runtime_browser_sprite_build__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("IaFt");
/* harmony import */ var svg_sprite_loader_runtime_browser_sprite_build__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(svg_sprite_loader_runtime_browser_sprite_build__WEBPACK_IMPORTED_MODULE_1__);


var symbol = new svg_baker_runtime_browser_symbol__WEBPACK_IMPORTED_MODULE_0___default.a({
  "id": "icon-type-slide_440e71a068f2c361f14a6402991887d2",
  "use": "icon-type-slide_440e71a068f2c361f14a6402991887d2-usage",
  "viewBox": "0 0 32 32",
  "content": "<symbol xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\" id=\"icon-type-slide_440e71a068f2c361f14a6402991887d2\">\n  <g fill=\"none\" fill-rule=\"evenodd\" transform=\"translate(0 2)\">\n    <path fill=\"#FFDEC1\" d=\"M0,1.99124431 C0,0.891510444 0.889763236,0 2.00359486,0 L25,0 L32,7 L32,26.0054385 C32,27.1070044 31.1107383,28 29.9982567,28 L2.00174332,28 C0.89621101,28 0,27.1001025 0,26.0087557 L0,1.99124431 Z\" />\n    <path fill=\"#FF9433\" d=\"M24.5.57092175e-14C24.2238576.33045111e-13 24 .230796814 24 .500435829L24 8 31.4995642 8C31.7759472 8 32 7.76806641 32 7.5L32 7 25 0 24.5.57092175e-14zM9.99621582 16L25.9962158 16 25.9962158 18 9.99621582 18 9.99621582 16zM9.99621582 20L25.9962158 20 25.9962158 22 9.99621582 22 9.99621582 20zM6 16L8 16 8 18 6 18 6 16zM6 20L8 20 8 22 6 22 6 20zM16 14C18.209139 14 20 12.209139 20 10L16 10 16 6C13.790861 6 12 7.790861 12 10 12 12.209139 13.790861 14 16 14zM17 9C17 9 16.9999999 6 17 5 19 5 21.0000002 7 21 9L17 9z\" />\n  </g>\n</symbol>"
});
var result = svg_sprite_loader_runtime_browser_sprite_build__WEBPACK_IMPORTED_MODULE_1___default.a.add(symbol);
/* harmony default export */ __webpack_exports__["default"] = (symbol);

/***/ }),

/***/ "gbp9":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var svg_baker_runtime_browser_symbol__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("4BeY");
/* harmony import */ var svg_baker_runtime_browser_symbol__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(svg_baker_runtime_browser_symbol__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var svg_sprite_loader_runtime_browser_sprite_build__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("IaFt");
/* harmony import */ var svg_sprite_loader_runtime_browser_sprite_build__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(svg_sprite_loader_runtime_browser_sprite_build__WEBPACK_IMPORTED_MODULE_1__);


var symbol = new svg_baker_runtime_browser_symbol__WEBPACK_IMPORTED_MODULE_0___default.a({
  "id": "icon-type-pdf_ea9c680326440f2601a8a80345ef5a5d",
  "use": "icon-type-pdf_ea9c680326440f2601a8a80345ef5a5d-usage",
  "viewBox": "0 0 32 32",
  "content": "<symbol xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\" id=\"icon-type-pdf_ea9c680326440f2601a8a80345ef5a5d\">\n  <g fill=\"none\" fill-rule=\"evenodd\" transform=\"translate(3)\">\n    <path fill=\"#FCD0D5\" d=\"M0,2.00174332 C0,0.89621101 0.890925393,0 1.99742191,0 L19,0 L26,7 L26,29.9964051 C26,31.10296 25.1050211,32 24.0029953,32 L1.99700466,32 C0.89408944,32 0,31.1107383 0,29.9982567 L0,2.00174332 Z\" />\n    <path fill=\"#F1132D\" d=\"M18.5.57092175e-14C18.2238576.33045111e-13 18 .230796814 18 .500435829L18 8 25.4995642 8C25.7759472 8 26 7.76806641 26 7.5L26 7 19 0 18.5.57092175e-14zM6 11L20 11 20 13 6 13 6 11zM6 15L18 15 18 17 6 17 6 15zM6.06599695 19.784L7.96999695 19.784C8.25266503 19.784 8.51799571 19.8119997 8.76599695 19.868 9.01399819 19.9240003 9.22999603 20.0173327 9.41399695 20.148 9.59799787 20.2786673 9.74332975 20.4519989 9.84999695 20.668 9.95666415 20.8840011 10.0099969 21.1493318 10.0099969 21.464 10.0099969 21.7680015 9.95533083 22.0319989 9.84599695 22.256 9.73666307 22.4800011 9.58866455 22.6639993 9.40199695 22.808 9.21532935 22.9520007 8.99933151 23.0586663 8.75399695 23.128 8.50866239 23.1973337 8.24733167 23.232 7.96999695 23.232L7.24199695 23.232 7.24199695 25 6.06599695 25 6.06599695 19.784zM7.89799695 22.296C8.53800015 22.296 8.85799695 22.0186694 8.85799695 21.464 8.85799695 21.1919986 8.77666443 21.0000006 8.61399695 20.888 8.45132947 20.7759994 8.21266519 20.72 7.89799695 20.72L7.24199695 20.72 7.24199695 22.296 7.89799695 22.296zM10.9139969 19.784L12.3859969 19.784C12.7859989 19.784 13.1459953 19.8346662 13.4659969 19.936 13.7859985 20.0373338 14.0606625 20.1933323 14.2899969 20.404 14.5193314 20.6146677 14.6953297 20.882665 14.8179969 21.208 14.9406642 21.533335 15.0019969 21.9199978 15.0019969 22.368 15.0019969 22.8160022 14.9406642 23.2053317 14.8179969 23.536 14.6953297 23.8666683 14.5219981 24.1399989 14.2979969 24.356 14.0739958 24.5720011 13.8059985 24.7333328 13.4939969 24.84 13.1819954 24.9466672 12.8339989 25 12.4499969 25L10.9139969 25 10.9139969 19.784zM12.3139969 24.048C12.5379981 24.048 12.7406627 24.018667 12.9219969 23.96 13.1033312 23.901333 13.2579963 23.8066673 13.3859969 23.676 13.5139976 23.5453327 13.6139966 23.3733344 13.6859969 23.16 13.7579973 22.9466656 13.7939969 22.6826682 13.7939969 22.368 13.7939969 22.0586651 13.7579973 21.7986677 13.6859969 21.588 13.6139966 21.3773323 13.5139976 21.209334 13.3859969 21.084 13.2579963 20.958666 13.1033312 20.8693336 12.9219969 20.816 12.7406627 20.7626664 12.5379981 20.736 12.3139969 20.736L12.0899969 20.736 12.0899969 24.048 12.3139969 24.048zM15.9939969 19.784L19.2819969 19.784 19.2819969 20.776 17.1699969 20.776 17.1699969 21.984 18.9779969 21.984 18.9779969 22.976 17.1699969 22.976 17.1699969 25 15.9939969 25 15.9939969 19.784z\" />\n  </g>\n</symbol>"
});
var result = svg_sprite_loader_runtime_browser_sprite_build__WEBPACK_IMPORTED_MODULE_1___default.a.add(symbol);
/* harmony default export */ __webpack_exports__["default"] = (symbol);

/***/ }),

/***/ "hehj":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var svg_baker_runtime_browser_symbol__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("4BeY");
/* harmony import */ var svg_baker_runtime_browser_symbol__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(svg_baker_runtime_browser_symbol__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var svg_sprite_loader_runtime_browser_sprite_build__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("IaFt");
/* harmony import */ var svg_sprite_loader_runtime_browser_sprite_build__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(svg_sprite_loader_runtime_browser_sprite_build__WEBPACK_IMPORTED_MODULE_1__);


var symbol = new svg_baker_runtime_browser_symbol__WEBPACK_IMPORTED_MODULE_0___default.a({
  "id": "icon-type-audio_e99d441b7729b89692055537e75fa922",
  "use": "icon-type-audio_e99d441b7729b89692055537e75fa922-usage",
  "viewBox": "0 0 32 32",
  "content": "<symbol xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\" id=\"icon-type-audio_e99d441b7729b89692055537e75fa922\">\n  <g fill=\"none\" fill-rule=\"evenodd\" transform=\"translate(1 1)\">\n    <rect width=\"30\" height=\"30\" fill=\"#ACF6F7\" rx=\"2\" />\n    <path fill=\"#0CCBD0\" d=\"M8,19.9979317 C6.8954305,19.9979317 6,20.8856614 6,21.9979317 L6,21.9979317 C6,23.1025012 6.89826062,23.9979317 7.99791312,23.9979317 L9,23.9979317 C10.6568542,23.9979317 12,22.6487458 12,21.0005269 L12,13.3224852 C12,13.0410046 12.217172,12.7720898 12.4922264,12.7205046 L18.5077736,11.5923149 C18.7796227,11.5413308 19,11.7161978 19,12.0098818 L19,17.4880499 C19,17.7696499 18.7849426,17.9979317 18.5095215,17.9979317 L17,17.9979317 C15.8954305,17.9979317 15,18.9020069 15,19.9947579 L15,19.8159933 C15,20.9188099 15.8982606,21.8128195 16.9979131,21.8128195 L18,21.8128195 C19.6568542,21.8128195 21,20.464451 21,18.8195676 L21,6.99922157 C21,6.44622446 20.555163,6.07881118 20.0238234,6.17541838 L10.9761766,7.82044507 C10.4370492,7.91846824 10,8.45369268 10,9.00040502 L10,19.4975844 C10,19.7739186 9.78494263,19.9979317 9.50952148,19.9979317 L8,19.9979317 Z\" />\n  </g>\n</symbol>"
});
var result = svg_sprite_loader_runtime_browser_sprite_build__WEBPACK_IMPORTED_MODULE_1___default.a.add(symbol);
/* harmony default export */ __webpack_exports__["default"] = (symbol);

/***/ }),

/***/ "iTW1":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getAvailableOfflineIds", function() { return getAvailableOfflineIds; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isAvailableOffline", function() { return isAvailableOffline; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toggleAvailableOffline", function() { return toggleAvailableOffline; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "openLocalFile", function() { return openLocalFile; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "openLocalFileCopy", function() { return openLocalFileCopy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "updateOfflineFileCopyIfNecessary", function() { return updateOfflineFileCopyIfNecessary; });
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("o0o1");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("yXPU");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("RIqP");
/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var drive_mobile_lib_filesystem__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("1aVK");
/* harmony import */ var cozy_device_helper__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("snfs");
/* harmony import */ var cozy_device_helper__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(cozy_device_helper__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var cozy_ui_transpiled_react_Alerter__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("67rm");
/* harmony import */ var lib_logger__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("OTOu");







var MAKE_AVAILABLE_OFFLINE = 'MAKE_AVAILABLE_OFFLINE';
var UNDO_MAKE_AVAILABLE_OFFLINE = 'UNDO_MAKE_AVAILABLE_OFFLINE';
/* harmony default export */ __webpack_exports__["default"] = (function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  switch (action.type) {
    case MAKE_AVAILABLE_OFFLINE:
      return [].concat(_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_2___default()(state), [action.id]);

    case UNDO_MAKE_AVAILABLE_OFFLINE:
      {
        var index = state.indexOf(action.id);
        return [].concat(_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_2___default()(state.slice(0, index)), _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_2___default()(state.slice(index + 1)));
      }

    default:
      return state;
  }
});

var markAsAvailableOffline = function markAsAvailableOffline(id) {
  return {
    type: MAKE_AVAILABLE_OFFLINE,
    id: id
  };
};

var markAsUnavailableOffline = function markAsUnavailableOffline(id) {
  return {
    type: UNDO_MAKE_AVAILABLE_OFFLINE,
    id: id
  };
};

var getAvailableOfflineIds = function getAvailableOfflineIds(_ref) {
  var availableOffline = _ref.availableOffline;
  return availableOffline;
};
var isAvailableOffline = function isAvailableOffline(_ref2, id) {
  var state = _ref2.availableOffline;
  return Array.isArray(state) && state.indexOf(id) !== -1;
};
var toggleAvailableOffline = function toggleAvailableOffline(file, client) {
  return /*#__PURE__*/function () {
    var _ref3 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(dispatch, getState) {
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt("return", isAvailableOffline(getState(), file.id) ? dispatch(forgetDownloadedFile(file)) : dispatch(makeAvailableOffline(file, client)));

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x, _x2) {
      return _ref3.apply(this, arguments);
    };
  }();
};

var forgetDownloadedFile = function forgetDownloadedFile(file) {
  return /*#__PURE__*/function () {
    var _ref4 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee2(dispatch) {
      var filename;
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              filename = file.id;

              if (Object(cozy_device_helper__WEBPACK_IMPORTED_MODULE_4__["isMobileApp"])() && window.cordova.file) {
                Object(drive_mobile_lib_filesystem__WEBPACK_IMPORTED_MODULE_3__["deleteOfflineFile"])(filename);
              }

              dispatch(markAsUnavailableOffline(file.id));

            case 3:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function (_x3) {
      return _ref4.apply(this, arguments);
    };
  }();
};

var makeAvailableOffline = function makeAvailableOffline(file, client) {
  return /*#__PURE__*/function () {
    var _ref5 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee3(dispatch) {
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return saveOfflineFileCopy(file, client);

            case 2:
              dispatch(markAsAvailableOffline(file.id));

            case 3:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function (_x4) {
      return _ref5.apply(this, arguments);
    };
  }();
};

var saveOfflineFileCopy = /*#__PURE__*/function () {
  var _ref6 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee4(file, client) {
    var response, blob, filename;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            if (!(!Object(cozy_device_helper__WEBPACK_IMPORTED_MODULE_4__["isMobileApp"])() || !window.cordova.file)) {
              _context4.next = 2;
              break;
            }

            return _context4.abrupt("return");

          case 2:
            _context4.prev = 2;
            _context4.next = 5;
            return client.collection('io.cozy.files').fetchFileContent(file);

          case 5:
            response = _context4.sent;
            _context4.next = 8;
            return response.blob();

          case 8:
            blob = _context4.sent;
            filename = file.id;
            Object(drive_mobile_lib_filesystem__WEBPACK_IMPORTED_MODULE_3__["saveFileWithCordova"])(blob, filename);
            _context4.next = 17;
            break;

          case 13:
            _context4.prev = 13;
            _context4.t0 = _context4["catch"](2);
            cozy_ui_transpiled_react_Alerter__WEBPACK_IMPORTED_MODULE_5__["default"].error('mobile.error.make_available_offline.offline');
            throw _context4.t0;

          case 17:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[2, 13]]);
  }));

  return function saveOfflineFileCopy(_x5, _x6) {
    return _ref6.apply(this, arguments);
  };
}();

var openLocalFile = function openLocalFile(file) {
  return /*#__PURE__*/function () {
    var _ref7 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee5(dispatch, getState) {
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              if (!isAvailableOffline(getState(), file.id)) {
                lib_logger__WEBPACK_IMPORTED_MODULE_6__["default"].error('openLocalFile: this file is not available offline');
              }

              Object(drive_mobile_lib_filesystem__WEBPACK_IMPORTED_MODULE_3__["openOfflineFile"])(file).catch(function (error) {
                lib_logger__WEBPACK_IMPORTED_MODULE_6__["default"].error('openLocalFile', error);
                cozy_ui_transpiled_react_Alerter__WEBPACK_IMPORTED_MODULE_5__["default"].error('mobile.error.make_available_offline.noapp');
              });

            case 2:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }));

    return function (_x7, _x8) {
      return _ref7.apply(this, arguments);
    };
  }();
};
var openLocalFileCopy = function openLocalFileCopy(file) {
  return /*#__PURE__*/function () {
    var _ref9 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee6(dispatch, getState, _ref8) {
      var client, localFile;
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              client = _ref8.client;

              if (!isAvailableOffline(getState(), file.id)) {
                _context6.next = 3;
                break;
              }

              return _context6.abrupt("return", Object(drive_mobile_lib_filesystem__WEBPACK_IMPORTED_MODULE_3__["openOfflineFile"])(file));

            case 3:
              _context6.next = 5;
              return Object(drive_mobile_lib_filesystem__WEBPACK_IMPORTED_MODULE_3__["createTemporaryLocalFile"])(client, file);

            case 5:
              localFile = _context6.sent;
              return _context6.abrupt("return", Object(drive_mobile_lib_filesystem__WEBPACK_IMPORTED_MODULE_3__["openFileWithCordova"])(localFile.nativeURL, file.mime));

            case 7:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    }));

    return function (_x9, _x10, _x11) {
      return _ref9.apply(this, arguments);
    };
  }();
};
var updateOfflineFileCopyIfNecessary = function updateOfflineFileCopyIfNecessary(file, prevFile, client) {
  return /*#__PURE__*/function () {
    var _ref10 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee7(_, getState) {
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              if (!(isAvailableOffline(getState(), file.id) && file.md5sum !== prevFile.md5sum)) {
                _context7.next = 3;
                break;
              }

              _context7.next = 3;
              return saveOfflineFileCopy(file, client);

            case 3:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7);
    }));

    return function (_x12, _x13) {
      return _ref10.apply(this, arguments);
    };
  }();
};

/***/ }),

/***/ "j70F":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("lwsE");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("W8MJ");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("7W2i");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("a1gu");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("Nsbk");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("o0o1");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("yXPU");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_7__);








function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4___default()(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4___default()(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3___default()(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

/* global cozy */


var getFileDownloadUrl = /*#__PURE__*/function () {
  var _ref = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_6___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5___default.a.mark(function _callee(id) {
    var link;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5___default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return cozy.client.files.getDownloadLinkById(id);

          case 2:
            link = _context.sent;
            return _context.abrupt("return", "".concat(cozy.client._url).concat(link));

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function getFileDownloadUrl(_x) {
    return _ref.apply(this, arguments);
  };
}();

var URLGetter = /*#__PURE__*/function (_React$Component) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_2___default()(URLGetter, _React$Component);

  var _super = _createSuper(URLGetter);

  function URLGetter() {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, URLGetter);

    return _super.apply(this, arguments);
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(URLGetter, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.getURL();
    }
  }, {
    key: "getURL",
    value: function () {
      var _getURL = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_6___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5___default.a.mark(function _callee2() {
        var service, _service$getData, id, url;

        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5___default.a.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                service = this.props.service;
                _context2.prev = 1;
                _service$getData = service.getData(), id = _service$getData.id;
                _context2.next = 5;
                return getFileDownloadUrl(id);

              case 5:
                url = _context2.sent;
                service.terminate({
                  url: url
                });
                _context2.next = 12;
                break;

              case 9:
                _context2.prev = 9;
                _context2.t0 = _context2["catch"](1);
                service.throw(_context2.t0);

              case 12:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[1, 9]]);
      }));

      function getURL() {
        return _getURL.apply(this, arguments);
      }

      return getURL;
    }()
  }]);

  return URLGetter;
}(react__WEBPACK_IMPORTED_MODULE_7___default.a.Component);

/* harmony default export */ __webpack_exports__["default"] = (URLGetter);

/***/ }),

/***/ "koyB":
/***/ (function(module) {

module.exports = {"Nav":{"item_drive":"Drive","item_recent":"Recent","item_sharings":"Sharings","item_shared":"Shared by me","item_activity":"Activity","item_trash":"Trash","item_settings":"Settings","item_collect":"Administrative","btn-client":"Get Cozy Drive for desktop","support-us":"View offers","support-us-description":"Would you like to benefit from more space or simply support cozy?","btn-client-web":"Get Cozy","btn-client-mobile":"Get Cozy Drive on your mobile!","banner-txt-client":"Get Cozy Drive for Desktop and synchronise your files safely to make them accessible at all times.","banner-btn-client":"Download","link-client":"https://cozy.io/en/download/","link-client-desktop":"https://nuts.cozycloud.cc/download/channel/stable/","link-client-android":"https://play.google.com/store/apps/details?id=io.cozy.drive.mobile","link-client-ios":"https://itunes.apple.com/us/app/cozy-drive/id1224102389?mt=8","link-client-web":"https://cozy.io/try-it"},"breadcrumb":{"title_drive":"Drive","title_recent":"Recent","title_sharings":"Sharings","title_shared":"Shared by me","title_activity":"Activity","title_trash":"Trash"},"Toolbar":{"more":"More"},"toolbar":{"item_upload":"Upload","menu_upload":"Upload files","item_more":"More","menu_new_folder":"New folder","menu_select":"Select items","menu_share_folder":"Share folder","menu_download_folder":"Download folder","menu_download_file":"Download this file","menu_open_cozy":"Open in my Cozy","menu_create_note":"New note","menu_create_shortcut":"New shortcut","empty_trash":"Empty trash","share":"Share","trash":"Remove","leave":"Leave shared folder & delete it"},"Share":{"status":{"owner":"Owner","pending":"Pending","ready":"Accepted","refused":"Refused","error":"Error","unregistered":"Error","mail-not-sent":"Pending","revoked":"Error"},"type":{"one-way":"Can View","two-way":"Can Change","desc":{"one-way":"Contacts can view, download, and add the content to their Cozy. If they add the content to their Cozy, they will get updates you make to the content, but they won't be able to update it.","two-way":"Contacts can update, delete and add the content to their Cozy. Updates on the content will be seen on other Cozies."}},"locked-type-file":"Coming soon: you will be able to change permissions you grant on the file.","locked-type-folder":"Coming soon: you will be able to change permissions you grant on the folder.","recipients":{"you":"You","accessCount":"%{count} people have access"},"create-cozy":"Create my cozy","members":{"count":"1 member |||| %{smart_count} members","others":"and 1 other… |||| and %{smart_count} others…","otherContacts":"other contact |||| other contacts"},"contacts":{"permissionRequired":{"title":"Save your contacts in your Cozy?","desc":"Authorize the application to access to your Cozy's contacts: you'll be able to select them next time.","action":"Authorize access","success":"The application has access to your contacts"}}},"Sharings":{"unavailable":{"title":"Switch online!","message":"An internet connection is needed to display the list of your last sharings."}},"Files":{"share":{"cta":"Share","title":"Share","details":{"title":"Sharing details","createdAt":"On %{date}","ro":"Can read","rw":"Can change","desc":{"ro":"You can view, download, and add this content to your Cozy. You will get updates by the owner, but you won't be able to update this content yourself.","rw":"You can view, update, delete and add this content to your Cozy. Updates you make will be seen on other Cozies."}},"sharedByMe":"Shared by me","sharedWithMe":"Shared with me","sharedBy":"Shared by %{name}","shareByLink":{"subtitle":"By public link","desc":"Anyone with the provided link can see and download your files.","creating":"Creating your link...","copy":"Copy link","copied":"Link has been copied to clipboard","failed":"Unable to copy to clipboard"},"shareByEmail":{"subtitle":"By email","email":"To:","emailPlaceholder":"Enter the email address or name of the recipient","send":"Send","genericSuccess":"You sent an invite to %{count} contacts.","success":"You sent an invite to %{email}.","comingsoon":"Coming soon! You will be able to share documents and photos in a single click with your family, your friends, and even your coworkers. Don't worry, we'll let you know when it's ready!","onlyByLink":"This %{type} can only be shared by link, because","type":{"file":"file","folder":"folder"},"hasSharedParent":"it has a shared parent","hasSharedChild":"it contains a shared element"},"revoke":{"title":"Remove from sharing","desc":"This contact will keep a copy but the changes won't be synchrnoized anymore.","success":"You removed this shared file from %{email}."},"revokeSelf":{"title":"Remove me from sharing","desc":"You keep the content but it won't be updated between your Cozy anymore.","success":"You were removed from this sharing."},"sharingLink":{"title":"Link to share","copy":"Copy","copied":"Copied"},"whoHasAccess":{"title":"1 person has access |||| %{smart_count} people have access"},"protectedShare":{"title":"Coming soon!","desc":"Share anything by email with your family and friends!"},"close":"Close","gettingLink":"Getting your link...","error":{"generic":"An error occurred when creating the file share link, please try again.","revoke":"Woops, an error occurred. Please contact us so we can fix this issue as soon as possible."},"specialCase":{"base":"This %{type} cannot be shared but with a link as it","isInSharedFolder":"is in a shared folder","hasSharedFolder":"contains a shared folder"}},"viewer-fallback":"If the file has started downloading, you can close this.","dropzone":{"teaser":"Drop files to upload them to:","noFolderSupport":"Folder drag&drop is currently not supported by your browser. Please upload your files manually."}},"table":{"head_name":"Name","head_update":"Last update","head_size":"Size","head_status":"Status","head_thumbnail_size":"Switch thumbnail size","row_update_format":"MMM D, YYYY","row_update_format_full":"MMMM D, YYYY","row_read_only":"Share (Read only)","row_read_write":"Share (Read & Write)","row_size_symbols":{"B":"B","KB":"KB","MB":"MB","GB":"GB","TB":"TB","PB":"PB","EB":"EB","ZB":"ZB","YB":"YB"},"load_more":"Load More","mobile":{"head_name_asc":"A-Z","head_name_desc":"Z-A","head_updated_at_asc":"Oldest first","head_updated_at_desc":"Most recent first","head_size_asc":"Lightest first","head_size_desc":"Heavier first"}},"SelectionBar":{"selected_count":"item selected |||| items selected","share":"Share","download":"Download","trash":"Remove","destroy":"Delete permanently","rename":"Rename","restore":"Restore","close":"Close","openWith":"Open with","moveto":"Move to…","phone-download":"Make available offline","qualify":"Categorize","history":"History"},"deleteconfirmation":{"title":"Delete this element? |||| Delete these elements?","trash":"It will be moved to the Trash. |||| They will be moved to the Trash.","restore":"You can still restore it whenever you want. |||| You can still restore them whenever you want.","shared":"The following contacts whom you shared it with will keep a copy but your changes won't be synchronized anymore. |||| The following contacts whom you shared them with will keep a copy but your changes won't be synchronized anymore","referenced":"Some of the files within the selection are related to a photo album. They will be removed from it if you proceed to trash them.","cancel":"Cancel","delete":"Remove"},"emptytrashconfirmation":{"title":"Permanently delete?","forbidden":"You won't be able to access these files anymore.","restore":"You won't be able to restore these files if you didn't make a backup.","cancel":"Cancel","delete":"Delete all"},"destroyconfirmation":{"title":"Permanently delete?","forbidden":"You won't be able to access this file anymore. |||| You won't be able to access these files anymore.","restore":"You won't be able to restore this file if you didn't make a backup. |||| You won't be able to restore these files if you didn't make a backup.","cancel":"Cancel","delete":"Delete permanently"},"quotaalert":{"title":"Your disk space is full :(","desc":"Please remove files, empty your trash or increase your disk space before uploading files again.","confirm":"OK","increase":"Increase your disk space"},"loading":{"message":"Loading"},"empty":{"title":"You don’t have any files in this folder.","text":"Click the \"upload\" button to add files to this folder.","trash_title":"You don’t have any deleted files.","trash_text":"Move files you don't need anymore to the Trash and permanently delete items to free up storage page."},"error":{"open_folder":"Something went wrong when opening the folder.","button":{"reload":"Refresh now"},"download_file":{"offline":"You should be connected to download this file","missing":"This file is missing"}},"Error":{"public_unshared_title":"Sorry, this link is no longer available.","public_unshared_text":"This link has expired, or it was removed by its owner. Let him or her know that you missed it!","generic":"Something went wrong. Wait a few minutes and retry."},"alert":{"could_not_open_file":"The file could not be opened","try_again":"An error has occurred, please try again in a moment.","restore_file_success":"The selection has been successfully restored.","trash_file_success":"The selection has been moved to the Trash.","destroy_file_success":"The selection has been deleted permanently.","empty_trash_progress":"Your trash is being emptied. This might take a few moments.","empty_trash_success":"The trash has been emptied.","folder_name":"The element %{folderName} already exists, please choose a new name.","file_name":"The element %{fileName} already exists, please choose a new name.","folder_generic":"An error occurred, please try again.","folder_abort":"You need to add a name to your new folder if you would like to save it. Your information has not been saved.","offline":"This feature is not available offline.","preparing":"Preparing your files…"},"mobile":{"onboarding":{"welcome":{"title":"Cozy Drive","desc":"Create a Cozy or sign in to access Cozy Drive","button":"Sign in","no_account_link":"I don't have a Cozy","create_my_cozy":"Create my Cozy"},"server_selection":{"title":"Sign in","lostpwd":"[I forgot the address of my Cozy](https://manager.cozycloud.cc/cozy/reminder)","label":"Address of my Cozy","cozy_address_placeholder":"claude","cozy_custom_address_placeholder":"claude.mydomain.com","domain_cozy":".mycozy.cloud","domain_custom":"other","button":"Next","wrong_address_with_email":"You typed an email address. To connect on your cozy you must type its url, something like https://camillenimbus.mycozy.cloud","wrong_address_v2":"You have just entered the address of old Cozy version. This application is only compatible with the latest version. [Please refer to our site for more information.](https://blog.cozycloud.cc/post/2016/11/21/On-the-road-to-Cozy-version-3?lang=en)","wrong_address":"This address doesn’t seem to be a cozy. Please check the address you provide.","wrong_address_cosy":"Woops, the address is not correct. Try with \"cozy\" with a \"z\"!"},"files":{"title":"Access your drive","description":"In order to save your Cozy Drive on your device, the application must access your files."},"photos":{"title":"Backup your photos and videos","description":"Automatically backup the photos taken with your phone to your Cozy, so you never lose them."},"contacts":{"title":"Sync your contacts","description":"Save your phone's contact on your Cozy — this will facilitate sharing files with them."},"step":{"button":"Enable now","skip":"Later","next":"Next"},"analytics":{"title":"Help us improve Cozy","description":"The application will automatically provide data (mainly errors) to Cozy Cloud. It will allow us to resolve problems faster."}},"settings":{"title":"Settings","about":{"title":"About","app_version":"App Version","account":"Account"},"unlink":{"title":"Sign out of your Cozy","description":"By signing out of your Cozy from this device, you will not lose any data in your Cozy. This will remove your offline files from this device related to your Cozy.","button":"Sign out"},"media_backup":{"media_folder":"Photos","backup_folder":"Backed up from my mobile","legacy_backup_folder":"Backuped from my mobile","title":"Media Backup","images":{"title":"Backup images","label":"Backup your images automatically to your Cozy not to ever lose them and share them easily."},"launch":"Launch Backup","stop":"Stop Backup","wifi":{"title":"Backup on WIFI only","label":"If the option is enabled, your device will only backup photos when it's on WIFI in order to save your package."},"media_upload":"%{smart_count} remaining picture |||| %{smart_count} remaining pictures","media_uptodate":"Media backup is up-to-date","preparing":"Searching for media to backup...","no_wifi":"Please connect to a WIFI","quota":"Storage limit nearly reached","quota_contact":"Manage your storage space"},"support":{"title":"Support","analytics":{"title":"Help us improve Cozy","label":"The application will automatically provide data (mainly errors) to Cozy Cloud. It will allow us to resolve problems faster."},"feedback":{"title":"Help improve Cozy Drive","description":"Send your feedback to help us improve Cozy Drive. Click on the button below, explain the problem or make a suggestion and send it. You're done!","button":"leave feedback"},"logs":{"title":"Help us to understand your problem","description":"Send the application log to help us improve its quality and stability.","button":"Send my logs","success":"Thanks, we will investigate your problem and contact you soon.","error":"A problem happened, logs couldn't be sent, please try again."}},"contacts":{"title":"Contacts","subtitle":"Import contacts","text":"Import the contacts from your device to your Cozy to easily share content with them."}},"error":{"open_with":{"offline":"You should be connected to open this file","noapp":"No application on your device can open this file with mime type: %{fileMime} "},"make_available_offline":{"offline":"You should be connected to open this file","noapp":"No application on your device can open this file with mime type: %{fileMime} "}},"revoked":{"title":"Access revoked","description":"It appears you revoked this device from your Cozy. If you didn't, please let us know at contact@cozycloud.cc. All your local data related to your Cozy will be removed.","loginagain":"Log in again","logout":"Log out"},"rating":{"enjoy":{"title":"Enjoying Cozy Drive?","yes":"Yes!","no":"Not really"},"rate":{"title":"Would you mind rating it?","yes":"Let's do that!","no":"No, thanks","later":"Maybe later"},"feedback":{"title":"Would you mind giving us some feedback?","yes":"Send","no":"No, thanks"},"email":{"subject":"Feedback on Cozy Drive","placeholder":"Hello, I think Cozy Drive would be better if…"},"alert":{"rated":"Thank you! You're ⭐️⭐️⭐️⭐️⭐️","declined":"Awesome. You will love the upcoming features. Stay Cozy!","later":"No problem, we'll ask again later.","feedback":"Thank you for the feedback. We'll definitely work on it!"}},"first_sync":{"title":"You are about to start your first photos back up 🎉","tips":"Tips","tip_bed":"Open Cozy Drive before you go to bed or when you don't use your phone.","tip_wifi":"Enable Wi-Fi to preserve your data.","tip_lock":"Disable your lock screen.","result":"In the morning, all your photos will be stored in a safe and secure location.","button":"Got it!"},"notifications":{"backup_paused":"Your photos backup is paused. Keep the application open and prevent the screen from going to sleep to complete the backup."},"download":{"success":"Your file has been shared with success"}},"upload":{"alert":{"success":"%{smart_count} file uploaded with success. |||| %{smart_count} files uploaded with success.","success_conflicts":"%{smart_count} file uploaded with %{conflictNumber} conflict(s). |||| %{smart_count} files uploaded with %{conflictNumber} conflict(s).","success_updated":"%{smart_count} file uploaded and %{updatedCount} updated. |||| %{smart_count} files uploaded and %{updatedCount} updated.","success_updated_conflicts":"%{smart_count} file uploaded, %{updatedCount} updated and %{conflictCount} conflict(s). |||| %{smart_count} files uploaded, %{updatedCount} updated and %{conflictCount} conflict(s).","updated":"%{smart_count} file updated. |||| %{smart_count} files updated.","updated_conflicts":"%{smart_count} file updated with %{conflictCount} conflict(s). |||| %{smart_count} files updated with %{conflictCount} conflict(s).","errors":"Errors occurred during the file upload.","network":"You are currenly offline. Please try again once you're connected."}},"intents":{"alert":{"error":"Unable to automatically upload the file, please upload it manually with the upload menu."},"picker":{"select":"Select","cancel":"Cancel","new_folder":"New folder","instructions":"Select a target"}},"UploadQueue":{"header":"Uploading %{smart_count} photo to Cozy Drive |||| Uploading %{smart_count} photos to Cozy Drive","header_mobile":"Uploading %{done} of %{total}","header_done":"Uploaded %{done} out of %{total} successfully","close":"close","item":{"pending":"Pending"}},"Viewer":{"close":"Close","noviewer":{"download":"Download this file","openWith":"Open with...","cta":{"saveTime":"Save some time!","installDesktop":"Install the synchronization tool for your computer","accessFiles":"Access your files directly on your computer"}},"actions":{"download":"Download"},"loading":{"error":"This file could not be loaded. Do you have a working internet connection right now?","retry":"Retry"},"error":{"noapp":"No application found to handle this file.","generic":"An error occurred when opening this file, please try again.","noNetwork":"You're currently offline."}},"Move":{"to":"Move to:","action":"Move","cancel":"Cancel","modalTitle":"Move","title":"%{smart_count} element |||| %{smart_count} elements","success":"%{subject} has been moved to %{target}. |||| %{smart_count} elements have been moved to %{target}.","error":"Something went wrong while moving this element, please try again later. |||| Something went wrong while moving these elements, please try again later.","cancelled":"%{subject} has been moved back to it's original location. |||| %{smart_count} elements have been moved back to their original location.","cancelledWithRestoreErrors":"%{subject} has been moved back to it's original location but there was an error while restoring the file from trash. |||| %{smart_count} elements have been moved back to their original location but there was %{restoreErrorsCount} error(s) while restoring the file(s) from trash.","cancelled_error":"Sorry, there was an error while moving the element back. |||| Sorry, there was an error while moving these elements back."},"ImportToDrive":{"title":"%{smart_count} element |||| %{smart_count} elements","to":"Save in:","action":"Save","cancel":"Cancel","success":"%{smart_count} saved file |||| %{smart_count} saved files","error":"Something went wrong. Please try again"},"FileOpenerExternal":{"fileNotFoundError":"Error: file not found"},"TOS":{"updated":{"title":"GDPR comes into reality !","detail":"In the context of the General Data Protection Regulation, [our Terms of Service have been updated](%{link}) and will apply to all our Cozy users on May 25, 2018.","cta":"Accept TOS and continue","disconnect":"Refuse and disconnect","error":"Something went wrong, please try again later"}},"manifest":{"permissions":{"contacts":{"description":"Required to share files with your contacts"},"groups":{"description":"Required to share files with your groups"}}},"models":{"contact":{"defaultDisplayName":"Anonymous"}},"Scan":{"scan_a_doc":"Scan a doc","save_doc":"Save the doc","filename":"Filename","save":"Save","cancel":"Cancel","qualify":"Categorize","apply":"Apply","error":{"offline":"You are currently offline and you can't use this functionnality. Try it later","uploading":"You are already uploading a file. Wait until the end of this upload and try again.","generic":"Something went wrong. Please try again."},"successful":{"qualified_ok":"You just have successfully categorized your file! "},"items":{"identity":"Identity","family":"Family","work_study":"Work","health":"Health","home":"Home","transport":"Transport","invoice":"Invoice","others":"Others","national_id_card":"ID card","passport":"Passeport","residence_permit":"Residence permit","family_record_book":"Family record book","birth_certificate":"Birth certificate","driver_license":"Driving license","wedding":"Wedding contract","pacs":"Civil union","divorce":"Divorce","large_family_card":" Large Family Card","caf":"Social benefit","diploma":"Diploma","work_contract":"Contract","pay_sheet":"Pay sheet","unemployment_benefit":"Unemployment benefit","pension":"Pension","other_revenue":"Other revenues","gradebook":"Gradebook","health_book":"Health Record","insurance_card":"Insurance card","prescription":"Prescription","health_invoice":"Health invoice","registration":"Regisration","car_insurance":"Car insurance","mechanic_invoice":"Repair bill","transport_invoice":"Transport invoice","phone_invoice":"Phone invoice","isp_invoice":"ISP invoice","energy_invoice":"Energy invoice","web_service_invoice":"Web service invoice","lease":"Lease","house_insurance":"Home insurance","rent_receipt":"Rent receipt","tax_return":"Tax return","tax_notice":"Tax notice","tax_timetable":"Payment Plans Installment Agreements","invoices":"Invoices"},"themes":{"identity":"Identity","family":"Family","work_study":"Work","health":"Health","home":"Home","transport":"Transport","invoice":"Invoice","others":"Others","undefined":"Undefined","tax":"Tax"}},"History":{"description":"The last 20 versions of your files are automatically kept. Select a version to download it.","current_version":"Current version","loading":"Loading...","noFileVersionEnabled":"Your Cozy will soon be able to archive the last modifications of a file to never risk losing them again"},"External":{"redirection":{"title":"Redirection","text":"You're about to be redirected…","error":"Error during the redirection. Generally, this means that the content of the file is not in the correct format."}},"RenameModal":{"title":"Rename","description":"You're about to change the file's extension. Do you want to continue?","continue":"Continue","cancel":"Cancel"},"Shortcut":{"title_modal":"Create a shortcut","filename":"Filename","url":"URL","cancel":"Cancel","create":"Create","created":"Your shortcut has been created","errored":"An error occured","filename_error_ends":"The name should end with .url","needs_info":"Shorcut needs at least an url and a filename","url_badformat":"Your url is not in the right format"}};

/***/ }),

/***/ "nhFO":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var svg_baker_runtime_browser_symbol__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("4BeY");
/* harmony import */ var svg_baker_runtime_browser_symbol__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(svg_baker_runtime_browser_symbol__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var svg_sprite_loader_runtime_browser_sprite_build__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("IaFt");
/* harmony import */ var svg_sprite_loader_runtime_browser_sprite_build__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(svg_sprite_loader_runtime_browser_sprite_build__WEBPACK_IMPORTED_MODULE_1__);


var symbol = new svg_baker_runtime_browser_symbol__WEBPACK_IMPORTED_MODULE_0___default.a({
  "id": "icon-type-files_d6b9e7e79f0dd5f6e7298c7c569d9cbc",
  "use": "icon-type-files_d6b9e7e79f0dd5f6e7298c7c569d9cbc-usage",
  "viewBox": "0 0 32 32",
  "content": "<symbol xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\" id=\"icon-type-files_d6b9e7e79f0dd5f6e7298c7c569d9cbc\">\n  <g fill=\"none\" fill-rule=\"evenodd\" transform=\"translate(3)\">\n    <path fill=\"#D1D5DB\" d=\"M0,2.00174332 C0,0.89621101 0.890925393,0 1.99742191,0 L19,0 L26,7 L26,29.9964051 C26,31.10296 25.1050211,32 24.0029953,32 L1.99700466,32 C0.89408944,32 0,31.1107383 0,29.9982567 L0,2.00174332 Z\" />\n    <path fill=\"#A3ACB8\" d=\"M18.5,8.57092175e-14 C18.2238576,1.33045111e-13 18,0.230796814 18,0.500435829 L18,8 L25.4995642,8 C25.7759472,8 26,7.76806641 26,7.5 L26,7 L19,0 L18.5,8.57092175e-14 Z\" />\n  </g>\n</symbol>"
});
var result = svg_sprite_loader_runtime_browser_sprite_build__WEBPACK_IMPORTED_MODULE_1___default.a.add(symbol);
/* harmony default export */ __webpack_exports__["default"] = (symbol);

/***/ }),

/***/ "nw0P":
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./_lib/build_formatting_tokens_reg_exp/index.js": "kOWh",
	"./ar/build_distance_in_words_locale/index.js": "XxX6",
	"./ar/build_format_locale/index.js": "alis",
	"./ar/index.js": "EDRf",
	"./be/build_distance_in_words_locale/index.js": "LQ09",
	"./be/build_format_locale/index.js": "kj7F",
	"./be/index.js": "YEhR",
	"./bg/build_distance_in_words_locale/index.js": "7K3h",
	"./bg/build_format_locale/index.js": "RrdL",
	"./bg/index.js": "isx8",
	"./ca/build_distance_in_words_locale/index.js": "wqqj",
	"./ca/build_format_locale/index.js": "qcV0",
	"./ca/index.js": "Vwa+",
	"./cs/build_distance_in_words_locale/index.js": "ZKDM",
	"./cs/build_format_locale/index.js": "ipyF",
	"./cs/index.js": "dvhP",
	"./da/build_distance_in_words_locale/index.js": "2Mgc",
	"./da/build_format_locale/index.js": "Gned",
	"./da/index.js": "7ur/",
	"./de/build_distance_in_words_locale/index.js": "5IWf",
	"./de/build_format_locale/index.js": "THCn",
	"./de/index.js": "bgw5",
	"./el/build_distance_in_words_locale/index.js": "o/GB",
	"./el/build_format_locale/index.js": "8T9h",
	"./el/index.js": "dH0v",
	"./en/build_distance_in_words_locale/index.js": "LZbM",
	"./en/build_format_locale/index.js": "6DAA",
	"./en/index.js": "Us+F",
	"./eo/build_distance_in_words_locale/index.js": "qrnn",
	"./eo/build_format_locale/index.js": "Bl15",
	"./eo/index.js": "UB7v",
	"./es/build_distance_in_words_locale/index.js": "GEfZ",
	"./es/build_format_locale/index.js": "O+zC",
	"./es/index.js": "/S0t",
	"./fi/build_distance_in_words_locale/index.js": "VHtQ",
	"./fi/build_format_locale/index.js": "Oydx",
	"./fi/index.js": "ndVD",
	"./fil/build_distance_in_words_locale/index.js": "uq4p",
	"./fil/build_format_locale/index.js": "d7hw",
	"./fil/index.js": "pNfm",
	"./fr/build_distance_in_words_locale/index.js": "IzMR",
	"./fr/build_format_locale/index.js": "I3Zg",
	"./fr/index.js": "LKA2",
	"./hr/build_distance_in_words_locale/index.js": "DPvn",
	"./hr/build_format_locale/index.js": "puw3",
	"./hr/index.js": "L9Jq",
	"./hu/build_distance_in_words_locale/index.js": "w2RQ",
	"./hu/build_format_locale/index.js": "/0iD",
	"./hu/index.js": "Nm+E",
	"./id/build_distance_in_words_locale/index.js": "JbvB",
	"./id/build_format_locale/index.js": "0wlw",
	"./id/index.js": "A6C3",
	"./is/build_distance_in_words_locale/index.js": "qzMC",
	"./is/build_format_locale/index.js": "S3yD",
	"./is/index.js": "N4bE",
	"./it/build_distance_in_words_locale/index.js": "MDEp",
	"./it/build_format_locale/index.js": "aUJd",
	"./it/index.js": "hmb4",
	"./ja/build_distance_in_words_locale/index.js": "nNvt",
	"./ja/build_format_locale/index.js": "buui",
	"./ja/index.js": "uAXs",
	"./ko/build_distance_in_words_locale/index.js": "oEw+",
	"./ko/build_format_locale/index.js": "9SQf",
	"./ko/index.js": "iW8+",
	"./mk/build_distance_in_words_locale/index.js": "nmwZ",
	"./mk/build_format_locale/index.js": "htxJ",
	"./mk/index.js": "GzBU",
	"./nb/build_distance_in_words_locale/index.js": "SL1f",
	"./nb/build_format_locale/index.js": "CJ5F",
	"./nb/index.js": "73vv",
	"./nl/build_distance_in_words_locale/index.js": "Uyu0",
	"./nl/build_format_locale/index.js": "doCD",
	"./nl/index.js": "hCQt",
	"./pl/build_distance_in_words_locale/index.js": "FUBD",
	"./pl/build_format_locale/index.js": "nOYf",
	"./pl/index.js": "B6yL",
	"./pt/build_distance_in_words_locale/index.js": "aTPA",
	"./pt/build_format_locale/index.js": "TTT0",
	"./pt/index.js": "gdks",
	"./ro/build_distance_in_words_locale/index.js": "gI+A",
	"./ro/build_format_locale/index.js": "njjO",
	"./ro/index.js": "r2yp",
	"./ru/build_distance_in_words_locale/index.js": "KmPx",
	"./ru/build_format_locale/index.js": "UUBw",
	"./ru/index.js": "nz/o",
	"./sk/build_distance_in_words_locale/index.js": "q2Bs",
	"./sk/build_format_locale/index.js": "9sxn",
	"./sk/index.js": "Wqan",
	"./sl/build_distance_in_words_locale/index.js": "mlv2",
	"./sl/build_format_locale/index.js": "vHkZ",
	"./sl/index.js": "KYSo",
	"./sr/build_distance_in_words_locale/index.js": "LlkS",
	"./sr/build_format_locale/index.js": "RhjJ",
	"./sr/index.js": "7mU3",
	"./sv/build_distance_in_words_locale/index.js": "UNBN",
	"./sv/build_format_locale/index.js": "zTNB",
	"./sv/index.js": "hxgj",
	"./th/build_distance_in_words_locale/index.js": "XAGa",
	"./th/build_format_locale/index.js": "We2s",
	"./th/index.js": "Pk+z",
	"./tr/build_distance_in_words_locale/index.js": "aFZF",
	"./tr/build_format_locale/index.js": "jh7A",
	"./tr/index.js": "3ZWG",
	"./zh_cn/build_distance_in_words_locale/index.js": "KdB7",
	"./zh_cn/build_format_locale/index.js": "l4EP",
	"./zh_cn/index.js": "8tMq",
	"./zh_tw/build_distance_in_words_locale/index.js": "vyyr",
	"./zh_tw/build_format_locale/index.js": "uYH7",
	"./zh_tw/index.js": "QPlQ"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "nw0P";

/***/ }),

/***/ "pr+u":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var svg_baker_runtime_browser_symbol__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("4BeY");
/* harmony import */ var svg_baker_runtime_browser_symbol__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(svg_baker_runtime_browser_symbol__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var svg_sprite_loader_runtime_browser_sprite_build__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("IaFt");
/* harmony import */ var svg_sprite_loader_runtime_browser_sprite_build__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(svg_sprite_loader_runtime_browser_sprite_build__WEBPACK_IMPORTED_MODULE_1__);


var symbol = new svg_baker_runtime_browser_symbol__WEBPACK_IMPORTED_MODULE_0___default.a({
  "id": "icon-type-zip_1ace38c6dbbbe1e7f4fb0ae579dd38d2",
  "use": "icon-type-zip_1ace38c6dbbbe1e7f4fb0ae579dd38d2-usage",
  "viewBox": "0 0 32 32",
  "content": "<symbol xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\" id=\"icon-type-zip_1ace38c6dbbbe1e7f4fb0ae579dd38d2\">\n  <g fill=\"none\" fill-rule=\"evenodd\" transform=\"translate(3)\">\n    <rect width=\"26\" height=\"32\" fill=\"#D1D5DB\" rx=\"2\" />\n    <path fill=\"#4F5B69\" d=\"M11,1 L13,1 L13,3 L11,3 L11,1 Z M11,5 L13,5 L13,7 L11,7 L11,5 Z M11,9 L13,9 L13,11 L11,11 L11,9 Z M13,3 L15,3 L15,5 L13,5 L13,3 Z M13,7 L15,7 L15,9 L13,9 L13,7 Z M11,12 L15,12 L15,19 L11,19 L11,12 Z M12,13 L14,13 L14,15 L12,15 L12,13 Z\" />\n  </g>\n</symbol>"
});
var result = svg_sprite_loader_runtime_browser_sprite_build__WEBPACK_IMPORTED_MODULE_1___default.a.add(symbol);
/* harmony default export */ __webpack_exports__["default"] = (symbol);

/***/ }),

/***/ "qxHO":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ANALYTICS_URL", function() { return ANALYTICS_URL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "normalizeData", function() { return normalizeData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getReporterConfiguration", function() { return getReporterConfiguration; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "configureReporter", function() { return configureReporter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "logException", function() { return logException; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setCozyUrl", function() { return setCozyUrl; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "logInfo", function() { return logInfo; });
/* harmony import */ var _babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("MVZn");
/* harmony import */ var _babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var raven_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("NlKi");
/* harmony import */ var raven_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(raven_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var drive_appMetadata__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("unzg");
/* harmony import */ var lib_logger__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("OTOu");


/* global __SENTRY_URL__, __DEVELOPMENT__ */



var ANALYTICS_URL =  false ? undefined : "https://29bd1255b6d544a1b65435a634c9ff67@sentry.cozycloud.cc/2"; // normalize files path on mobile, see https://github.com/getsentry/sentry-cordova/blob/17e8b3395e8ce391ecf28658d0487b97487bb509/src/js/SentryCordova.ts#L213

var normalizeUrl = function normalizeUrl(url, pathStripRe) {
  return url.replace(/^file:\/\//, 'app://').replace(pathStripRe, '');
};

var normalizeData = function normalizeData(data) {
  var PATH_STRIP_RE = /^.*\/[^.]+(\.app|CodePush|.*(?=\/))/;

  if (data.culprit) {
    data.culprit = normalizeUrl(data.culprit, PATH_STRIP_RE);
  }

  var stacktrace = data.stacktrace || data.exception && data.exception.values && data.exception.values[0] && data.exception.values[0].stacktrace;

  if (stacktrace) {
    stacktrace.frames = stacktrace.frames.map(function (frame) {
      return frame.filename !== '[native code]' ? _babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_0___default()({}, frame, {
        filename: normalizeUrl(frame.filename, PATH_STRIP_RE)
      }) : frame;
    });
  }

  return data;
};
var getReporterConfiguration = function getReporterConfiguration() {
  return {
    shouldSendCallback: true,
    environment:  true ? 'development' : undefined,
    release: drive_appMetadata__WEBPACK_IMPORTED_MODULE_2__["default"].version,
    allowSecretKey: true,
    dataCallback: normalizeData
  };
};
var configureReporter = function configureReporter() {
  raven_js__WEBPACK_IMPORTED_MODULE_1___default.a.config(ANALYTICS_URL, getReporterConfiguration()).install();
};
var logException = function logException(err) {
  var extraContext = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var fingerprint = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  return new Promise(function (resolve) {
    raven_js__WEBPACK_IMPORTED_MODULE_1___default.a.captureException(err, {
      extra: extraContext,
      fingerprint: fingerprint
    });
    lib_logger__WEBPACK_IMPORTED_MODULE_3__["default"].warn('Raven is recording exception');
    lib_logger__WEBPACK_IMPORTED_MODULE_3__["default"].error(err);
    resolve();
  });
};
var setCozyUrl = function setCozyUrl(instance) {
  raven_js__WEBPACK_IMPORTED_MODULE_1___default.a.setTagsContext({
    instance: instance
  });
};

var logMessage = function logMessage(message, serverUrl) {
  var level = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'info';
  return new Promise(function (resolve) {
    raven_js__WEBPACK_IMPORTED_MODULE_1___default.a.setUserContext = {
      url: serverUrl
    };
    raven_js__WEBPACK_IMPORTED_MODULE_1___default.a.captureMessage("[".concat(serverUrl, "] ").concat(message), {
      level: level
    });
    resolve();
  });
};

var logInfo = function logInfo(message, serverUrl) {
  return logMessage(message, serverUrl, 'info');
};

/***/ }),

/***/ "tqYW":
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./en": "koyB",
	"./en.json": "koyB"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "tqYW";

/***/ }),

/***/ "udIP":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FileOpener", function() { return FileOpener; });
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("o0o1");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("MVZn");
/* harmony import */ var _babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("yXPU");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("lwsE");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("W8MJ");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("PJYZ");
/* harmony import */ var _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("7W2i");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("a1gu");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("Nsbk");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("lSNA");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("17x9");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var react_router__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("dtw8");
/* harmony import */ var lodash_get__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__("mwIZ");
/* harmony import */ var lodash_get__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(lodash_get__WEBPACK_IMPORTED_MODULE_13__);
/* harmony import */ var cozy_ui_transpiled_react__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__("H+Xc");
/* harmony import */ var drive_web_modules_viewer_barviewer_styl__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__("xmtF");
/* harmony import */ var drive_web_modules_viewer_barviewer_styl__WEBPACK_IMPORTED_MODULE_15___default = /*#__PURE__*/__webpack_require__.n(drive_web_modules_viewer_barviewer_styl__WEBPACK_IMPORTED_MODULE_15__);
/* harmony import */ var drive_web_modules_viewer_Fallback__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__("wKlF");











function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_8___default()(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_8___default()(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_7___default()(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

/* global cozy */

/**
 * This component was previously named FileOpener
 * It has been renamed since it is used in :
 *  - an intent handler (aka service)
 *  - via cozydrive://
 */









var doNothing = function doNothing() {};

var FileNotFoundError = Object(cozy_ui_transpiled_react__WEBPACK_IMPORTED_MODULE_14__["translate"])()(function (_ref) {
  var t = _ref.t;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_10___default.a.createElement("pre", {
    className: "u-error"
  }, t('FileOpenerExternal.fileNotFoundError'));
});
var FileOpener = /*#__PURE__*/function (_Component) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_6___default()(FileOpener, _Component);

  var _super = _createSuper(FileOpener);

  function FileOpener() {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_3___default()(this, FileOpener);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_9___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "state", {
      loading: true,
      file: null
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_9___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "navigateToDrive", function () {
      var parentDir = lodash_get__WEBPACK_IMPORTED_MODULE_13___default()(_this.state, 'file.dir_id', '');

      _this.props.router.push("/folder/".concat(parentDir));
    });

    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4___default()(FileOpener, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      var routerFileId = lodash_get__WEBPACK_IMPORTED_MODULE_13___default()(this.props, 'routeParams.fileId');

      if (this.props.fileId) {
        this.loadFileInfo(this.props.fileId);
      } else if (routerFileId) {
        this.loadFileInfo(routerFileId);
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (prevProps.fileId !== this.props.fileId) {
        return this.loadFileInfo(this.props.fileId);
      }

      var previousRouterFileId = lodash_get__WEBPACK_IMPORTED_MODULE_13___default()(prevProps, 'routeParams.fileId');
      var routerFileId = lodash_get__WEBPACK_IMPORTED_MODULE_13___default()(this.props, 'routeParams.fileId');

      if (previousRouterFileId !== routerFileId) {
        return this.loadFileInfo(routerFileId);
      }
    }
  }, {
    key: "loadFileInfo",
    value: function () {
      var _loadFileInfo = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(id) {
        var resp, file;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                this.setState({
                  fileNotFound: false
                });
                _context.next = 4;
                return cozy.client.files.statById(id, false);

              case 4:
                resp = _context.sent;
                file = _babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_1___default()({}, resp, resp.attributes, {
                  id: resp._id
                });
                this.setState({
                  file: file,
                  loading: false
                });
                _context.next = 13;
                break;

              case 9:
                _context.prev = 9;
                _context.t0 = _context["catch"](0);
                this.setState({
                  fileNotFound: true,
                  loading: false
                });
                cozy_ui_transpiled_react__WEBPACK_IMPORTED_MODULE_14__["Alerter"].error('alert.could_not_open_file');

              case 13:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 9]]);
      }));

      function loadFileInfo(_x) {
        return _loadFileInfo.apply(this, arguments);
      }

      return loadFileInfo;
    }()
  }, {
    key: "render",
    value: function render() {
      var _this$state = this.state,
          file = _this$state.file,
          loading = _this$state.loading,
          fileNotFound = _this$state.fileNotFound;
      var _this$props = this.props,
          _this$props$withClose = _this$props.withCloseButtton,
          withCloseButtton = _this$props$withClose === void 0 ? true : _this$props$withClose,
          t = _this$props.t;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_10___default.a.createElement("div", {
        className: drive_web_modules_viewer_barviewer_styl__WEBPACK_IMPORTED_MODULE_15___default.a['viewer-wrapper-with-bar']
      }, loading && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_10___default.a.createElement(cozy_ui_transpiled_react__WEBPACK_IMPORTED_MODULE_14__["Spinner"], {
        size: "xxlarge",
        loadingType: "message",
        middle: true
      }), fileNotFound && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_10___default.a.createElement(FileNotFoundError, null), !loading && !fileNotFound && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_10___default.a.createElement(cozy_ui_transpiled_react__WEBPACK_IMPORTED_MODULE_14__["Viewer"], {
        files: [file],
        currentIndex: 0,
        onChangeRequest: doNothing,
        onCloseRequest: withCloseButtton ? this.navigateToDrive : null,
        renderFallbackExtraContent: function renderFallbackExtraContent(file) {
          return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_10___default.a.createElement(drive_web_modules_viewer_Fallback__WEBPACK_IMPORTED_MODULE_16__["default"], {
            file: file,
            t: t
          });
        }
      }));
    }
  }]);

  return FileOpener;
}(react__WEBPACK_IMPORTED_MODULE_10__["Component"]);
FileOpener.propTypes = {
  router: prop_types__WEBPACK_IMPORTED_MODULE_11___default.a.shape({
    push: prop_types__WEBPACK_IMPORTED_MODULE_11___default.a.func.isRequired,
    params: prop_types__WEBPACK_IMPORTED_MODULE_11___default.a.shape({
      fileId: prop_types__WEBPACK_IMPORTED_MODULE_11___default.a.string.isRequired
    }).isRequired
  }),
  routeParams: prop_types__WEBPACK_IMPORTED_MODULE_11___default.a.shape({
    fileId: prop_types__WEBPACK_IMPORTED_MODULE_11___default.a.string
  }),
  fileId: prop_types__WEBPACK_IMPORTED_MODULE_11___default.a.string,
  withCloseButtton: prop_types__WEBPACK_IMPORTED_MODULE_11___default.a.bool
};
/* harmony default export */ __webpack_exports__["default"] = (Object(cozy_ui_transpiled_react__WEBPACK_IMPORTED_MODULE_14__["translate"])()(Object(react_router__WEBPACK_IMPORTED_MODULE_12__["withRouter"])(FileOpener)));

/***/ }),

/***/ "unzg":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var drive_targets_manifest_webapp__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("XA+M");
/* harmony import */ var drive_targets_manifest_webapp__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(drive_targets_manifest_webapp__WEBPACK_IMPORTED_MODULE_0__);

var appMetadata = {
  slug: drive_targets_manifest_webapp__WEBPACK_IMPORTED_MODULE_0___default.a.slug,
  version: drive_targets_manifest_webapp__WEBPACK_IMPORTED_MODULE_0___default.a.version
};
/* harmony default export */ __webpack_exports__["default"] = (appMetadata);

/***/ }),

/***/ "w0Z6":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var svg_baker_runtime_browser_symbol__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("4BeY");
/* harmony import */ var svg_baker_runtime_browser_symbol__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(svg_baker_runtime_browser_symbol__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var svg_sprite_loader_runtime_browser_sprite_build__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("IaFt");
/* harmony import */ var svg_sprite_loader_runtime_browser_sprite_build__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(svg_sprite_loader_runtime_browser_sprite_build__WEBPACK_IMPORTED_MODULE_1__);


var symbol = new svg_baker_runtime_browser_symbol__WEBPACK_IMPORTED_MODULE_0___default.a({
  "id": "icon-type-folder_f49493c812ab389aaac1e61434f7995f",
  "use": "icon-type-folder_f49493c812ab389aaac1e61434f7995f-usage",
  "viewBox": "0 0 32 32",
  "content": "<symbol xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\" id=\"icon-type-folder_f49493c812ab389aaac1e61434f7995f\">\n  <g fill=\"none\" fill-rule=\"evenodd\" transform=\"translate(0 2)\">\n    <rect width=\"32\" height=\"26\" y=\"2\" fill=\"#B2D3FF\" rx=\"2\" />\n    <path fill=\"#197BFF\" d=\"M0,0.990777969 C0,0.443586406 0.449948758,0 1.00684547,0 L12.9931545,0 C13.5492199,0 14.3125,0.3125 14.7107565,0.71075654 L15.2892435,1.28924346 C15.6817835,1.68178346 16.4446309,2 17.0008717,2 L30.0059397,2 C31.1072288,2 32,2.89470506 32,4 L32,4 L17.0008717,4 C16.4481055,4 15.6875,4.3125 15.2892435,4.71075654 L14.7107565,5.28924346 C14.3182165,5.68178346 13.5500512,6 12.9931545,6 L1.00684547,6 C0.450780073,6 0,5.54902482 0,5.00922203 L0,0.990777969 Z\" />\n  </g>\n</symbol>"
});
var result = svg_sprite_loader_runtime_browser_sprite_build__WEBPACK_IMPORTED_MODULE_1___default.a.add(symbol);
/* harmony default export */ __webpack_exports__["default"] = (symbol);

/***/ }),

/***/ "wKlF":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("17x9");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _CallToAction__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("VL2R");
/* harmony import */ var _NoViewerButton__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("x8J/");





var Fallback = function Fallback(_ref) {
  var file = _ref.file,
      t = _ref.t;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_NoViewerButton__WEBPACK_IMPORTED_MODULE_3__["default"], {
    file: file,
    t: t
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_CallToAction__WEBPACK_IMPORTED_MODULE_2__["default"], {
    t: t
  }));
};

Fallback.propTypes = {
  file: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.object.isRequired,
  t: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func.isRequired // t is a prop passed by the parent and must not be received from the translate() HOC — otherwise the translation context becomes the one of the viewer instad of the app. See https://github.com/cozy/cozy-ui/issues/914#issuecomment-487959521

};
/* harmony default export */ __webpack_exports__["default"] = (Fallback);

/***/ }),

/***/ "x8J/":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("o0o1");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("MVZn");
/* harmony import */ var _babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("yXPU");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("lwsE");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("W8MJ");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("PJYZ");
/* harmony import */ var _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("7W2i");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("a1gu");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("Nsbk");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("lSNA");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("17x9");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("/MKj");
/* harmony import */ var cozy_ui_transpiled_react__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__("H+Xc");
/* harmony import */ var drive_lib_reporter__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__("qxHO");
/* harmony import */ var cozy_device_helper__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__("snfs");
/* harmony import */ var cozy_device_helper__WEBPACK_IMPORTED_MODULE_15___default = /*#__PURE__*/__webpack_require__.n(cozy_device_helper__WEBPACK_IMPORTED_MODULE_15__);
/* harmony import */ var drive_mobile_modules_offline_duck__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__("iTW1");











function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_8___default()(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_8___default()(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_7___default()(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }









var AsyncActionButton = /*#__PURE__*/function (_React$Component) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_6___default()(AsyncActionButton, _React$Component);

  var _super = _createSuper(AsyncActionButton);

  function AsyncActionButton() {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_3___default()(this, AsyncActionButton);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_9___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "state", {
      loading: false
    });

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_9___default()(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5___default()(_this), "onClick", /*#__PURE__*/_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee() {
      var _this$props, onClick, onError;

      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _this$props = _this.props, onClick = _this$props.onClick, onError = _this$props.onError;

              _this.setState(function (state) {
                return _babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_1___default()({}, state, {
                  loading: true
                });
              });

              _context.prev = 2;
              _context.next = 5;
              return onClick();

            case 5:
              _context.next = 10;
              break;

            case 7:
              _context.prev = 7;
              _context.t0 = _context["catch"](2);
              onError(_context.t0);

            case 10:
              _this.setState(function (state) {
                return _babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_1___default()({}, state, {
                  loading: false
                });
              });

            case 11:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[2, 7]]);
    })));

    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4___default()(AsyncActionButton, [{
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          label = _this$props2.label,
          className = _this$props2.className;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_10___default.a.createElement(cozy_ui_transpiled_react__WEBPACK_IMPORTED_MODULE_13__["Button"], {
        busy: this.state.loading,
        className: className,
        onClick: this.onClick,
        label: label
      });
    }
  }]);

  return AsyncActionButton;
}(react__WEBPACK_IMPORTED_MODULE_10___default.a.Component);

var OpenWithCordovaButton = Object(react_redux__WEBPACK_IMPORTED_MODULE_12__["connect"])(null, function (dispatch, ownProps) {
  return {
    openLocalFileCopy: function openLocalFileCopy() {
      return dispatch(Object(drive_mobile_modules_offline_duck__WEBPACK_IMPORTED_MODULE_16__["openLocalFileCopy"])(ownProps.file));
    }
  };
})(function (_ref2) {
  var t = _ref2.t,
      openLocalFileCopy = _ref2.openLocalFileCopy;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_10___default.a.createElement(AsyncActionButton, {
    onClick: openLocalFileCopy,
    onError: function onError(error) {
      if (/^Activity not found/.test(error.message)) {
        cozy_ui_transpiled_react__WEBPACK_IMPORTED_MODULE_13__["Alerter"].error('Viewer.error.noapp', error);
      } else {
        Object(drive_lib_reporter__WEBPACK_IMPORTED_MODULE_14__["logException"])(error);
        cozy_ui_transpiled_react__WEBPACK_IMPORTED_MODULE_13__["Alerter"].error('Viewer.error.generic', error);
      }
    },
    label: t('Viewer.noviewer.openWith')
  });
});

var DownloadButton = function DownloadButton(_ref3, _ref4) {
  var t = _ref3.t,
      file = _ref3.file;
  var client = _ref4.client;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_10___default.a.createElement(cozy_ui_transpiled_react__WEBPACK_IMPORTED_MODULE_13__["Button"], {
    onClick: function onClick() {
      return client.collection('io.cozy.files').download(file);
    },
    label: t('Viewer.noviewer.download')
  });
};

DownloadButton.contextTypes = {
  client: prop_types__WEBPACK_IMPORTED_MODULE_11___default.a.object.isRequired
};

var NoViewerButton = function NoViewerButton(_ref5) {
  var file = _ref5.file,
      t = _ref5.t;
  if (Object(cozy_device_helper__WEBPACK_IMPORTED_MODULE_15__["isMobileApp"])()) return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_10___default.a.createElement(OpenWithCordovaButton, {
    t: t,
    file: file
  });else return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_10___default.a.createElement(DownloadButton, {
    t: t,
    file: file
  });
};

/* harmony default export */ __webpack_exports__["default"] = (NoViewerButton);

/***/ }),

/***/ "xNZN":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var svg_baker_runtime_browser_symbol__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("4BeY");
/* harmony import */ var svg_baker_runtime_browser_symbol__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(svg_baker_runtime_browser_symbol__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var svg_sprite_loader_runtime_browser_sprite_build__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("IaFt");
/* harmony import */ var svg_sprite_loader_runtime_browser_sprite_build__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(svg_sprite_loader_runtime_browser_sprite_build__WEBPACK_IMPORTED_MODULE_1__);


var symbol = new svg_baker_runtime_browser_symbol__WEBPACK_IMPORTED_MODULE_0___default.a({
  "id": "icon-type-text_e665c2558003a9b72fa156bcef81b180",
  "use": "icon-type-text_e665c2558003a9b72fa156bcef81b180-usage",
  "viewBox": "0 0 32 32",
  "content": "<symbol xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\" id=\"icon-type-text_e665c2558003a9b72fa156bcef81b180\">\n  <g fill=\"none\" fill-rule=\"evenodd\" transform=\"translate(3)\">\n    <path fill=\"#B2D3FF\" d=\"M0,2.00174332 C0,0.89621101 0.890925393,0 1.99742191,0 L19,0 L26,7 L26,29.9964051 C26,31.10296 25.1050211,32 24.0029953,32 L1.99700466,32 C0.89408944,32 0,31.1107383 0,29.9982567 L0,2.00174332 Z\" />\n    <path fill=\"#197BFF\" d=\"M18.5.57092175e-14C18.2238576.33045111e-13 18 .230796814 18 .500435829L18 8 25.4995642 8C25.7759472 8 26 7.76806641 26 7.5L26 7 19 0 18.5.57092175e-14zM6 11L20 11 20 13 6 13 6 11zM6 15L18 15 18 17 6 17 6 15zM6 19L20 19 20 21 6 21 6 19zM6 23L16 23 16 25 6 25 6 23z\" />\n  </g>\n</symbol>"
});
var result = svg_sprite_loader_runtime_browser_sprite_build__WEBPACK_IMPORTED_MODULE_1___default.a.add(symbol);
/* harmony default export */ __webpack_exports__["default"] = (symbol);

/***/ }),

/***/ "xmtF":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
module.exports = {"viewer-wrapper-with-bar":"viewer-wrapper-with-bar---1EQs"};

/***/ }),

/***/ "z6Q1":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DOCTYPE_FILES", function() { return DOCTYPE_FILES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DOCTYPE_ALBUMS", function() { return DOCTYPE_ALBUMS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DOCTYPE_PHOTOS_SETTINGS", function() { return DOCTYPE_PHOTOS_SETTINGS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DOCTYPE_APPS", function() { return DOCTYPE_APPS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DOCTYPE_CONTACTS_VERSION", function() { return DOCTYPE_CONTACTS_VERSION; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "schema", function() { return schema; });
/* harmony import */ var _babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("MVZn");
/* harmony import */ var _babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var models__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("OjRq");
/* harmony import */ var drive_lib_extraDoctypes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("6dOw");



var DOCTYPE_FILES = 'io.cozy.files';
var DOCTYPE_ALBUMS = 'io.cozy.photos.albums';
var DOCTYPE_PHOTOS_SETTINGS = 'io.cozy.photos.settings';
var DOCTYPE_APPS = 'io.cozy.apps';
var DOCTYPE_CONTACTS_VERSION = 2;
var schema = _babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_0___default()({
  files: {
    doctype: DOCTYPE_FILES,
    relationships: {
      old_versions: {
        type: 'has-many',
        doctype: 'io.cozy.files.versions'
      }
    }
  },
  contacts: {
    doctype: models__WEBPACK_IMPORTED_MODULE_1__["Contact"].doctype,
    doctypeVersion: DOCTYPE_CONTACTS_VERSION
  },
  groups: {
    doctype: models__WEBPACK_IMPORTED_MODULE_1__["Group"].doctype
  },
  versions: {
    doctype: 'io.cozy.files.versions'
  }
}, drive_lib_extraDoctypes__WEBPACK_IMPORTED_MODULE_2__["default"]);

/***/ })

/******/ });
//# sourceMappingURL=drive.js.map