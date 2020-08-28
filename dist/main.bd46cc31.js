// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"epB2":[function(require,module,exports) {
var $siteList = $('.siteList');
var $lastLi = $siteList.find('li.last');
var $dialogMask = $('.dialog-mask');
var $modifyNameInput = $('.modify_name_input');
var $modifyUrlInput = $('.modify_url_input');
var history = JSON.parse(localStorage.getItem('history')); // 判断输入框是否获取了焦点

var isInputFocus = false;
var modifyObj = null;
var hashMapActiveIndex;
var hashMap = history || [{
  logo: 'V',
  url: 'https://cn.vuejs.org/',
  modified: false
}, {
  logo: 'R',
  url: 'https://react.docschina.org/',
  modified: false
}, {
  logo: 'J',
  url: 'https://jquery.cuishifeng.cn/',
  modified: false
}];

var simplyUrl = function simplyUrl(url) {
  return url.replace('https://', '').replace('http://', '').replace('www.', '').replace(/\/.*/, ''); // 删除 / 开头的内容
};

var render = function render() {
  $siteList.find('li:not(.last)').remove();
  hashMap.forEach(function (node, index) {
    node.name = node.modified ? node.name : simplyUrl(node.url);
    var $li;

    if (node.modified) {
      $li = $("\n        <li>\n          <div class=\"site\">\n            <div class=\"logo\">".concat(node.logo, "</div>\n            <div class=\"link\">").concat(node.name, "</div>\n            <div class=\"point\">\n              <svg class=\"icon\" aria-hidden=\"true\">\n                <use xlink:href=\"#icon-point\"></use>\n              </svg>\n            </div>\n          </div>\n        </li>\n      ")).insertBefore($lastLi);
    } else {
      $li = $("\n        <li>\n          <div class=\"site\">\n            <div class=\"logo\">".concat(node.logo, "</div>\n            <div class=\"link\">").concat(simplyUrl(node.url), "</div>\n            <div class=\"point\">\n              <svg class=\"icon\" aria-hidden=\"true\">\n                <use xlink:href=\"#icon-point\"></use>\n              </svg>\n            </div>\n          </div>\n        </li>\n      ")).insertBefore($lastLi);
    }

    $li.on('click', function () {
      window.open(node.url);
    });
    $li.on('click', '.point', function (e) {
      e.stopPropagation(); // 保存索引

      hashMapActiveIndex = index;
      $dialogMask.show();
      modifyObj = {
        logo: hashMap[index].logo,
        url: hashMap[index].url,
        name: hashMap[index].name,
        modified: false
      };
      $modifyNameInput.val(hashMap[index].name);
      $modifyUrlInput.val(hashMap[index].url);
    });
  });
}; // 重置中间变量


var resetModifyObj = function resetModifyObj() {
  modifyObj = null;
  hashMapActiveIndex = undefined;
};

render(); // 存储输入框获取焦点的状态

Array.from(document.getElementsByTagName('input')).forEach(function (input) {
  $(input).focus(function () {
    return isInputFocus = true;
  });
  $(input).blur(function () {
    return isInputFocus = false;
  });
});
$('.addButton').on('click', function () {
  var url = window.prompt('请问你要输入的网址是什么');
  if (!url) return;

  if (url.indexOf('http') !== 0) {
    url = 'https://' + url;
  }

  hashMap.push({
    logo: simplyUrl(url)[0],
    logoType: 'text',
    url: url
  });
  render();
});
$modifyNameInput.on('change', function (e) {
  modifyObj.name = $modifyNameInput.val();
  modifyObj.modified = true;
});
$modifyUrlInput.on('change', function (e) {
  modifyObj.logo = simplyUrl($modifyUrlInput.val())[0];
  var url = $modifyUrlInput.val();

  if (url.indexOf('http') !== 0) {
    url = 'https://' + url;
  }

  modifyObj.url = url;
  modifyObj.modified = true;
});
$('.cancel').on('click', function () {
  $dialogMask.hide('fast');
  resetModifyObj();
});
$('.remove').on('click', function () {
  hashMap.splice(hashMapActiveIndex, 1);
  $dialogMask.hide('fast');
  resetModifyObj();
  render();
});
$('.complete').on('click', function () {
  hashMap.splice(hashMapActiveIndex, 1, modifyObj);
  $dialogMask.hide('fast');
  resetModifyObj();
  render();
});
$(document).on('keypress', function (e) {
  var key = e.key;

  for (var i = 0; i < hashMap.length; i++) {
    if (hashMap[i].logo.toLowerCase() === key && !isInputFocus) {
      window.open(hashMap[i].url);
    }
  }
});

window.onbeforeunload = function () {
  localStorage.setItem('history', JSON.stringify(hashMap));
};
},{}]},{},["epB2"], null)
//# sourceMappingURL=main.bd46cc31.js.map