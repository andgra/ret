<template>
  <div class="edited-table-container">
    <loading v-show="loading > 0" :background="true"></loading>
    <div class="table-header">
      <slot name="header"></slot>
      <div class="bordered-top" :style="{position: 'relative'}">
        <actions class="pull-left"></actions>
        <cols-toggler class="pull-right"></cols-toggler>
      </div>
    </div>
    <div class="table-content">
      <!--<div class="table-responsive after-actions">-->
        <table id="table" data-tablesaw-mode="columntoggle" ref="table" class="mdl-data-table mdl-js-data-table border-all-cells edited-table">
          <thead is="table-header" @show-filter="showFilter"></thead>
          <tbody is="table-body"></tbody>
        </table>
      <!--</div>-->
    </div>
    <div class="table-footer">
      <pagination class="bordered-bottom"/>
      <actions/>
    </div>
    <mdl-dialog v-if="controls.remove" ref="removeModal" title="Удаление записей">
      <p>Вы действительно хотите удалить {{toRemove.length!==1?'выбранные записи':'выбранную запись'}}?</p>
      <div slot="actions">
        <mdl-button @click.native="cancelRemove">Отменить</mdl-button>
        <mdl-button primary="" @click.native="selfRemoveRows()">Удалить</mdl-button>
      </div>
    </mdl-dialog>
    <slot name="editModal">
      <!--todo: модаль по умолчанию-->
      <edit-form ref="editModal"></edit-form>
    </slot>
    <filter-popup v-if="filterPopup"/>
  </div>


</template>
<script>
  import Filter from '~components/smart-table/filter';
  import ColsToggler from '~components/smart-table/cols-toggler';
  import Header from '~components/smart-table/header';
  import EditForm from '~components/smart-table/edit-form';
  import Body from '~components/smart-table/body';
  import Pagination from '~components/smart-table/pagination';
  import Actions from '~components/smart-table/actions';
  import {mapActions, mapGetters, mapMutations, mapState} from 'vuex';
  import {isArray, isObject, clone} from '~js/helpers';

  export default {
    components: {
      'table-header': Header,
      'table-body': Body,
      'pagination': Pagination,
      'actions': Actions,
      'filter-popup': Filter,
      'cols-toggler': ColsToggler,
      'edit-form': EditForm,
    },
    data: function () {
      return {
        test: "",
      };
    },
    computed: {
      ...mapState('settings', ['settings']),
      ...mapState('table', ['query', 'rows', 'info', 'loading', 'api', 'options']),
      ...mapState('table/filter', ['appliedFilters']),
      ...mapState('table/filter', {filterPopup: 'popup'}),
      ...mapState('table/structure', {structure: 'instance'}),
      ...mapState('table/edit', ['editRow', 'editModal']),
      ...mapState('table/remove', ['toRemove', 'removeModal']),
      ...mapGetters('table', ['controls', 'heading', 'trailing', 'num', 'checked']),
      ...mapGetters('table/structure', ['lastOfGrid', 'dots', 'grid']),
    },
    created: function () {
      console.log('smart-table created');

      window.tableVm = this;
      let $document  = $(document);

      $document.on('keyup', e => {
        if (this.editModal) {
          if (e.keyCode === 13 && ((e.target.type !== 'textarea' && !$(e.target).hasClass('ui-autocomplete-input'))
            || e.ctrlKey || e.altKey)) {
            this.saveEdit();
            $('.ui-datepicker').hide();
            return false;
          }
          if (e.keyCode === 27) {
            this.cancelEdit();
            $('.ui-datepicker').hide();
            return false;
          }
        }
        if (this.removeModal) {
          if (e.keyCode === 13) {
            this.selfRemoveRows();
            return false;
          }
          if (e.keyCode === 27) {
            this.cancelRemove();
            return false;
          }
        }
      });
      $document.on('mouseup', e => {
        if (this.filterPopup) {
          // если открыто окно фильтра
          if ($(e.target).closest('.filter-popup').length === 0) {
            // и клик за пределы окна, закрываем окно фильтра
            this.closeFilter();
          }
        }
      });

      if (this.options.methods) {
        for (let name in this.options.methods) {
          this[name] = this.options.methods[name];
        }
      }

      if (this.options.created) {
        this.options.created.call(this);
      }
    },
    mounted: function () {
      let editModalInst = this.$slots.editModal ? this.$slots.editModal[0].componentInstance : this.$refs.editModal.$children[0];
      this.$watch('editModal', newVal => newVal ? editModalInst.open() : editModalInst.close());

      let removeModalInst = this.$refs.removeModal;
      this.$watch('removeModal', newVal => newVal ? removeModalInst.open() : removeModalInst.close());

      if (this.options.mounted) {
        this.options.mounted.call(this);
      }
    },
    methods: {
      ...mapActions('table', ['setPage', 'toggleSort', 'setLimit', 'setWhere']),
      ...mapActions('table/edit', ['saveEdit', 'cancelEdit']),
      ...mapActions('table/remove', ['removeRows', 'cancelRemove']),
      ...mapActions('table/filter', ['openFilter', 'closeFilter']),
      ...mapActions(['notify']),
      getSelCnt: function (arr) {
        arr     = clone(arr);
        let res = 0;
        for (let i in arr) {
          if (isArray(arr[i]) || isObject(arr[i])) {
            res += this.getSelCnt(arr[i]);
          } else {
            res += arr[i];
          }
        }
        return res;
      },
      selfRemoveRows: async function () {
        await this.removeRows();
        this.notify('Удалено');

        if (this.options.onRemove) {
          $.proxy(this.options.onRemove, this)();
        }
      },
      showFilter(id, e) {
        let position = {
          left: e.clientX,
          top: e.clientY + 5,
        };
        // двигаем popup так, чтобы он не вылезал за правый край экрана
        let $el = $(this.$el);
        let popupWidth = 400;
        let popupMarginRight = 5;
        let containerRightBorder = $el.offset().left + $el.width();
        let popupRightBorder = position.left + popupWidth + popupMarginRight;
        if (popupRightBorder > containerRightBorder) {
          position.left = containerRightBorder - popupWidth - popupMarginRight;
        }

        this.openFilter({id, position});
      },
    },
  }
</script>

<style>
  .edited-table {
    width: 100%;
  }
</style>