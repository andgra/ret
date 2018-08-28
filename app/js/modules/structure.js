export default class Structure {
  constructor(struct, start = true) {
    this.struct     = struct;
    this.defaultRow = {};
    this.united     = [];
    this.grid       = [];
    this.originGrid = {};
    this.dicts      = {};
    this.dots       = {};

    if (start) {
      this.start();
    }

  }

  start() {
    this.setRowSeed();
    this.setFullIds();
    this.setUnited();
    this.setGrid();
    this.setDicts();
    this.setDots();
    this.originGrid = clone(this.grid);
  }

  setRowSeed() {
    let getSeed = (node) => {
      if (node.children) {
        let res = {};
        for (let i in node.children) {
          let name  = node.children[i].id;
          res[name] = getSeed(node.children[i]);
        }
        return res;
      } else {
        return node.default !== undefined ? node.default : "";
      }
    };

    this.defaultRow     = getSeed({children: this.struct});
    this.defaultRow._id = "";
  }

  setFullIds() {
    let dotNodes = (nodes, parent = '') => {
      parent = parent ? parent + '.' : '';
      for (let node of nodes) {
        node.fullId = parent + node.id;
        if (node.children && node.children.length) {
          node.children = dotNodes(node.children, node.fullId);
        }
      }
      return nodes;
    };

    this.struct = dotNodes(clone(this.struct));
  }

  setDicts() {
    this.dicts = {};

    for (let cell of clone(this.grid.last())) {
      if (cell.type === 'select') {
        let path = cell.id.split('.');
        let res  = this.dicts;
        for (let i in path) {
          let p  = path[i];
          res[p] = !res[p] ? (i === path.length - 1 ? [] : {}) : res[p];
          res    = res[p];
        }
      }
    }
  }


  leavesCnt(node) {
    if (node.children) {
      let curArr    = clone(node.children);
      let curLeaves = 0;
      for (let i in curArr) {
        curLeaves += this.leavesCnt(curArr[i]);
      }
      return curLeaves;
    } else {
      return !node.hidden ? 1 : 0;
    }
  };

  getMaxDepth(arr, lvl = 1) {
    let curMax = lvl;
    let max    = lvl;
    for (let i in arr) {
      if (arr[i].children) {
        curMax = this.getMaxDepth(arr[i].children, lvl + 1);
      }
      max = max < curMax ? curMax : max;
    }
    return max
  }


  setUnited() {
    let setIds = (arr, chain = "") => {
      let curArr = clone(arr);
      let curChain;
      for (let i in curArr) {
        curChain = chain;
        if (curArr[i].id) {
          curChain += ((curChain === "" ? "" : ".") + String(curArr[i].id));
          curArr[i].id = curChain
        }
        if (curArr[i].children) {
          curArr[i].children = setIds(curArr[i].children, curChain);
        }
      }
      return curArr;
    }

    let normalizeStruct = (arr) => {
      let curArr  = clone(arr);
      let toShift = true;
      let newArr  = [];
      for (let i in curArr) {
        if (curArr[i].children) {
          if (curArr[i].title !== "") {
            toShift = false;
          }
          curArr[i].children.forEach(node => newArr.push(node))
        } else {
          toShift = false;
        }
      }
      if (!toShift) {
        newArr = curArr;
      }
      for (let i in newArr) {
        if (newArr[i].children) {
          newArr[i].children = normalizeStruct(newArr[i].children);
        }
      }
      return newArr;
    }

    let shiftStruct = (arr, maxLvl = this.getMaxDepth(arr), lvl = 1) => {
      let curArr = clone(arr);
      for (let i in curArr) {
        let shifted = false;
        if (curArr[i].children) {
          if (lvl + this.getMaxDepth(curArr[i].children) < maxLvl) {
            shifted = true
          }
        } else {
          if (lvl < maxLvl) {
            shifted = true
          }
        }

        if (shifted) {
          curArr[i] = {
            title: "",
            children: [
              curArr[i]
            ]
          };
        }
        if (curArr[i].children)
          curArr[i].children = shiftStruct(curArr[i].children, maxLvl, lvl + 1);
      }
      return curArr;
    }

    let unionStruct = (shifted) => {
      function unite(arr) {
        let newNode = {
          title: "",
          children: []
        };
        for (let i in arr) {
          if (arr[i].children) {
            arr[i].children.forEach(node => newNode.children.push(node))
          } else {
            newNode.children.push(arr[i]);
          }
        }
        return newNode
      }

      let curArr = clone(shifted);

      let toUnite = [];
      let newArr  = [];
      for (let i in curArr) {
        let cur = clone(curArr[i]);
        if (cur.title === "") {
          toUnite.push(cur);
        } else {
          if (toUnite.length) {
            newArr.push(unite(toUnite));
            toUnite = [];
          }
          newArr.push(cur);
        }
      }
      if (toUnite.length) {
        newArr.push(unite(toUnite));
      }
      for (let i in newArr) {
        if (newArr[i].children) {
          newArr[i].children = unionStruct(newArr[i].children);
        }
      }
      return newArr;
    }


    let withIds = setIds(this.struct)
// console.log('withIds', withIds);

    let normalized = normalizeStruct(withIds);
// console.log('normalized', normalized);

    let shifted = shiftStruct(normalized);
// console.log('shifted',shifted)

    this.united = unionStruct(shifted);
    // console.log('united', this.united);
  }


  setGrid() {
    let depth   = this.getMaxDepth(this.united);
    let resArr  = [];
    let curArr  = clone(this.united);
    let nextArr = [];
    for (let lvl = 0; lvl < depth; lvl++) {
      resArr[lvl] = [];
      for (let i in curArr) {
        let cell     = clone(curArr[i]);
        cell.colspan = this.leavesCnt(cell);
        delete cell.children;
        resArr[lvl].push(cell)
        if (curArr[i].children) {
          curArr[i].children.forEach(node => nextArr.push(node))
        }
      }
      curArr  = clone(nextArr);
      nextArr = [];
    }

    this.grid = resArr;
  }

  setDots() {
    let dotsRec = (nodes, parent = '') => {
      let res = {};
      for (let node of nodes) {
        let id = `${parent}${node.id}`;
        if (node.children && node.children.length) {
          res = {...res, ...dotsRec(node.children, `${id}.`)}
        }
        res = {...res, [id]: node}
      }
      return res
    };

    this.dots = dotsRec(clone(this.struct));
  }
}