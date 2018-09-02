<template>
    <div>
        <label>
            <input type="checkbox" v-model="checkedAll" :indeterminate.prop="checkedIndeterminate">
            <span>Все</span>
        </label>
    </div>
</template>

<script>
  import {mapActions, mapGetters, mapMutations, mapState} from 'vuex';

  export default {
    name: "cols-toggler-item-all",
    computed: {
      ...mapGetters('table', ['grid', 'entireColspan', 'entireFullColspan']),
      checkedAll: {
        get () {
          return this.entireColspan === this.entireFullColspan;
        },
        set (value) {
          this.toggleAllCols(value);
        }
      },
      checkedIndeterminate() {
        return this.entireColspan > 0 && this.entireColspan < this.entireFullColspan;
      },
    },
    methods: {
      ...mapActions('table', ['toggleAllCols']),
    },
  }
</script>

<style scoped>

</style>