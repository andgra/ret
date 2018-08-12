<template>
    <span class="col-filter" :class="{active: isActionsActive(cellId)}" @click="$emit('show-filter', $event)">
        <template v-if="isActionsActive(cellId)">
            <i v-if="isSortActive(cellId)" class="fa" :class="sortClass"></i>
            <i v-if="isFilterActive(cellId)" class="fa fa-filter"></i>
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
        if (this.isFilterActive(this.cellId)) {
          return {
            'fa-long-arrow-up': this.sortDirection === 1,
            'fa-long-arrow-down': this.sortDirection === -1,
          }
        } else {
          return {
            'fa-sort-alpha-asc': this.sortDirection === 1,
            'fa-sort-alpha-desc': this.sortDirection === -1,
          }
        }
      },
    },
    methods: {
    },
  }
</script>

<style scoped>
    .col-filter {
        border: 1px solid rgb(158,158,158);
        cursor: pointer;
        padding: 0 2px;
    }
</style>