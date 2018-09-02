// import {LOAD_ROWS, LOADED_ROWS} from '~store/types'

import Structure from "~js/modules/structure";

export default {
  namespaced: true,
  state: {
    instance: new Structure([], false),
  },
  getters: {
    tableControls: (state, getters, rootState, rootGetters) => rootGetters['table/controls'],
    heading(state, getters) {
      return getters.tableControls.edit + getters.tableControls.remove * 2 + 1;
    },
    trailing(state, getters) {
      return getters.tableControls.dates * 2 + getters.tableControls.edit + getters.tableControls.remove;
    },
    struct: state => state.instance.struct,
    grid: state => state.instance.grid,
    lastOfGrid: (state, getters) => getters.grid.last(),
    dots: state => state.instance.dots,
    apiCols(state, getters) {
      let dots = getters.dots;
      let apiCols = [];
      for (let id in dots) {
        if (dots.hasOwnProperty(id)) {
          let {fullId, hidden} = dots[id];
          apiCols.push({fullId, hidden});
        }
      }
      return apiCols;
    },
    entireColspan(state, getters) {
      let entireColspan = 0;
      for (let row of getters.grid) {
        for (let cell of row) {
          entireColspan += cell.colspan;
        }
      }
      return entireColspan;
    },
    entireFullColspan(state, getters) {
      let entireFullColspan = 0;
      for (let row of getters.grid) {
        for (let cell of row) {
          entireFullColspan += cell.fullColspan;
        }
      }
      return entireFullColspan;
    },
  },
  mutations: {
    ['SET_STRUCTURE'](state, structure) {
      state.instance = structure;
    },

  },
  actions: {
    async initStructure({commit, dispatch, getters}, struct) {
      if (getters.tableControls.dates) {
        let datesGrid = [
          {
            id: 'createdAt',
            title: 'Создан',
            type: 'datetime',
            sortType: 'date',
            style: {whiteSpace: 'nowrap'},
            edit: false,
          },
          {
            id: 'updatedAt',
            title: 'Изменен',
            type: 'datetime',
            sortType: 'date',
            style: {whiteSpace: 'nowrap'},
            edit: false,
          },
        ];

        struct = [...struct, ...datesGrid];
      }

      let structure = new Structure(struct);

      commit('SET_STRUCTURE', structure);

      await dispatch('repairGrid');
    },
    async repairGrid({state, dispatch, commit, getters, rootState}) {
      let grid = state.instance.grid;
      // достаем из базы сохраненные скрытые столбцы
      let apiGrid, dbGrid, dbCols;
      let settings = rootState.settings.options;
      if ((dbGrid = settings.grid) && dbGrid[getters.apiName]) {
        // проверяем на валидность
        if ((dbCols = settings.cols) && dbCols[getters.apiName]
          && JSON.stringify(dbCols[getters.apiName]) !== JSON.stringify(getters.apiCols)
        ) {
          // grid не валиден
          delete(dbGrid[getters.apiName]);
          await dispatch('settings/saveSettings', {grid: dbGrid}, {root: true});

        } else {
          // grid валиден
          apiGrid = dbGrid[getters.apiName];
        }
      }
      for (let i in grid) {
        let beforeColspan = 0;
        for (let cell of grid[i]) {
          cell.orig          = cell.colspan;
          cell.beforeColspan = beforeColspan;
          beforeColspan += cell.orig;
        }
        if (+i + 1 < grid.length) {
          if (grid[i][0].title === "") {
            grid[i][0].colspan += getters.heading;
          } else {
            grid[i].unshift({title: "", colspan: getters.heading})
          }

          if (grid[i].last().title === "") {
            grid[i].last().colspan += getters.trailing;
          } else {
            grid[i].push({title: "", colspan: getters.trailing})
          }
        }
        for (let cell of grid[i]) {
          cell.fullColspan = cell.colspan;
        }
        // применяем запомненные colspan
        if (apiGrid) {
          let dbRow = apiGrid[i];
          for (let j in dbRow) {
            grid[i][j].colspan = dbRow[j];
          }
        }
      }

      commit('SET_STRUCTURE', {...state.instance, grid});
    },
    async toggleCol({state, dispatch, commit, rootState, getters}, {id, checked}) {
      let change = checked ? 1 : -1;
      let grid   = clone(state.instance.grid);

      let {rowNum, cell} = findInGrid(grid, id);
      let foundCell      = cell;

      if (foundCell) {
        // ширина ячеек до нужной
        let before = foundCell.beforeColspan;
        // ширина ячеек до и вместе с нужной
        let after  = before + foundCell.fullColspan;

        foundCell.colspan = checked ? foundCell.fullColspan : 0;

        // родители -> строка раньше найденной
        for (let j = 0; j < rowNum; j++) {
          let row = grid[j];
          // идем с конца и ищем первую ячейку с отступом слева как у найденной или меньше
          for (let i = row.length - 1; i >= 0; i--) {
            let cell = row[i];
            if (cell.beforeColspan <= before) {
              // найден нужный родитель
              cell.colspan += foundCell.fullColspan * change;
              break;
            }
          }
        }
        // потомки -> строка позже найденной
        for (let j = rowNum + 1; j < grid.length; j++) {
          let row = grid[j];
          // идем с начала и при нахождении всех отступов в границах найденной помечаем как нужные
          for (let i = row.length - 1; i >= 0; i--) {
            let cell = row[i];
            if (cell.beforeColspan >= before && cell.beforeColspan < after) {
              // найден нужный потомок
              cell.colspan = checked ? cell.fullColspan : 0;
            }
          }
        }
      }
      commit('SET_STRUCTURE', {...state.instance, grid});
    },
    async toggleAllCols({state, dispatch, commit, rootState, getters}, checked) {
      let grid = clone(state.instance.grid);
      for (let row of grid) {
        for (let cell of row) {
          cell.colspan = checked ? cell.fullColspan : 0;
        }
      }
      commit('SET_STRUCTURE', {...state.instance, grid});
    },
    async rememberColspan({state, dispatch, commit, rootState, getters}) {
      // сохраняем grid с colspan (state)
      let grid = rootState.settings.options.grid ? rootState.settings.options.grid : {};

      grid[getters.apiName] = getters.grid.map(row => row.map(({colspan}) => (colspan)));

      // также сохраняем dots для определения валидности grid'а
      let cols = rootState.settings.options.cols ? rootState.settings.options.cols : {};



      cols[getters.apiName] = getters.apiCols;

      await dispatch('settings/saveSettings', {grid, cols}, {root: true});
      await dispatch('notify', 'Сохранено', {root: true});
    },
  },
};