<template>
    <div class="table-container">
        <EditedTable :options="options" :inRows="rows">
            <template slot="editModal" slot-scope="props">
                <mdl-dialog ref="editModal" :title="props.editingRow._id?'Редактирование записи':'Добавление записи'" :noFocusTrap="true">
                    <form class="editing-form" action="#" onsubmit="return false;">
                        <input name="_id" v-model="props.editingRow._id" type="hidden"/>
                        <mdl-textfield class="mdl-textfield--full-width" floating-label="Значение" v-model="props.editingRow.value"></mdl-textfield>
                    </form>
                    <div slot="actions">
                        <mdl-button @click.native="props.closeEdit()">Отменить</mdl-button>
                        <mdl-button primary="" @click.native="props.saveRow()">Сохранить</mdl-button>
                    </div>
                </mdl-dialog>
            </template>
        </EditedTable>
    </div>
</template>

<script>
    import EditedTable from '../common/EditedTable.vue';
    import dictionary from 'models/dictionary';

    let struct =
        [
            {id: "value", title: "Значение", type: 'text', default: ""},
//            {id: "default", title: "Выбрано по умолчанию", type: 'checkbox', default: false},
    ];

    let options = {
        struct,
        title: 'Типы ремонта',
        async setRows() {
            this.rows = (await dictionary.getDict('repair'));
            this.initTf();
        },
        async saveRow(item) {
            return await dictionary.saveToDict('repair', {_id: item._id}, item);
        },
        async removeRow(id) {
            await dictionary.delete(id);
        }
    };

    export default {
        data() {
            return {
                options,
                rows: [],
            }
        },
        components: {EditedTable}
    };
</script>
