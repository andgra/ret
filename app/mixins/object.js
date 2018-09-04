import {getInObj, recSetValue} from '~js/helpers';

export default {
  getInObj,
  recSetValue,
  getColspan(arr){
    let res = 0;
    if (arr !== undefined) {
      for (let cell of arr) {
        res += cell.colspan;
      }
    }
    return res;
  },
  updateByDots(obj, path, value) {
    let pathArr   = path.split('.');
    let childPath = pathArr.pop();
    let parent    = getInObj(obj, pathArr.join('.'));

    parent[childPath] = value;

    return obj;
  },
  getItems(info, path) {
    let items = getInObj(info, path);
    if (items) {
      return items.map(item => (item.value));
    }
    return null;
  },
}