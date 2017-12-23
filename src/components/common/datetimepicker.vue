<template>
    <div class="datetimepicker">
        <input :id="id" :name="name" :value="valueIn" ref="focusTarget" class="mdl-textfield__input">
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
                type: String | Date,
                required: false,
            },
            onSelect: {
                type: Function,
                required: false
            },
        },
        data() {
            return {
                valueIn: this.value?moment(this.value).format('DD.MM.YYYY HH:mm'):''
            }
        },
        created() {
        },
        mounted() {
            componentHandler.upgradeElement(this.$el);

            $(this.$refs.focusTarget).datetimepicker({
                format: 'd.m.Y H:i',
                onChangeDateTime: $.proxy(function (newVal) {
                    console.log(newVal);
                    this.$emit('input', newVal)
                    if (this.onSelect) {
                        this.onSelect(newVal);
                    }
                }, this),
            });

        }
    }
</script>
<style lang="scss">
    .datetimepicker {
        display: inline-block;
        input {
            width: 140px;
        }
    }
</style>