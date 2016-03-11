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
    this.elements = elements;
  };

  var $l = root.$l = function (arg) {
    var elements;

    if (typeof arg === "function") {
      registerCallback(arg);
    }
    else if (arg instanceof HTMLElement) {
      elements = [arg];
    }
    else {
      var nodeList = document.querySelectorAll(arg);
      elements = Array.prototype.slice.call(nodeList);
    }

    return new DOMNodeCollection(elements);
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
    this.elements.forEach(function (element) {
      if ((typeof elementToAppend === "string") || (typeof elementToAppend === HTMLElement)) {
        element.innerHTML += elementToAppend;
      }
      else if (typeof elementToAppend === DOMNodeCollection) {
        elementToAppend.forEach(function (el) {
          element.innerHTML += el;
        });
      }
    });
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
