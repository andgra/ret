<template>
  <div>
    <label v-if="item.title">
      <input type="checkbox" v-model="checkedCol" :indeterminate.prop="checkedIndeterminate">
      <span v-html="formattedTitle(item.title)"></span>
    </label>
  </div>
</template>

<script>
  import {mapActions, mapGetters, mapMutations, mapState} from 'vuex';

  export default {
    name: "cols-toggler-item-title",
    props: {
      item: {
        type: Object,
        required: true,
      },
    },
    computed: {
      ...mapGetters('table', ['grid']),
      checkedCol: {
        get () {
          return this.cellInGrid.colspan === this.cellInGrid.fullColspan;
        },
        set (value) {
          this.toggleCol({id: this.item.fullId, checked: value})
        }
      },
      checkedIndeterminate() {
        return this.cellInGrid.colspan > 0 && this.cellInGrid.colspan < this.cellInGrid.fullColspan;
      },
      cellInGrid() {
        let {cell} = findInGrid(this.grid, this.item.fullId);
        return cell;
      },
    },
    methods: {
      ...mapActions('table', ['toggleCol']),
    },
  }
</script>

<style scoped>

</style>