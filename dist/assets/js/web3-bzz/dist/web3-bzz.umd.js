(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@babel/runtime/helpers/classCallCheck'), require('@babel/runtime/helpers/createClass'), require('lodash/isObject'), require('lodash/isString'), require('swarm-js')) :
    typeof define === 'function' && define.amd ? define(['exports', '@babel/runtime/helpers/classCallCheck', '@babel/runtime/helpers/createClass', 'lodash/isObject', 'lodash/isString', 'swarm-js'], factory) :
    (factory((global.Web3Bzz = {}),global._classCallCheck,global._createClass,global.isObject,global.isString,global.swarm));
}(this, (function (exports,_classCallCheck,_createClass,isObject,isString,swarm) { 'use strict';

    _classCallCheck = _classCallCheck && _classCallCheck.hasOwnProperty('default') ? _classCallCheck['default'] : _classCallCheck;
    _createClass = _createClass && _createClass.hasOwnProperty('default') ? _createClass['default'] : _createClass;
    isObject = isObject && isObject.hasOwnProperty('default') ? isObject['default'] : isObject;
    isString = isString && isString.hasOwnProperty('default') ? isString['default'] : isString;

    var Bzz =
    function () {
      function Bzz(provider) {
        _classCallCheck(this, Bzz);
        this.givenProvider = Bzz.givenProvider;
        this.currentProvider = null;
        this.setProvider(provider);
      }
      _createClass(Bzz, [{
        key: "pick",
        value: function pick() {
          if (typeof document !== 'undefined') {
            return this.swarm.pick;
          }
          throw new Error('Pick is not supported for this environment.');
        }
      }, {
        key: "download",
        value: function download(bzzHash, localPath) {
          if (this.hasProvider()) {
            return this.swarm.download(bzzHash, localPath);
          }
          this.throwProviderError();
        }
      }, {
        key: "upload",
        value: function upload(data) {
          if (this.hasProvider()) {
            return this.swarm.upload(data);
          }
          this.throwProviderError();
        }
      }, {
        key: "isAvailable",
        value: function isAvailable() {
          if (this.hasProvider()) {
            return this.swarm.isAvailable();
          }
          this.throwProviderError();
        }
      }, {
        key: "hasProvider",
        value: function hasProvider() {
          return !!this.currentProvider;
        }
      }, {
        key: "throwProviderError",
        value: function throwProviderError() {
          throw new Error('No provider set, please set one using bzz.setProvider().');
        }
      }, {
        key: "setProvider",
        value: function setProvider(provider) {
          if (isObject(provider) && isString(provider.bzz)) {
            provider = provider.bzz;
          }
          if (isString(provider)) {
            this.currentProvider = provider;
            this.swarm = swarm.at(provider);
            return true;
          }
          this.currentProvider = null;
          return false;
        }
      }]);
      return Bzz;
    }();
    Bzz.givenProvider = null;
    if (typeof ethereumProvider !== 'undefined' && ethereumProvider.bzz) {
      Bzz.givenProvider = ethereumProvider.bzz;
    }

    exports.Bzz = Bzz;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
