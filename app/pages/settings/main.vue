<template>
    <div class="settings-container box">
        <h4>Настройки программы</h4>
        <form id="settings-form" action="#" onsubmit="return false;">
            <DateTimePicker label="фильтр даты для таблицы сводных данных" v-model="settings.startDate" :time="false"></DateTimePicker>

            <div class="form-group">
                <p>Итоги эксплатуации</p>
                <div class="form-indent">
                    <mdl-textfield floating-label="год" v-model="settings.resultsYear" type="number"></mdl-textfield>
                    <!--<DateTimePicker label="начало периода" v-model="settings.resultsStartDate" :time="false"></DateTimePicker>-->
                    <!--<DateTimePicker label="конец периода" v-model="settings.resultsEndDate" :time="false"></DateTimePicker>-->
                </div>
            </div>

            <div class="actions">
                <mdl-button primary="" raised="" @click.native="saveSettings()">Сохранить</mdl-button>
            </div>
        </form>
        <mdl-snackbar display-on="msgSent" class="mdl-snackbar_padding"></mdl-snackbar>
    </div>
</template>

<script>
    import settings from '~models/settings';
    export default {
        data() {
            return {
                settings: {
                    startDate: '',
                    resultsStartDate: '',
                    resultsEndDate: '',
                    resultsYear: moment().format('YYYY')
                },
            }
        },
        methods: {
            async saveSettings() {
                await settings.saveAll(this.settings);
                this.$root.$emit('msgSent', {message: 'Сохранено'});
                return false;
            }
        },
        async created() {
            this.settings = await settings.all();
//            this.$watch('settings',this.saveSetting);
        },
        mounted() {
        }
    };
</script>