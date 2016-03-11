(function (root) {
  var DOMNodeCollection = function (elements) {
    this.elements = elements;
  };

  var $l = root.$l = function (element) {
    var elements;

    if (element instanceof HTMLElement) {
      elements = [element];
    }
    else {
      var nodeList = document.querySelectorAll(element);
      elements = Array.prototype.slice.call(nodeList);
    }

    return new DOMNodeCollection(elements);
  };

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


})(this);
