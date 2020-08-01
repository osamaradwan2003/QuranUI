/* jshint esversion: 6, proto: true */

// start helpers Methods

function cls() {
  console.clear();
  return;
}

function print(...msg) {
  return console.log(...msg);
}

function error(msg) {
  throw msg;
}

let htmlRegex = new RegExp(/<([A-Za-z][A-Za-z0-9]*)\b[^>]*>(.*?)<\/\1>/);
String.prototype.isHtml = function () {
  return htmlRegex.test(this);
};

String.prototype.htmlFromStr = function () {
  if (this.isHtml()) {
    let temp, ele;
    ele = this;
    temp = document.createElement("div");
    temp.innerHTML = ele;
    ele = temp.children;
    return ele;
  } else {
    error("This String Is not a Like Html");
    return this;
  }
};

String.prototype.each = function (callback, i) {
  each.call(this, callback);
  return this;
};

Array.prototype.each = function (callback) {
  each.call(this, callback);
  return this;
};

Array.prototype.isEmpty = function () {
  return this.length == 0 || this.length == undefined;
};

Object.prototype.each = function (callback) {
  each.call(this, callback);
  return this;
};

Object.prototype.isEmpty = function () {
  if (Object.keys(this).length == 0 && this.constructor === Object) {
    return true;
  }
  return false;
};

/**
 *
 * @param {Function} callback
 */

function each(callback) {
  if (!isFunc(callback)) return;
  let i = 0,
    len = this.length;
  if (Array.isArray(this) || isArrLike(this) || typeof this == "string") {
    for (; i < len;) {
      callback.call(this[i], this[i], i);
      i++;
    }
  } else if (len == undefined || typeof this == "object") {
    for (let key in this) {
      callback.call(this[key], this[key], key);
    }
  }
  return this;
}

/**
 *
 * @param {Function} arg
 * @returns {boolean}
 */
function isFunc(arg) {
  let t = toString.call(arg);
  return t == "[object Function]" || typeof t == "function";
}

function isArrLike(obj) {
  let t = type(obj),
    length = !!obj && "length" in obj && obj.length;

  if (isFunc(obj) || isWindow(obj)) return false;

  return (
    t === "array" ||
    length === 0 ||
    (typeof length === "number" && length > 0 && length - 1 in obj)
  );
}

// end helpers varabuls

/**
 * start Codeing  library
 */

/**
 * @param {Function} factory
 * @param {Window} global
 */

