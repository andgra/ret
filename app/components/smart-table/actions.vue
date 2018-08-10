<template>
    <div class="actions">
        <mdl-button :disabled="editMode" v-if="controls.add" @click.native="openEdit()" class="mdl-js-ripple-effect">Добавить запись</mdl-button>
        <mdl-button :disabled="editMode || checks.length===0" v-if="controls.remove" @click.native="$emit('inquireRemove')" class="mdl-js-ripple-effect">Удалить отмеченные</mdl-button>
        <mdl-button v-if="isClosed" @click.native="$emit('cancelClosed')" class="mdl-js-ripple-effect">Показать скрытые</mdl-button>
    </div>
</template>

<script>
  import {mapActions, mapGetters, mapMutations, mapState} from 'vuex';

  export default {
    name: "actions",
    props: {
      isClosed: {
        type: Boolean,
        required: true,
      },
    },
    computed: {
      ...mapState('table', ['checks']),
      ...mapGetters('table', ['editMode', 'controls']),
    },
    methods: {
      ...mapActions('table', ['openEdit']),
    },
  }
</script>

<style scoped>

</style>