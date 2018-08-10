class api {
  constructor() {
    this.table = 'db';
  }

  all(options) {
    let defaultOptions = {
      sort: {createdAt: 1},
      where: {},
      limit: 10,
      page: 1
    };

    options = {...defaultOptions, ...options};

    let {sort, where, limit, page} = options;

    let skip = (page - 1) * limit;

    return new Promise((resolve, reject) => {
      this.table.find(where).sort(sort).skip(skip).limit(limit)
          .exec((err, item) => !err ? resolve(item) : reject(err));
    });
  }

  count(where = {}) {
    return new Promise((resolve, reject) => {
      this.table.count(where).exec((err, item) => !err ? resolve(item) : reject(err));
    });
  }

  update(item) {
    return new Promise((resolve, reject) => {
      this.table.update({_id: item._id}, {$set: item}, (err, item) => !err ? resolve(item) : reject(err));
    });
  }

  insert(item) {
    return new Promise((resolve, reject) => {
      this.table.insert(item, (err, item) => !err ? resolve(item) : reject(err));
    });
  }

  delete(attributes, multi = false) {
    if (!isObject(attributes)) {
      attributes = {_id: attributes};
    }
    return new Promise((resolve, reject) => {
      this.table.remove(attributes, {multi}, (err, item) => !err ? resolve(item) : reject(err));
    });
  }

  firstOrNew(attributes, item) {
    return new Promise((resolve, reject) => {
      this.table.findOne(attributes, (err, doc) => {
        if (err) {
          reject(err);
        } else if (doc) {
          resolve({insert: false, doc});
        } else {
          delete item._id;
          this.insert(item).then(doc => resolve({insert: true, doc}), err => reject(err));
        }
      })
    });
  }

  // Приведение типов перед добавлением в базу
  sanitize(item, dots) {
    for (let id in dots) {
      let node = dots[id];
      if (node.children && node.children.length) {
        continue;
      }
      let path = id.split('.');
      let childPath = path[path.length - 1];
      path.pop();
      let parentPath = path.join('.');
      let parent = getInObj(item, clone(parentPath));
      if(node.sortType) {
        parent[childPath] = cast(parent[childPath], node.sortType);
      }
      console.log(item, parent[childPath]);
    }
    return item;
  }

  updateOrCreate(attributes, item) {
    return new Promise((resolve, reject) => {
      delete item._id;
      this.table.update(attributes, item, {
        upsert: true,
        returnUpdatedDocs: true
      }, (err, num, doc, insert) => {
        !err ? resolve({insert, doc}) : reject(err)
      });
    });
  }
}

export default api;