<template>
    <div class="filter-popup" :style="{top: position.top + 'px', left: position.left + 'px'}">
        <div class="filter-popup__body">
            <div class="filter-popup__sorting">
                <div class="sort-option" @click="applySort(1)">
                    <i class="fa fa-sort-alpha-asc" aria-hidden="true"></i> Сортировать по возрастанию
                </div>
                <div class="sort-option" @click="applySort(-1)">
                    <i class="fa fa-sort-alpha-desc" aria-hidden="true"></i> Сортировать по убыванию
                </div>
            </div>
            <div class="filter-popup__templates"></div>
            <div class="filter-popup__search">
                <mdl-textfield floating-label="Поиск:" v-model="search" type="text" class="mdl-textfield--full-width"></mdl-textfield>
                <div class="filter-popup__search-list">
                    <ul v-if="filterOptions.length">
                        <li>
                            <label><input type="checkbox" @change="changedAll" :indeterminate.prop="isAllIndeterminate" :checked="isAllChecked"> Выделить все{{search ? ' результаты поиска' : ''}}</label>
                        </li>
                        <li v-for="val in filterOptions">
                            <label><input type="checkbox" :value="val" v-model="checkedOptions"> <span v-html="val"></span></label>
                        </li>
                    </ul>
                    <div class="filter-popup__search-empty" v-else>Извините, значеня не найдены</div>
                </div>
            </div>
        </div>
        <div class="filter-popup__buttons text-right">
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
      ...mapState('table/filter', ['position']),
      ...mapGetters('table/filter', ['filterOptions', 'isAllChecked', 'isAllIndeterminate']),
      search: {
        get () {
          return this.$store.state.table.filter.search
        },
        set (value) {
          this.$store.commit('table/filter/setSearch', value)
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
    methods: {
      ...mapActions('table/filter', ['applyFilter', 'closeFilter', 'applySort']),
      ...mapActions(['notify']),
      changedAll() {
        if (!this.checkedOptions.length || this.isAllIndeterminate) {
          this.checkedOptions = this.filterOptions;
        } else {
          this.checkedOptions = [];
        }
      },
    },
    mounted() {
      $(this.$el).appendTo(this.$root.$el);
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
            border-top: 1px solid #e5e5e5;
        }
        &__sorting {
        }
        .sort-option {
            cursor: pointer;
        }
        &__search {
            &-list {
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
    }
</style>