<template>
    <div class="filter-popup" :style="{top: position.top + 'px', left: position.left + 'px'}">
        <div class="filter-popup__body">
            <div class="filter-popup__sorting filter-popup__block">
                <div class="filter-popup-option" @click="applySort(1)" :class="{active: isCurrentDirection(1)}">
                    <i class="fa fa-long-arrow-up fa-fw filter-popup-option-icon" aria-hidden="true"></i> Сортировать по возрастанию
                </div>
                <div class="filter-popup-option" @click="applySort(-1)" :class="{active: isCurrentDirection(-1)}">
                    <i class="fa fa-long-arrow-down fa-fw filter-popup-option-icon" aria-hidden="true"></i> Сортировать по убыванию
                </div>
            </div>
            <div class="filter-popup__templates filter-popup__block">
                <div class="filter-popup-option" @click="resetFilter" :class="{disabled: !isFilterActive(cellId)}">
                    <!--<i class="fa fa-long-arrow-down fa-fw filter-popup-option-icon" aria-hidden="true"></i>-->
                    <span class="fa-stack filter-popup-option-icon">
                        <i class="fa fa-filter fa-stack-1x"></i>
                        <i class="fa fa-ban fa-stack-2x text-danger"></i>
                    </span>
                    Удалить все фильтры
                </div>
            </div>
            <div class="filter-popup__search filter-popup__block">
                <mdl-textfield floating-label="Поиск:" v-model="search" type="text" class="mdl-textfield--full-width"></mdl-textfield>
                <div class="filter-popup__search-list">
                    <ul v-if="isFoundSomething" key="search-list">
                        <li>
                            <label><input type="checkbox" v-model="checkedAll" :indeterminate.prop="isAllIndeterminate"> Выделить все{{search ? ' результаты поиска' : ''}}</label>
                        </li>
                        <li v-for="option in filterOptions" :key="option.key">
                            <label><input type="checkbox" :value="option.key" v-model="checkedOptions"> <span v-html="option.value"></span></label>
                        </li>
                    </ul>
                    <div class="filter-popup__search-empty" v-else key="search-empty">Извините, значеня не найдены</div>
                </div>
            </div>
        </div>
        <div class="filter-popup__buttons text-right filter-popup__block">
            <mdl-button primary="" @click.native="applyFilter">Применить</mdl-button>
            <mdl-button @click.native="closeFilter">Закрыть</mdl-button>
        </div>
    </div>
</template>

<script>
  import {mapActions, mapGetters, mapMutations, mapState} from 'vuex';
  export default {
    name: "filter",
    computed: {
      ...mapState('table/filter', ['position', 'cellId']),
      ...mapGetters('table/filter', ['filterOptions', 'isAllChecked', 'isAllIndeterminate', 'isFoundSomething', 'isCurrentDirection', 'isFilterActive']),
      search: {
        get () {
          return this.$store.state.table.filter.search
        },
        set (value) {
          this.$store.commit('table/filter/setSearch', value)
        }
      },
      checkedAll: {
        get () {
          return this.isAllChecked
        },
        set (value) {
          if (!this.checkedOptions.length || this.isAllIndeterminate) {
            this.checkedOptions = this.filterOptions.map(o => o.key);
          } else {
            this.checkedOptions = [];
          }
        }
      },
      checkedOptions: {
        get () {
          return this.$store.state.table.filter.checkedOptions
        },
        set (value) {
          this.$store.commit('table/filter/setCheckedOptions', value)
        }
      },
    },
    mounted() {
      $(this.$el).appendTo(this.$root.$el);
    },
    methods: {
      ...mapActions('table/filter', ['applyFilter', 'closeFilter', 'applySort', 'resetFilter']),
      ...mapActions(['notify']),
    },
  }
</script>

<style scoped lang="scss">
    .filter-popup {
        z-index: 1000;
        position: absolute;
        width: 400px;
        height: auto;
        background: white;
        box-shadow: 0 5px 15px rgba(0,0,0,0.5);
        border: 1px solid rgba(0,0,0,.2);
        &__search, &__buttons {
        }
        &__sorting {
            /*padding-bottom: 5px;*/
        }
        &-option {
            padding: 3px;
            margin: 5px 0;
            &-icon {
                box-sizing: border-box;
                &:not(.fa-stack) {
                    padding: 3px;
                }
            }
            &.active &-icon {
                background-color: #E9F5EE;
                border: 1px solid #8DC3A5;
            }
            &:not(.disabled) {
                cursor: pointer;
                &:hover {
                    background-color: #D3F0E0;
                }
            }
            &.disabled {
                cursor: not-allowed;
                color: #BDBCBC;
            }
        }
        &__search {
            &-list {
                padding-left: 10px;
                ul {
                    max-height: 245px;
                    overflow-x: hidden;
                    overflow-y: auto;
                }
            }
        }
        ul {
            list-style: none;
            margin: 0;
            padding: 0;
        }
        &__body {
            padding: 15px;
        }
        &__block:not(:first-of-type) {
            border-top: 1px solid #e5e5e5;
        }
    }
</style>