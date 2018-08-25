<template>
  <mdl-dialog :title="editModal && editRow._id?'Редактирование записи':'Добавление записи'" :noFocusTrap="true">
    <form v-if="editModal" class="editing-form" action="#" onsubmit="return false;">
      <input name="_id" v-model="editRow._id" type="hidden"/>
      <edit-form-fields :nodes="struct"></edit-form-fields>
    </form>
    <div slot="actions">
      <mdl-button @click.native="cancelEdit">Отменить</mdl-button>
      <mdl-button primary="" @click.native="saveEdit">Сохранить</mdl-button>
    </div>
  </mdl-dialog>
</template>

<script>
  import {mapActions, mapGetters, mapMutations, mapState} from 'vuex';

  export default {
    data() {
      return {}
    },
    computed: {
      ...mapState('table/edit', ['editRow', 'editModal']),
      ...mapGetters('table', ['struct']),
    },
    methods: {
      ...mapActions('table/edit', ['saveEdit', 'cancelEdit']),
    },
  }
</script>

<style scoped>

</style>