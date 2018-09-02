<template>
  <!-- Always shows a header, even in smaller screens. -->
  <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
    <header class="mdl-layout__header">
      <div class="mdl-layout__header-row">
        <!-- Title -->
        <span class="mdl-layout-title">Учет РЭТ</span>
        <!-- Add spacer, to align navigation to the right -->
        <div class="mdl-layout-spacer"></div>
        <!-- Navigation. We hide it in small screens. -->
        <nav class="mdl-navigation mdl-layout--large-screen-only">
          <!-- используйте компонент router-link для создания ссылок -->
          <!-- входной параметр `to` определяет путь для перехода -->
          <!-- `<router-link>` по умолчанию преобразуется в тег `<a>` -->
          <template v-if="isDevelopment">

            <button id="dev-menu" class="mdl-button mdl-js-button mdl-button--white">
              Меню разработчика
            </button>
            <ul class="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect" for="dev-menu">
              <router-link tag="li" to="/dev/seeds" class="mdl-menu__item">Наполнение базы</router-link>
            </ul>
          </template>
          <router-link tag="button" class="mdl-button mdl-js-button mdl-button--white" to="/settings">Настройки</router-link>
          <button id="print-menu" class="mdl-button mdl-js-button mdl-button--white">
            Печать
          </button>
          <ul class="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect" for="print-menu">
            <li class="mdl-menu__item" onclick="openPdf('/defects/print')">Справка по состоянию РЭТ</li>
            <li class="mdl-menu__item" onclick="openPdf('/works/print')">Таблица контроля работ представителей промышленности</li>
            <li class="mdl-menu__item" onclick="openPdf('/results/print')">Итоги эксплуатации</li>
            <li class="mdl-menu__item" onclick="openPdf('/operations/print')">Справка по срокам эксплатуации</li>
            <li class="mdl-menu__item" onclick="openPdf('/resources/print')">Ресурс</li>
            <li class="mdl-menu__item" onclick="openPdf('/overrun/print')">Перерасход</li>
          </ul>
          <!--<router-link tag="button" class="mdl-button mdl-js-button mdl-button&#45;&#45;white" to="/print">Печать</router-link>-->
          <!--<button id="settings-menu" class="mdl-button mdl-js-button mdl-button--white">
              Настройки
          </button>
          <ul class="mdl-menu mdl-menu&#45;&#45;bottom-right mdl-js-menu mdl-js-ripple-effect" for="settings-menu">
              <router-link tag="li" to="/settings" class="mdl-menu__item">Настройки</router-link>
              <router-link tag="li" to="/settings/print" class="mdl-menu__item">Настройки печати</router-link>
          </ul>-->
          <button id="dictionaries-menu" class="mdl-button mdl-js-button mdl-button--white">
            Справочники
          </button>
          <ul class="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect" for="dictionaries-menu">
            <router-link tag="li" to="/dictionary/condition" class="mdl-menu__item">Состояния РЭТ</router-link>
            <router-link tag="li" to="/dictionary/obj" class="mdl-menu__item">Военные части</router-link>
            <router-link tag="li" to="/dictionary/ret" class="mdl-menu__item">Категории РЭТ</router-link>
            <router-link tag="li" to="/dictionary/type" class="mdl-menu__item">Типы РЭТ</router-link>
            <router-link tag="li" to="/dictionary/repair" class="mdl-menu__item">Типы ремонта</router-link>
          </ul>

          <button id="tables-menu" class="mdl-button mdl-js-button mdl-button--white">
            Таблицы
          </button>
          <ul class="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect" for="tables-menu">
            <router-link tag="li" to="/tables/sets" class="mdl-menu__item">Таблица сводных данных</router-link>
            <router-link tag="li" to="/tables/defects" class="mdl-menu__item">Справка по состоянию РЭТ</router-link>
            <router-link tag="li" to="/tables/works" class="mdl-menu__item">Таблица контроля работ представителей промышленности</router-link>
            <router-link tag="li" to="/tables/overrun" class="mdl-menu__item">Перерасход РЭТ</router-link>
          </ul>
        </nav>
      </div>
    </header>
    <main class="mdl-layout__content">
      <!-- отображение компонента, для которого совпал путь -->
      <router-view></router-view>
    </main>
    <mdl-snackbar display-on="msgSent" class="mdl-snackbar_padding"></mdl-snackbar>
  </div>
</template>
<script>
  import Vue from '~js/modules/vue';
  import SmartTable from '~components/smart-table/main.vue';
  import EditFormWrapper from '~components/smart-table/edit-form/wrapper';
  import EditFormFields from '~components/smart-table/edit-form/fields';
  import ColsTogglerWrapper from '~components/smart-table/cols-toggler/wrapper';
  import ColsTogglerItem from '~components/smart-table/cols-toggler/item';
  import Loading from '~components/loading.vue';
  import DateTimePicker from "~components/datetimepicker.vue";
  import MdlSelect from "~components/select.vue";
  import MdlAutocomplete from "~components/autocomplete.vue";
  import IntervalPicker from "~components/intervalpicker.vue";
  import 'mdl-selectfield/dist/mdl-selectfield';

  Vue.component('smart-table', SmartTable);
  Vue.component('edit-form-wrapper', EditFormWrapper);
  Vue.component('edit-form-fields', EditFormFields);
  Vue.component('cols-toggler-wrapper', ColsTogglerWrapper);
  Vue.component('cols-toggler-item', ColsTogglerItem);
  Vue.component('loading', Loading);

  Vue.component('DateTimePicker', DateTimePicker);
  Vue.component('mdl-select', MdlSelect);
  Vue.component('mdl-autocomplete', MdlAutocomplete);
  Vue.component('IntervalPicker', IntervalPicker);

  export default {
    name: 'appLayout', // id of the layout, use "CamelCase" for compound words,
    created() {
      this.$store.commit('SET_SNACKBAR_EMITTER', this.$root);
      $('#app-loading').children().removeClass('is-active');
    },
    mounted() {
      componentHandler.upgradeElements(document.getElementsByClassName('mdl-js-menu'));
    },
  }
</script>