(function (global, factory) {
  "use strict";

  if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = global.document ?
      factory(global, true) :
      function (w) {
        if (!w.document) {
          error("UI Require window with a document");
        }
        return factory(w);
      };
  } else {
    factory(global);
  }
})(
  typeof window !== "undefined" ? window : this,
  (function (w, noGlobal) {
    "use strict";

    /**
     * @param {Element | Array | Node} element
     */
    var UI = function (element) {
      /**
        *ui(element) -> {
            methods
        }
        ui(element).val,.html.text.fade
        */

      return new UI.pr.init(element);
    };

    var arr = [],
      doc = document || doc,
      slice = arr.slice,
      push = arr.push,
      c2t = {},
      toStr = c2t.toString,
      getprot = c2t.getPrototypeOf,
      hasOwn = c2t.hasOwnProperty,
      fntostr = hasOwn.toString,
      objfstr = fntostr.call(Object);

    UI.pr = UI.prototype = {
      test: function () {
        print(this.text());
      },
      end: function (index) {
        if (index) {
          let self = this;
          for (let i = 0; i <= index; i++) {
            if (self.prev !== undefined) {
              self = self.end();
            } else {
              self = UI(document);
              break;
            }
          }
          return self;
        }
        return this.prev !== undefined ? this.prev : UI(document);
      },
      each: function (callback) {
        each.call(this, callback);
        return this;
      },

      /**
       *
       * @param {Number} index
       */
      eq: function (index) {
        index = parseInt(index) || 0;
        let prev = this;
        let n = new UI.pr.init(this[index], prev);
        return n;
      },

      text: function (val) {
        if (!val || val.isEmpty()) {
          let text = [];
          this.get_set_ele_prop("textContent", function (e, i) {
            text.push(this);
          });
          return !text.isEmpty() ? (text.length == 1 ? text[0] : text) : "";
        } else {
          this.get_set_ele_prop("textContent", function (e, i) {
            e[i] = val;
          });
          return this;
        }
      },
      html: function (val, appendType) {
        if (!val || val.isEmpty()) {
          let html = [];
          this.get_set_ele_prop("innerHTML", function (e, i) {
            html.push(this);
          });
          return !html.isEmpty() ? (html.length == 1 ? html[0] : html) : "";
        } else {
          if (appendType) {
            this.each(function () {
              this.insertAdjacentHTML(appendType, val);
            });
          } else {
            this.get_set_ele_prop("innerHTML", function (e, i) {
              e[i] = val;
            });
          }
          return this;
        }
      },
      val: function (val) {
        if (!val || val.isEmpty()) {
          let val = [];
          this.get_set_ele_prop("value", function (e, i) {
            val.push(this);
          });
          return !val.isEmpty() ? (val.length == 1 ? val[0] : val) : "";
        } else {
          this.get_set_ele_prop("value", function (e, i) {
            e[i] = val;
          });
          return this;
        }
      },

      /**
       * css function to get or set css property into Element
       * exapmles:
       * => css("font-size, font-weight") return arr has a values ["16px", "400"]
       * => css("font-size") return value "16px"
       * => css({font-size: 18, font-weight: "bold"}) set values and return UI constractur
       * => css("font-size" "18") set values and return arr has a values ["16px", "400"]
       *
       * @param {Object | string} prop
       * @param {String} val
       * @returns {UI | Array}
       *
       */
      css: function (prop, val) {
        let self = this;
        if (!val || val.isEmpty()) {
          if (typeof prop == "string") {
            let computed = [],
              splited = prop.split(",");
            if (Array.isArray(splited)) {
              splited.each(function (prop) {
                self.get_computed_style(prop.trim(), function () {
                  computed.push(this);
                });
              });
            } else {
              this.get_computed_style(prop.trim(), function () {
                computed.push(this);
              });
            }
            return computed != [] && !computed.isEmpty() ?
              computed.length == 1 ?
              computed[0] :
              computed :
              undefined;
          } else if (typeof prop == "object") {
            prop.each(function (val, k) {
              self.get_set_ele_prop("style", function (e, p) {
                if (typeof val == "number") val += "px";
                e[p][k] = val;
              });
            });
            return this;
          }
        } else {
          this.get_set_ele_prop("style", function (e, p) {
            e[p][prop] = val;
          });
          return this;
        }
      },
      /**
       *
       * @param {Number | string} speed
       * @param {Function} callback
       * show Elemnt if this hide => (display: "none")
       */
      delay: function (secound) {
        secound = this.get_speed(secound);
        let start = new Date();
        while (true) {
          if (new Date() - start > secound) {
            return this;
          }
        }
      },
      /**
       *
       * @param {Event} evt
       * @param {Function} callback
       * @param {Boolean} options
       * @returns {UI}
       * on() function set event to elem
       * examples s("div").on("click", function(e,i) {
       *      console.log(e)
       * })
       */
      on: function (evt, callback, preventDefulte = false, opt = false) {
        if (!isFunc(callback)) return UI.err("Callback is Not a function");
        evt = evt.toLowerCase().split(" ");
        let self = this;
        this.each(function (e, i) {
          evt.each(function () {
            let event = this;
            if (event == "hover") event = "mousemove";
            e.addEventListener(
              event,
              function (ev) {
                if (preventDefulte) ev.preventDefault();
                if (isFunc(callback)) {
                  callback.call(e, ev, i, self);
                }
              },
              opt
            );
          });
        });
        return this;
      },
      /**
       *
       * @param {String | Attr} attrName
       * @param {String} attrVal
       */
      attr: function (attrName, attrVal) {
        if (!attrName) return this;

        if (attrVal) {
          this.each(function () {
            this.setAttribute(attrName, attrVal);
          });
          return this;
        } else {
          let arr = [];
          if (!UI.isEmpty(attrName)) {
            this.each(function () {
              arr.push(this.getAttribute(attrName));
            });
            return arr.length == 1 ? arr[0] : arr;
          }
        }
      },

      /**
       *
       * @param {String} className
       */
      addClass: function (className) {
        if (UI.isEmpty(className)) return UI.err("Pleas Input Class Name");
        if (type(className) != "string") {
          return UI.err("Class Name is Note String");
        }
        this.each(function () {
          this.classList.add(className);
        });
        return this;
      },
      /**
       *
       * @param {String} className
       */
      removeClass: function (className) {
        if (UI.isEmpty(className)) return UI.err("Pleas Input Class Name");
        if (type(className) != "string") {
          return UI.err("Class Name is Note String");
        }
        this.each(function () {
          this.classList.remove(className);
        });
        return this;
      },
      /**
       *
       * @param {String} className
       */
      toggleClass: function (className) {
        if (UI.isEmpty(className)) return UI.err("Pleas Input Class Name");
        if (type(className) != "string") {
          return UI.err("Class Name is Note String");
        }
        this.each(function () {
          this.classList.toggle(className);
        });
        return this;
      },
      /**
       *
       * @param {String} className
       * @returns {Boolean}
       */
      hasClass: function (className) {
        if (UI.isEmpty(className)) return UI.err("Pleas Input Class Name");
        if (type(className) != "string") {
          return UI.err("Class Name is Note String");
        }
        let classList = [];
        this.each(function () {
          classList.push(...UI.makeArr(this.classList));
          //return classList;
        });
        return classList.indexOf(className) >= 0 ? true : false;
      },
      /**
       *
       * @param {String | Element} selector
       */
      parentUntil: function (selector) {
        if (!UI.isElem(selector)) selector = document.querySelector(selector);
        let parentNode = this.makeParentTree();
        let matches = [];
        this.each(function (_, i) {
          let j = 0;
          while (j < parentNode[i].length) {
            if (matches.indexOf(parentNode[i][j]) >= 0) {
              j++;
              continue;
            }
            if (selector == parentNode[i][j]) {
              matches.push(parentNode[i][j]);
              break;
            }
            matches.push(parentNode[i][j]);
            j++;
          }
        });
        return new UI.pr.init(matches, this);
      },
      /**
       *
       * @param {String | Element} selector
       */
      parents: function (selector) {
        if (!UI.isElem(selector)) selector = UI.makeArr(document.querySelectorAll(selector));
        let parentNode = this.makeParentTree();
        let matches = [];
        this.each(function (_, i) {
          let j = 0;
          prf:
            for (; j < parentNode[i].length;) {
              if (matches.indexOf(parentNode[i][j]) >= 0) {
                j++;
                continue;
              }
              for (let z = 0; z < selector.length; z++) {
                if (selector[z] == parentNode[i][j]) {
                  matches.push(selector[z]);
                  break prf;
                }
              }
              j++;
            }
        });

        return new UI.pr.init(matches, this);
      },
      /**
       *
       * @param {String | Element} selector
       */
      parent: function () {
        let matches = [];
        this.each(function (_, i) {
          if (matches.indexOf(this.parentElement) == -1) {
            matches.push(this.parentElement);
          }
        });

        return new UI.pr.init(matches, this);
      },
      /**
       *
       * @param {String | Element} selector
       */
      siblings: function (selector) {
        if (!UI.isElem(selector))
          selector = UI.makeArr(document.querySelectorAll(selector));
        let matc = [];
        this.each(function () {
          let parent = this.parentElement;
          let child = [...UI.makeArr(parent.children)];
          let j = 0;
          while (j < child.length) {
            if (this == child[j] || matc.indexOf(child[j]) >= 0) {
              j++;
              continue;
            }
            if (!UI.isEmpty(selector)) {
              if (selector.indexOf(child[j]) >= 0) {
                selector.each(function () {
                  matc.push(this);
                });
              }
            } else {
              matc.push(child[j]);
            }
            //console.log(selector.indexOf(child[j]) >= 0, child[j]);
            j++;
          }
        });
        return new UI.pr.init(matc, this);
      },
      next: function () {
        let matc = [];
        this.each(function () {
          if (
            !UI.isEmpty(this.nextElementSibling) &&
            this.nextElementSibling != null
          ) {
            matc.push(this.nextElementSibling);
          }
        });
        return new UI.pr.init(matc, this);
      },
      prev: function () {
        let matc = [];
        this.each(function () {
          if (
            !UI.isEmpty(this.previousElementSibling) &&
            this.previousElementSibling != null
          ) {
            matc.push(this.previousElementSibling);
          }
        });
        return new UI.pr.init(matc, this);
      },
      /**
       *
       * @param {String | Element} selector
       */
      children: function (selector) {
        if (!UI.isElem(selector))
          selector = UI.makeArr(document.querySelectorAll(selector));
        let matc = [];
        this.each(function () {
          let child = [...UI.makeArr(this.children)];
          let j = 0;
          while (j < child.length) {
            if (this == child[j] || matc.indexOf(child[j]) >= 0) {
              j++;
              continue;
            }
            if (!UI.isEmpty(selector)) {
              if (selector.indexOf(child[j]) >= 0) {
                selector.each(function () {
                  matc.push(this);
                });
              }
            } else {
              matc.push(child[j]);
            }
            //console.log(selector.indexOf(child[j]) >= 0, child[j]);
            j++;
          }
        });
        return new UI.pr.init(matc, this);
      },
      frist: function () {
        let matc = [];
        this.each(function () {
          matc.push(this.firstElementChild);
        });
        return new UI.pr.init(matc, this);
      },
      last: function () {
        let matc = [];
        this.each(function () {
          matc.push(this.lastElementChild);
        });
        return new UI.pr.init(matc, this);
      },

      remove: function (index) {
        if (index) {
          this[index].remove();
        } else {
          this.each(function () {
            this.remove();
          });
        }
        return this;
      },
      empty: function (index) {
        if (typeof index == "number") {
          this[index].innerHTML = "";
        } else {
          this.each(function () {
            this.innerHTML = "";
          });
        }
        return this;
      },
      /**
       *
       * @param {String | Object} key
       * @param {string} val
       * @returns {UI | string}
       */
      data: function (key, val) {
        if (!val) {
          if (type(key) == "object") {
            for (let k in key) {
              if (type(key[k]) == "function") {
                continue;
              } else {
                this.attr("data-" + k, key[k]);
              }
            }
            return this;
          } else if (type(key) == "string") {
            return this.attr("data-" + key);
          }
        } else {
          this.attr("data-" + key, val);
          return this;
        }
      },
      fadeIn: function (speed, callback) {
        let self = this;
        this.each(function () {
          self.makeFade(this, speed, callback, "in");
        });
        return this;
      },
      fadeOut: function (speed, callback) {
        let self = this;
        this.each(function () {
          self.makeFade(this, speed, callback, "out");
        });
        return this;
      },
      fadeToggle: function (speed, callback) {
        let self = this;
        this.each(function () {
          if (window.getComputedStyle(this).opacity <= 0) {
            self.fadeIn(speed, callback);
          } else {
            self.fadeOut(speed, callback);
          }
        });
        return this;
      },
      show: function (speed, display_type, callback) {
        let d = this.css("display"),
          self = this;
        this.css("display", "none");
        if (speed) {
          this.each(function (_, i) {
            let true_d = type(d) == "array" ? d[i] : d;
            true_d = true_d == "none" ? display_type || "block" : true_d;
            this.style.display = true_d;
          });
          this.fadeIn(speed, callback);
        } else {
          this.each(function (_, i) {
            let true_d = type(d) == "array" ? d[i] : d;
            true_d = true_d == "none" ? display_type || "block" : true_d;
            this.style.display = true_d;
            if (callback) {
              if (isFunc) {
                callback.call(this, self);
              } else {
                UI.err("CallBack Mus't Be Fuction");
              }
            }
          });
        }
        return this;
      },
      hide: function (speed, callback) {
        let self = this;
        if (speed) {
          this.fadeOut(speed, function (e) {
            e.each(function () {
              this.style.display = "none";
              if (callback) {
                if (isFunc) {
                  callback.call(this, self);
                } else {
                  UI.err("CallBack Mus't Be Fuction");
                }
              }
            });
          });
        } else {
          this.each(function () {
            this.style.display = "none";
            if (callback) {
              if (isFunc) {
                callback.call(this, self);
              } else {
                UI.err("CallBack Mus't Be Fuction");
              }
            }
          });
        }
        return this;
      },
      toggle: function (speed, callback) {
        let self = this;
        this.each(function () {
          if (window.getComputedStyle(this).display == "none") {
            UI(this).show(speed, callback);
          } else {
            UI(this).hide(speed, callback);
          }
        });
        return this;
      },

      slideDown: function (speed, display, callback) {
        let self = this;
        this.each(function () {
          self.sldown(this, speed, display, callback);
        });
        return this;
      },
      slideUp: function (speed, callback) {
        let self = this;
        this.each(function () {
          self.slup(this, speed, callback);
        });
        return this;
      },
      slideToggle: function (speed, display, callback) {
        let self = this;
        this.each(function () {
          if (
            getComputedStyle(this).display == "none" ||
            parseFloat(getComputedStyle(this).height) <= 0
          ) {
            self.sldown(this, speed, display, callback);
          } else {
            self.slup(this, speed, callback);
          }
        });
        return this;
      },
    };

    "click input focusIn focusOut mouseEnter keyPress unload scroll resize load focus submit dbClick mouseLeave keyDown keyUp blur hover change".split(" ").each(function (e) {
      UI.pr[e] = function (callback) {
        if (!callback) {
          for (let i = 0; i < this.length; i++) {
            if (e.toLowerCase() == "focus" || e.toLowerCase() == "focusin") {
              this[i].focus();
              return this;
            } else if (e.toLowerCase() == "click") {
              this[i].click();
              return this;
            }
            this[i]["on" + e.toLowerCase()]();
          }
          return this;
        }
        if (!isFunc(callback)) return UI.err("Callback is Not a function");
        this.addEvent(e, callback);
        return this;
      };
    });

    /**
     * marge to object and return frist
     * marge to object and return new object
     * marg object in this scobe
     * examples
     * UI.omg(true, {x:"x"}, {y:"y"}) -> return new object ->     {x:"x" y:"y"}
     * UI.omg({x:1}, {y:2}) -> marge to object in frist object -> {x:1, y:2}
     * UI.omg({x:1}) -> this += {x: 1}
     */
    UI.omg = UI.pr.omg = function omg() {
      let opt,
        src,
        arr,
        clone,
        copy,
        cpia,
        target = arguments[0],
        deep,
        i = 1,
        len = arguments.length;

      if (typeof target == "boolean") {
        deep = target;
        target = i || {};
        i++;
      }

      if (typeof target == "object" && !isFunc(target)) {
        target = {};
      }

      if (i == len) {
        target = this;
        i--;
      }

      for (; i < len; i++) {
        if ((opt = arguments[i]) != null) {
          for (let name in opt) {
            copy = opt[name];

            if (name == "__proto__" || target == copy) {
              continue;
            }

            if (
              deep &&
              copy &&
              (UI.isPlainObject(copy) || (cpia = Array.isArray(copy)))
            ) {
              src = target[name];
              if (cpia && !Array.isArray(src)) {
                clone = [];
              } else if (cpia && !UI.isPlainObject(src)) {
                clone = {};
              } else {
                clone = src;
              }
              cpia = false;

              target[name] = UI.omg(deep, clone, copy);
            } else if (copy !== undefined) {
              target[name] = copy;
            }
          }
        }
      }
      return target;
    };

    UI.omg({
      v: "1.00",
      f: function () {},
      err: function (msg) {
        return new Error(msg);
      },

      isPlainObject(obj) {
        let c, p;

        if (!obj || toStr.call(obj) !== "[object Object]") {
          return false;
        }
        p = getprot(obj);

        if (!p) {
          return true;
        }
        c = hasOwn.call(p, "constructor") && p.constructor;

        return typeof c == "function" && fntostr.call(c) == objfstr;
      },

      isEmptyObj(obj) {
        let n;
        for (n in obj) return false;
        return true;
      },

      makeArr: function (arr, ret) {
        ret = ret || [];

        if (arr !== null) {
          if (isArrLike(Object(arr))) {
            UI.merg(ret, typeof arr == "string" ? [arr] : arr);
          } else {
            push.call(ret, arr);
          }
        }
        return ret;
      },

      merg: function (f, s) {
        let l = +s.length,
          x = 0,
          i = f.length;

        for (; x < l; x++) {
          f[i++] = s[x];
        }
        f.length = i;
        return f;
      },

      /**
       *
       * @param {Array | Object} arr
       * @param {Function} callback
       */
      each: function (arr, callback) {
        each.call(arr, callback);
      },

      /**
       *
       * @param {Element} ele
       * @returns {Boolean}
       */
      isElem: function (ele) {
        if (!ele) return false;

        let ts = ele.nodeType;

        return ts !== undefined ? true : false;
      },
      isEmpty: function (arg) {
        return arg.isEmpty();
      },
    });

    UI.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function (e, i) {
      c2t["[object " + e + "]"] = e.toLowerCase();
    });

    UI.pr.omg({
      /**
       * @param {string} prop,
       * @returns {object | Function | String | Array}
       */
      get_set_ele_prop: function (prop, callback) {
        this.each(function (e, i) {
          callback.call(this[prop], e, prop, i);
        });
        return this;
      },
      /**
       *
       * @param {String} prop
       * @param {Function} callback
       */
      get_computed_style: function (prop, callback) {
        this.each(function (e, i) {
          let cs = getComputedStyle(e);
          if (prop == "*") {
            callback.call(cs, cs, prop);
          } else {
            if (isFunc(callback)) {
              callback.call(cs[prop], cs[prop], prop, i);
            }
          }
        });
        return this;
      },
      get_speed: function (speed) {
        speed = speed || 400;
        if (typeof speed == "number") {
          return speed;
        } else if (typeof speed == "string") {
          let t = "slow";
          switch (speed) {
            case "slow":
              t = 800;
              break;
            case "medium":
              t = 400;
              break;
            case "fast":
              t = 200;
              break;
            default:
              t = 400;
          }
          return t;
        }
      },

      /**
       *
       * @param {Event} evt_name
       * @param {Function} callback
       * @return {Element}
       */
      addEvent: function (evt_name, callback) {
        evt_name = evt_name.toLowerCase();
        if (evt_name == "hover") {
          evt_name = "mouseenter";
        }
        let self = this;
        this.each(function (_, i) {
          this["on" + evt_name] = function (e) {
            if (!isFunc(callback)) return UI.err("Callback is Not a function");
            callback.call(this, e, i, self);
          };
        });
        return this;
      },
      makeParentTree: function () {
        let parents = [],
          prevEle;
        this.each(function () {
          prevEle = this;
          let ele_p = [];
          while (prevEle.constructor.name != "HTMLHtmlElement") {
            prevEle = prevEle.parentElement;
            ele_p.push(prevEle);
          }
          parents.push(ele_p);
        });

        return parents;
      },

      makeFade: function (ele, speed, callback, type = "in") {
        let self = this;
        if (type == "in") {
          ele.style.opacity = 0;
          speed = this.get_speed(speed);
          let last = +new Date();
          let tick = function () {
            ele.style.opacity = +ele.style.opacity + (new Date() - last) / speed;
            last = +new Date();

            if (+ele.style.opacity < 1) {
              (window.requestAnimationFrame && requestAnimationFrame(tick)) ||
              setTimeout(tick, 16);
            } else {
              if (callback) {
                if (isFunc(callback)) {
                  callback.call(ele, self);
                } else {
                  UI.err("CallBack Mus't Be Fuction");
                }
              }
            }
          };
          tick();
        } else if (type == "out") {
          ele.style.opacity = 1;
          speed = this.get_speed(speed);
          let last = +new Date();
          let tick = function () {
            ele.style.opacity = Math.abs(
              +ele.style.opacity - (new Date() - last) / speed
            );
            last = +new Date();
            if (+ele.style.opacity > 0) {
              (window.requestAnimationFrame && requestAnimationFrame(tick)) ||
              setTimeout(tick, 16);
            } else {
              if (callback) {
                if (isFunc(callback)) {
                  callback.call(ele, self);
                } else {
                  UI.err("CallBack Mus't Be Fuction");
                }
              }
            }
          };
          tick();
        }
        return this;
      },

      slup: function (target, duration, callback) {
        duration = this.get_speed(duration);
        target.style.transitionProperty = "height, margin, padding";
        target.style.transitionDuration = duration + "ms";
        target.style.boxSizing = "border-box";
        target.style.height = target.offsetHeight + "px";
        // target.offsetHeight;
        target.style.overflow = "hidden";
        target.style.height = 0;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        window.setTimeout(() => {
          target.style.display = "none";
          target.style.removeProperty("height");
          target.style.removeProperty("padding-top");
          target.style.removeProperty("padding-bottom");
          target.style.removeProperty("margin-top");
          target.style.removeProperty("margin-bottom");
          target.style.removeProperty("overflow");
          target.style.removeProperty("transition-duration");
          target.style.removeProperty("transition-property");
          if (callback) callback.call(target, this);
        }, duration);
      },
      sldown: function (target, duration, disp, callback) {
        duration = this.get_speed(duration);
        target.style.removeProperty("display");
        let display = window.getComputedStyle(target).display;

        if (display === "none") display = disp || "block";
        let height = target.offsetHeight;
        target.style.overflow = "hidden";
        target.style.height = 0;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        target.style.display = display;
        target.offsetHeight;
        target.style.boxSizing = "border-box";
        target.style.transitionProperty = "height, margin, padding";
        target.style.transitionDuration = duration + "ms";
        target.style.height = height + "px";
        target.style.removeProperty("padding-top");
        target.style.removeProperty("padding-bottom");
        target.style.removeProperty("margin-top");
        target.style.removeProperty("margin-bottom");
        window.setTimeout(() => {
          target.style.removeProperty("height");
          target.style.removeProperty("overflow");
          target.style.removeProperty("transition-duration");
          target.style.removeProperty("transition-property");
          if (callback) callback.call(target, this);
        }, duration);
      },
    });

    function isWindow(obj) {
      return obj != null && obj == obj.window;
    }

    w.isWindow = isWindow;
    /**
     *
     * @param {any} arg
     * @returns {String}
     * type function return type of arg
     * examples
     * type({}) -> object
     */
    function type(obj) {
      if (obj == null) {
        return obj + "";
      }
      return typeof obj === "object" || typeof obj === "function" ?
        c2t[toStr.call(obj)] || "object" :
        typeof obj;
    }
    w.type = type;

    /**
     * @param {Element | Array | Node | String}
     */
    var init = (UI.pr.init = function ( /**Element | Array | Node*/ elem, root) {
      if (!elem) return;
      if (elem.isEmpty()) return;
      root = root || rootUi;
      if (isFunc(elem)) {
        UI.ready(elem);
      }
      if (UI.isElem(elem)) {
        this[0] = elem;
        this.length = 1;
        let x = [...Array.from(this)];
        x.prev = root;
        x.__proto__ = this.__proto__;
        return x;
      } else if (type(elem) == "string") {
        let x = UI.makeArr(document.querySelectorAll(elem));
        x.prev = root;
        x.__proto__ = this.__proto__;
        return x;
      } else if (type(elem) == "array" || isArrLike(elem)) {
        let x = UI.makeArr(elem);
        x.prev = root;
        x.__proto__ = this.__proto__;
        return x;
      }
    });

    init.prototype = UI.pr;
    var rootUi = UI(document);

    UI.ready = function (callback) {
      // see if DOM is already available
      if (document.readyState === "complete" || document.readyState === "interactive") {
        // call on next available tick
        setTimeout(() => callback.call(document), 1);
      } else {
        document.addEventListener("DOMContentLoaded", () => callback.call(document));
      }
    };

    if (typeof define == "function" && define.amd) {
      define("UI", [], function () {
        return UI;
      });
    }

    var ui = window.UI,
      _s = window.$;

    UI.noConflict = function (deep) {
      if (window.s === UI) {
        window.s = _s;
      }

      if (deep && window.UI === UI) {
        window.UI = ui;
      }

      return UI;
    };

    if (!noGlobal) {
      window.ui = window.s = UI;
    }


    return UI;
  })(window)
);