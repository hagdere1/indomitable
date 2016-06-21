(function (root) {
  var _callbacks = [];
  var _docReady = false;

  document.addEventListener('DOMContentLoaded', function () {
    _docReady = true;
    _callbacks.forEach(function (fn) {
      fn();
    });
  });

  var registerCallback = function (fn) {
    if (!_docReady) {
      _callbacks.push(fn);
    }
    else {
      fn();
    }
  };

  var DOMNodeCollection = function (elements) {
    this.elements = Array.prototype.slice.call(elements);
  };

  var $l = root.$l = function (arg) {
    var elements;

    if (typeof arg === "function") {
      registerCallback(arg);
    }
    else if (typeof arg === "object") {
      if (arg instanceof HTMLElement) {
        elements = [arg];
        return new DOMNodeCollection(elements);
      }
    }
    else if (typeof arg === "string") {
      var argMatches = arg.match(/<(\w+)>/);
      if (argMatches) {
        var element = document.createElement(argMatches[1]);
        return new DOMNodeCollection([element]);
      }
      else {
        var nodeList = document.querySelectorAll(arg);
        elements = Array.prototype.slice.call(nodeList, 0);
        return new DOMNodeCollection(elements);
      }
    }
  };

  // AJAX requests

  $l.extend = function (base) {
    var otherObjects = Array.prototype.slice.call(arguments, 1);

    otherObjects.forEach(function (object) {
      for (var prop in object) {
        if (object.hasOwnProperty(prop)) {
          base[prop] = object[prop];
        }
      }
    });

    return base;
  };

  var generateQueryString = function (object) {
    var queryString = "";

    for (var prop in object) {
      if (object.hasOwnProperty(prop)) {
        queryString += prop + "=" + object[prop] + "&";
      }
    }

    return queryString.substring(0, queryString.length - 1);
  };

  $l.ajax = function (options) {
    var request = new XMLHttpRequest();
    var defaults = {
      method: "GET",
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      url: "",
      success: function () {},
      error: function () {},
      data: {}
    };
    options = $l.extend(defaults, options);

    if (options.method.toUpperCase() === "GET") {
      options.url += "?" + generateQueryString(options.data);
    }

    request.open(options.method, options.url, true);
    request.onreadystatechange = function() {
      if (request.readyState == 4 && request.status == 200) {
        options.success(request.response);
      }
      else {
        options.error(request.response);
      }
    };

    request.send(JSON.stringify(options.data));
  };

  // Document manipulation and traversal

  DOMNodeCollection.prototype.html = function (string) {
    if (typeof string === "undefined") {
      return this.elements[0].innerHTML;
    }
    else {
      this.elements.forEach(function (element) {
        element.innerHTML = string;
      });

      return string;
    }
  };

  DOMNodeCollection.prototype.empty = function () {
    this.html("");
  };

  DOMNodeCollection.prototype.remove = function () {
    this.elements.forEach(function (element) {
      element.parentNode.removeChild(element);
    });
  };

  DOMNodeCollection.prototype.append = function (elementToAppend) {
      if (typeof elementToAppend === "object" &&
        !(elementToAppend instanceof DOMNodeCollection)) {
        elementToAppend = $l(elementToAppend);
      }

      if (typeof elementToAppend === "string") {
        this.elements.forEach(function (element) {
          element.innerHTML += elementToAppend;
        });
      }
      else if (elementToAppend instanceof HTMLElement) {
        this.elements.forEach(function(element) {
          var newNode = elementToAppend.cloneNode();
          newNode.innerHTML = elementToAppend.innerHTML;
          element.appendChild(newNode);
        });
      }
      else if (elementToAppend instanceof DOMNodeCollection) {
        this.element = this.elements[0];
        elementToAppend.elements.forEach(function (childNode) {
          this.element.appendChild(childNode);
        }.bind(this));
      }

  };

  DOMNodeCollection.prototype.attr = function (attribute, value) {
    if (typeof value === "string") {
      this.elements.forEach(function (element) {
        element.setAttribute(attribute, value);
      });
    }
    else {
      return this.elements[0].getAttribute(attribute);
    }
  };

  DOMNodeCollection.prototype.addClass = function (className) {
    this.elements.forEach(function (element) {
      element.classList.add(className);
    });
  };

  DOMNodeCollection.prototype.removeClass = function (className) {
    this.elements.forEach(function (element) {
      element.classList.remove(className);
    });
  };


  DOMNodeCollection.prototype.find = function (selector) {
    var foundNodes = [];

    this.elements.forEach(function (element) {
      var nodeList = element.querySelectorAll(selector);
      var nodes = Array.prototype.slice.call(nodeList);

      nodes.forEach(function (node) {
        foundNodes.push(node);
      });
    });

    return new DOMNodeCollection(foundNodes);
  };

  DOMNodeCollection.prototype.children = function () {
    var children = [];

    this.elements.forEach(function (element) {
      var childNodes = Array.prototype.slice.call(element.children);
      childNodes.forEach(function (child) {
        children.push(child);
      });
    });

    return new DOMNodeCollection(children);
  };

  DOMNodeCollection.prototype.parent = function () {
    var parents = [];

    this.elements.forEach(function (element) {
      parents.push(element.parentNode);
    });

    return new DOMNodeCollection(parents);
  };

  // Event handling

  DOMNodeCollection.prototype.on = function (eventName, fn) {
    this.elements.forEach(function (element) {
      element.addEventListener(eventName, fn);
    });
  };

  DOMNodeCollection.prototype.off = function (eventName, fn) {
    this.elements.forEach(function (element) {
      element.removeEventListener(eventName, fn);
    });
  };

})(this);
