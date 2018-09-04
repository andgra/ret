<template>
    <div>
        <template v-if="node.type === 'color'">
            <mdl-textfield
                :id="node.fullId"
                :floating-label="formattedTitle(node.title)"
                v-model="fieldModel"
                type="color"
                class="mdl-textfield--full-width"
            ></mdl-textfield>
        </template>
        <template v-else-if="node.type === 'select'">
            <mdl-select
                :id="node.fullId"
                :label="formattedTitle(node.title)"
                v-model="fieldModel"
                :options="getInObj(info, node.fullId)"
                class="mdl-textfield--full-width"
            ></mdl-select>
        </template>
        <template v-else-if="node.type === 'autocomplete'">
            <mdl-autocomplete
                :id="node.fullId"
                :label="formattedTitle(node.title)"
                v-model="fieldModel"
                :options="getInObj(info, node.fullId)"
                :strict="node.strict"
                class="mdl-textfield--full-width"
            ></mdl-autocomplete>
        </template>
        <template v-else-if="node.type === 'datetime' || node.type === 'date'">
            <DateTimePicker
                :id="node.fullId"
                :label="formattedTitle(node.title)"
                v-model="fieldModel"
                class="mdl-textfield--full-width"
                :time="node.type !== 'date'"
            ></DateTimePicker>
        </template>
        <template v-else-if="node.type === 'interval'">
            <IntervalPicker
                class="mdl-textfield--full-width"
                :id="node.fullId"
                :label="formattedTitle(node.title)"
                v-model="fieldModel"
                :outControl="true"
                :edit="!node.readonly"
            ></IntervalPicker>
        </template>
        <template v-else-if="node.type === 'hidden'">
            <input
                :id="node.fullId"
                v-model="fieldModel"
                type="hidden"
            />
        </template>
        <template v-else>
            <mdl-textfield
                :id="node.fullId"
                :readonly="!!node.readonly"
                :floating-label="formattedTitle(node.title)"
                v-model="fieldModel"
                :type="node.type"
                class="mdl-textfield--full-width"
            ></mdl-textfield>
        </template>
    </div>
</template>

<script>
  import {mapActions, mapGetters, mapMutations, mapState} from 'vuex';

  export default {
    name: "edit-form-item",
    props: {
      node: {
        type: Object,
        required: true,
      },
    },
    computed: {
      ...mapState('table', ['info']),
      ...mapState('table/edit', ['editRow', 'editModal']),
      ...mapGetters('table/structure', ['lastOfGrid']),
      fieldModel: {
        get() {
          return this.getValueToInput({row: this.editRow, cols: this.lastOfGrid, path: this.node.fullId});
        },
        set(value) {
          this.updateEditRow(this.updateByDots(this.editRow, this.node.fullId, value));
        }
      },
    },
    methods: {
      ...mapMutations('table/edit', ['updateEditRow'])
    },
  }
</script>

<style scoped>

</style>