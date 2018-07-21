window.isNumeric = function (n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

window.getInObj = function (obj, path, cloneRes = false) {
  path = path.split('.');
  let res = cloneRes ? clone(obj) : obj;
  for(let p of path) {
    res = res[p];
    if(res === undefined || res === null) {
      break;
    }
  }
  return res;
};




window.getRequests = function () {
  let s1 = location.search.substring(1, location.search.length).split('&'),
      r = {}, s2, i;
  for (i = 0; i < s1.length; i += 1) {
    s2 = s1[i].split('=');
    r[decodeURIComponent(s2[0]).toLowerCase()] = decodeURIComponent(s2[1]);
  }
  return r;
};


// const asset = function (path) {
//   return window.__dirname + '/public/' + path;
// };
// const asset_src = function (path) {
//   return window.__dirname + '/src/' + path;
// };




window.compareNumbers = function (a, b) {
  return a - b;
};

window.isArray = function (v) {
  return v instanceof Array;
};

window.isObject = function (mixed_var) {
  if (mixed_var instanceof Array) {
    return false;
  } else {
    return (mixed_var !== null) && (typeof( mixed_var ) === 'object');
  }
};

window.isFunction = function (functionToCheck) {
  let getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
};

window.compareNumbers = function (a, b) {
  return a - b;
};

window.recValue = function (arr, value) {
  arr = clone(arr);
  for (let i in arr) {
    if (isArray(arr[i]) || isObject(arr[i])) {
      arr[i] = recValue(arr[i], value);
    } else {
      arr[i] = value;
    }
  }
  return arr;
};

Object.defineProperty(Array.prototype, 'last', {
  enumerable: false,
  value: function() { return this[this.length - 1]; }
});

Object.defineProperty(Array.prototype, 'first', {
  enumerable: false,
  value: function() { return this[0]; }
});

window.clone = (item) => {
  if (!item) { return item; } // null, undefined values check

  var types = [ Number, String, Boolean ],
      result;

  // normalizing primitives if someone did new String('aaa'), or new Number('444');
  types.forEach(function(type) {
    if (item instanceof type) {
      result = type( item );
    }
  });

  if (typeof result == "undefined") {
    if (Object.prototype.toString.call( item ) === "[object Array]") {
      result = [];
      item.forEach(function(child, index, array) {
        result[index] = clone( child );
      });
    } else if (typeof item == "object") {
      // testing that this is DOM
      if (item.nodeType && typeof item.cloneNode == "function") {
        var result = item.cloneNode( true );
      } else if (!item.prototype) { // check that this is a literal
        if (item instanceof Date) {
          result = new Date(item);
        } else {
          // it is an object literal
          result = {};
          for (var i in item) {
            result[i] = clone( item[i] );
          }
        }
      } else {
        // depending what you would like here,
        // just keep the reference, or create new object
        if (false && item.constructor) {
          // would not advice to do that, reason? Read below
          result = new item.constructor();
        } else {
          result = item;
        }
      }
    } else {
      result = item;
    }
  }

  return result;
};