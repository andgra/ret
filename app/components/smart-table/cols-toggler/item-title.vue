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
      ...mapGetters('table/structure', ['grid']),
      checkedCol: {
        get () {
          return this.cell.colspan === this.cell.fullColspan;
        },
        set (value) {
          this.toggleCol({id: this.item.fullId, checked: value})
        }
      },
      checkedIndeterminate() {
        return this.cell.colspan > 0 && this.cell.colspan < this.cell.fullColspan;
      },
      cell() {
        let {cell} = findInGrid(this.grid, this.item.fullId);
        return cell;
      },
    },
    methods: {
      ...mapActions('table/structure', ['toggleCol']),
    },
  }
</script>

<style scoped>

</style>