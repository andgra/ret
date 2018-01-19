<template>
    <div class="form-group">
        <p>{{item.title}}</p>
        <div class="form-indent">
            <div v-if="item.children">
                <Nested v-for="child in item.children" :item="child"></Nested>
            </div>
            <div v-else>
                <mdl-textfield v-if="item.type!=='select'" :floating-label="item.title.replace('&lt;br&gt;', ' ')" v-model="deep[`editingRow.${item.id}`]" class="mdl-textfield--full-width"></mdl-textfield>
                <mdl-select v-else :label="item.title" :id="`select-editingRow.${item.id}`" v-model="deep[`editingRow.${item.id}`]" :options="item.items" class="mdl-textfield--full-width"></mdl-select>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            id: {
                type: String,
                required: false
            },
            name: {
                type: String,
                required: false
            },
            value: {
                type: String,
                required: false
            },
            onSelect: {
                type: Function,
                required: false
            },
            isButton: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
            }
        },
        created () {
        },
        mounted () {
            componentHandler.upgradeElement(this.$el);

            let $datepicker = $(this.$refs.focusTarget);

            let $dp = $datepicker.datepicker({
                    inline: true,
                    showOn: this.isButton?'button':'focus',
                    changeYear: true,
                    changeMonth: true,
                    onSelect: $.proxy(function(newVal) {
                        if(this.isButton) {
                            $datepicker.next('button').button("option", "label", newVal);
                        }
                        this.$emit('input', newVal)
                        if(this.onSelect) {
                            this.onSelect(newVal);
                        }
                    }, this),
                }
            );
            if(this.isButton) {

                $dp.next("button").button({
                    label: this.value,
                }).addClass("mdl-button mdl-js-button mdl-js-ripple-effect startDate-button");
            }

        }
    }
</script>
<style lang="scss">
    .datepicker {
        display: inline-block;
        input {
            width: 80px;
        }
    }
</style>