<template>
    <div class="datepicker">
        <input :id="id" :name="name" :value="value" ref="focusTarget" :type="isButton?'hidden':'text'" class="mdl-textfield__input">
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