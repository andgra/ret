<template>
    <div class="settings-container box">
        <h4>Настройки программы</h4>
        <form id="settings-form" action="#" onsubmit="return false;">
            <!--<DateTimePicker label="фильтр даты для таблицы сводных данных" v-model="settings.startDate" :time="false"></DateTimePicker>-->

            <div class="form-group">
                <p>Итоги эксплатуации (печать) - выберите год, на который будет строиться таблица</p>
                <div class="form-indent">
                    <mdl-textfield floating-label="год" v-model="settings.resultsYear" type="number"></mdl-textfield>
                    <!--<DateTimePicker label="начало периода" v-model="settings.resultsStartDate" :time="false"></DateTimePicker>-->
                    <!--<DateTimePicker label="конец периода" v-model="settings.resultsEndDate" :time="false"></DateTimePicker>-->
                </div>
            </div>

            <div class="actions">
                <mdl-button primary="" raised="" @click.native="save">Сохранить</mdl-button>
            </div>
        </form>
    </div>
</template>

<script>
  import settings from '~api/settings';
  import moment from 'moment';
  import {mapActions, mapGetters, mapMutations, mapState} from 'vuex';

  export default {
    data() {
      return {
        settings: {
          // startDate: '',
          // resultsStartDate: '',
          // resultsEndDate: '',
          resultsYear: moment().format('YYYY')
        },
      }
    },
    methods: {
      ...mapActions(['notify']),
      ...mapActions('settings', ['saveSettings']),
      async save() {
        await this.saveSettings(this.settings);
        this.notify('Сохранено');
        return false;
      },
    },
    async created() {
      this.settings = this.$store.state.settings.options;
    },
    mounted() {
    }
  };
</script>