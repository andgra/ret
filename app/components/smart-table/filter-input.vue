<template>
    <div v-if="type === 'select'">
        <select name="" id="">
            <option v-for="val in optionsInAll(cellId)" :value="val" v-html="val"></option>
        </select>
    </div>
    <div v-else-if="type === 'date'">от <input type="date"><br>до <input type="date"></div>
    <div v-else-if="type === 'number'"><input type="number"></div>
    <div v-else><input type="text"></div>
</template>

<script>
  import {mapGetters, mapState} from 'vuex';
  export default {
    name: "filter-input",
    props: {
      cellId: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        required: false,
        default: 'text',
      }
    },
    computed: {
      ...mapState('table', ['all']),
      ...mapGetters('table', ['optionsInAll']),
      options() {

      }
    },
  }
</script>

<style scoped>

</style>