<template>
    <div class="filter-popup" :style="{top: position.top + 'px', left: position.left + 'px'}">
        <div class="filter-popup__body">
            <div class="filter-popup__sorting"></div>
            <div class="filter-popup__templates"></div>
            <div class="filter-popup__search">
                <mdl-textfield floating-label="Поиск:" v-model="search" type="text" class="mdl-textfield--full-width"></mdl-textfield>
                <div class="filter-popup__search-list">
                    <ul v-if="filterOptions.length">
                        <li>
                            <label><input type="checkbox" :indeterminate="filterOptions"> Выделить все{{search ? ' результаты поиска' : ''}}</label>
                        </li>
                        <li v-for="val in filterOptions">
                            <label><input type="checkbox" :value="val"> <span v-html="val"></span></label>
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
    name: "popup",
    computed: {
      ...mapState('table/filter', ['position']),
      ...mapGetters('table/filter', ['filterOptions']),
      search: {
        get () {
          return this.$store.state.table.filter.search
        },
        set (value) {
          this.$store.commit('table/filter/setSearch', value)
        }
      }
    },
    methods: {
      ...mapMutations('table', ['ADD_ROW', 'EDIT_ROW', 'CLOSE_EDIT', 'SET_REMOVE', 'UPDATE_EDIT_ROW', 'SET_STRUCTURE', 'TOGGLE_CHECK']),
      ...mapActions('table/filter', ['applyFilter', 'closeFilter']),
      ...mapActions(['notify']),
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
        &__buttons {
            border-top: 1px solid #e5e5e5;
        }
    }
</style>