import moment from 'moment';
import Vue from "vue/dist/vue";

let isNumeric = function (n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

let getInObj = function (obj, path, cloneRes = false) {
  let res = cloneRes ? clone(obj) : obj;
  if (path === "") return res;
  path = path.split('.');
  for (let p of path) {
    res = res[p];
    if (res === undefined || res === null) {
      break;
    }
  }
  return res;
};

let cast = function (value, type) {
  switch (type) {
    case 'number':
      value = +value;
      break;
    case 'int':
      value = Math.floor(value);
      break;
    case 'string':
      value = '' + value;
      break;
    case 'date':
      value = moment(value);
      break;
  }
  return value;
};


let getRequests = function () {
  let s1 = location.search.substring(1, location.search.length).split('&'),
      r  = {}, s2, i;
  for (i = 0; i < s1.length; i += 1) {
    s2                                         = s1[i].split('=');
    r[decodeURIComponent(s2[0]).toLowerCase()] = decodeURIComponent(s2[1]);
  }
  return r;
};




let compareNumbers = function (a, b) {
  return a - b;
};

let isArray = function (v) {
  return v instanceof Array;
};

let isObject = function (mixed_var) {
  if (mixed_var instanceof Array) {
    return false;
  } else {
    return (mixed_var !== null) && (typeof(mixed_var) === 'object');
  }
};

let isFunction = function (functionToCheck) {
  let getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
};

let recValue = function (arr, value) {
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


let clone = (item) => {
  if (!item) { return item; } // null, undefined values check

  var types = [Number, String, Boolean],
      result;

  // normalizing primitives if someone did new String('aaa'), or new Number('444');
  types.forEach(function (type) {
    if (item instanceof type) {
      result = type(item);
    }
  });

  if (typeof result == "undefined") {
    if (Object.prototype.toString.call(item) === "[object Array]") {
      result = [];
      item.forEach(function (child, index, array) {
        result[index] = clone(child);
      });
    } else if (typeof item == "object") {
      // testing that this is DOM
      if (item.nodeType && typeof item.cloneNode == "function") {
        var result = item.cloneNode(true);
      } else if (!item.prototype) { // check that this is a literal
        if (item instanceof Date) {
          result = new Date(item);
        } else {
          // it is an object literal
          result = {};
          for (var i in item) {
            result[i] = clone(item[i]);
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



let delay = function (t) {
  return new Promise(function (resolve) {
    setTimeout(resolve, t);
  });
};

let findInGrid = function(grid, id) {
  let rowNum; // номер найденной строки
  let foundCell; // найденная ячейка
  for (let j = 0; j < grid.length; j++) {
    let row = grid[j];
    for (let i = 0; i < row.length; i++) {
      let cell = row[i];
      if (cell.fullId === id) {
        rowNum = j;
        foundCell = cell;
      }
    }
  }
  return {rowNum, cell: foundCell};
};


export {isNumeric, getInObj, cast, getRequests, compareNumbers, isArray, isObject, isFunction, recValue, clone, delay, findInGrid};
export default {isNumeric, getInObj, cast, getRequests, compareNumbers, isArray, isObject, isFunction, recValue, clone, delay, findInGrid};
