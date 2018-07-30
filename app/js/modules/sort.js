import Vue from '~js/modules/vue'

let sorts = {};

sorts.shellSort = function (arr, compareFunc) {
  let n = arr.length, i = Math.floor(n / 2);
  while (i > 0) {
    for (let j = 0; j < n; j++) {
      let k = j, t = arr[j];
      while (k >= i && compareFunc(arr[k - i], t)) {
        Vue.set(arr, k, arr[k - i]);
        k -= i;
      }
      Vue.set(arr, k, t);
    }
    i = (i === 2) ? 1 : Math.floor(i * 5 / 11);
  }
  return arr;
};

sorts.quickSort = function (arr, compareFunc) {
  if (arr.length === 0) return [];
  let a = [], b = [], p = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (compareFunc(p, arr[i])) a[a.length] = arr[i];
    else b[b.length] = arr[i];
  }
  return quickSort(a, compareFunc).concat(p, quickSort(b, compareFunc));
};


sorts.bubbleSort = function (arr, compareFunc) {
  let len = arr.length;
  for (let i = 0; i < len; i++) {
    for (let j = i + 1; j < len; j++) {
      if (compareFunc(arr[i], arr[j])) {
        let swap = arr[i];
        Vue.set(arr, i, arr[j]);
        Vue.set(arr, j, swap);
      }
    }
  }
  return arr;
};


sorts.mergeSort = function (array, comparefn) {
  function merge(arr, aux, lo, mid, hi, comparefn) {
    var i = lo;
    var j = mid + 1;
    var k = lo;
    while (true) {
      var cmp = comparefn(arr[i], arr[j]);
      if (cmp <= 0) {
        aux[k++] = arr[i++];
        if (i > mid) {
          do
            aux[k++] = arr[j++];
          while (j <= hi);
          break;
        }
      } else {
        aux[k++] = arr[j++];
        if (j > hi) {
          do
            aux[k++] = arr[i++];
          while (i <= mid);
          break;
        }
      }
    }
  }

  function sortarrtoaux(arr, aux, lo, hi, comparefn) {
    if (hi < lo) return;
    if (hi == lo) {
      aux[lo] = arr[lo];
      return;
    }
    var mid = Math.floor(lo + (hi - lo) / 2);
    sortarrtoarr(arr, aux, lo, mid, comparefn);
    sortarrtoarr(arr, aux, mid + 1, hi, comparefn);
    merge(arr, aux, lo, mid, hi, comparefn);
  }

  function sortarrtoarr(arr, aux, lo, hi, comparefn) {
    if (hi <= lo) return;
    var mid = Math.floor(lo + (hi - lo) / 2);
    sortarrtoaux(arr, aux, lo, mid, comparefn);
    sortarrtoaux(arr, aux, mid + 1, hi, comparefn);
    merge(aux, arr, lo, mid, hi, comparefn);
  }

  function merge_sort(arr, comparefn) {
    var aux = arr.slice(0);
    sortarrtoarr(arr, aux, 0, arr.length - 1, comparefn);
    return arr;
  }

  return merge_sort(array, comparefn);
};

export default sorts;