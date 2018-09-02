<template>
    <div class="actions">
        <mdl-button :disabled="editModal" v-if="controls.add" @click.native="openEdit()" class="mdl-js-ripple-effect">Добавить запись</mdl-button>
        <mdl-button :disabled="editModal || checks.length===0" v-if="controls.remove" @click.native="openRemove(checks)" class="mdl-js-ripple-effect">Удалить отмеченные</mdl-button>
    </div>
</template>

<script>
  import {mapActions, mapGetters, mapMutations, mapState} from 'vuex';

  export default {
    computed: {
      ...mapState('table', ['checks']),
      ...mapState('table/edit', ['editModal']),
      ...mapGetters('table', ['controls']),
    },
    methods: {
      ...mapActions('table/edit', ['openEdit']),
      ...mapActions('table/remove', ['openRemove']),
    },
  }
</script>

<style scoped>

</style>