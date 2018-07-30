<template>
    <div class="actions">
        <mdl-button :disabled="editMode" v-if="controlAdd" @click.native="openEdit()" class="mdl-js-ripple-effect">Добавить запись</mdl-button>
        <mdl-button :disabled="editMode || checks.length===0" v-if="controlRemove" @click.native="$emit('inquireRemove')" class="mdl-js-ripple-effect">Удалить отмеченные</mdl-button>
        <mdl-button v-if="isClosed" @click.native="$emit('cancelClosed')" class="mdl-js-ripple-effect">Показать скрытые</mdl-button>
    </div>
</template>

<script>
  import {mapActions, mapGetters, mapMutations, mapState} from 'vuex';
  export default {
    name: "actions",
    props: {
      controlAdd: {
        type: Number,
        required: false,
        default: 1
      },
      controlRemove: {
        type: Number,
        required: false,
        default: 1
      },
      checks: {
        type: Array,
        required: true,
      },
      isClosed: {
        type: Boolean,
        required: true,
      },
    },
    computed: {
      ...mapGetters('table', ['editMode']),
    },
    methods: {
      ...mapActions('table', ['openEdit']),
    },
  }
</script>

<style scoped>

</style>