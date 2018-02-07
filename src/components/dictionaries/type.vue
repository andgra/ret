<template>
    <div class="table-container">
        <EditedTable :options="options" :inRows="rows">
            <template slot="editModal" slot-scope="props">
                <mdl-dialog ref="editModal" :title="props.editingRow._id?'Редактирование записи':'Добавление записи'" :noFocusTrap="true">
                    <form class="editing-form" action="#" onsubmit="return false;">
                        <input name="_id" v-model="props.editingRow._id" type="hidden"/>
                        <mdl-textfield class="mdl-textfield--full-width" floating-label="Значение" v-model="props.editingRow.value"></mdl-textfield>
                        <div class="form-group">
                            <p>Установленный ресурс РЭТ</p>
                            <div class="form-indent">
                                <mdl-textfield floating-label="ресурс до КР (час.)" v-model="props.editingRow.est.res.kr" type="number" class="mdl-textfield--full-width"></mdl-textfield>
                                <mdl-textfield floating-label="ресурс до списания (час.)" v-model="props.editingRow.est.res.cancel" type="number" class="mdl-textfield--full-width"></mdl-textfield>
                                <mdl-textfield floating-label="срок службы до КР (лет)" v-model="props.editingRow.est.life.kr" type="number" class="mdl-textfield--full-width"></mdl-textfield>
                                <mdl-textfield floating-label="срок службы до списания (лет)" v-model="props.editingRow.est.life.cancel" type="number" class="mdl-textfield--full-width"></mdl-textfield>
                            </div>
                        </div>
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
            {
                id: "est", title: "Установленный ресурс РЭТ", children:
                [
                    {
                        id: "res", title: "", children:
                        [
                            {id: "kr", title: "ресурс до<br>КР (час.)", type: 'number', default: 0, tablesaw: {type: "number"}},
                            {id: "cancel", title: "ресурс до<br>списания (час.)", type: 'number', default: 0, tablesaw: {type: "number"}},
                        ]
                    },
                    {
                        id: "life", title: "", children:
                        [
                            {id: "kr", title: "срок службы<br>до КР (лет)", type: 'number', default: 0, tablesaw: {type: "number"}},
                            {id: "cancel", title: "срок службы<br>до списания (лет)", type: 'number', default: 0, tablesaw: {type: "number"}},
                        ]
                    }
                ]
            },
            //            {id: "default", title: "Выбрано по умолчанию", type: 'checkbox', default: false},
    ];

    let options = {
        struct,
        title: 'Типы РЭТ',
        data: {
            perPage: 7,
        },
        async setRows() {
            this.rows = (await dictionary.getDict('type'));
            this.initTf();
        },
        async saveRow(item) {
            return await dictionary.saveToDict('type', {_id: item._id}, item);
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
