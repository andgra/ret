<template>
    <span class="col-filter" :class="{active: isActionsActive(cellId)}" @click="$emit('show-filter', $event)">
        <template v-if="isActionsActive(cellId)">
            <i v-if="isSortActive(cellId)" key="sort-icon" class="fa" :class="sortClass"></i>
            <i v-if="isFilterActive(cellId)" key="filter-icon" class="fa fa-filter active" :class="filterClass"></i>
        </template>
        <template v-else>
            <i class="fa fa-caret-down fa-lg" aria-hidden="true"></i>
        </template>
    </span>
</template>

<script>
  import {mapActions, mapGetters, mapState} from 'vuex';
  export default {
    name: "icon",
    props: {
      cellId: {
        type: String,
        required: true,
      },
    },
    computed: {
      ...mapGetters('table/filter', ['sortDirection', 'isActionsActive', 'isSortActive', 'isFilterActive']),
      sortClass() {
        return {
          'fa-long-arrow-up': this.sortDirection === 1,
          'fa-long-arrow-down': this.sortDirection === -1,
          'active': this.isOnlySortActive,
          'icon-wide': this.isOnlySortActive,
          'fa-lg': this.isOnlySortActive,
        }
      },
      filterClass() {
        return {
          'fa-lg': this.isOnlyFilterActive,
        }
      },
      isOnlySortActive() {
        return this.isSortActive(this.cellId) && !this.isFilterActive(this.cellId);
      },
      isOnlyFilterActive() {
        return !this.isSortActive(this.cellId) && this.isFilterActive(this.cellId);
      },
    },
    methods: {
    },
  }
</script>

<style scoped lang="scss">
    .col-filter {
        border: 1px solid rgb(158,158,158);
        cursor: pointer;
        padding: 2px;
        .fa.active {
            color: #337ab7;
        }
        .icon-wide {
            width: 1.05em;
        }
    }
</style>