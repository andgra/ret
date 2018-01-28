<template>
    <div class="datepicker mdl-textfield mdl-js-textfield mdl-textfield--floating-label" :class="{'is-dirty':getValue()}">
        <div :class="{'button':isButton,'display-inline-block':inline}">
            <input :id="id" :name="name" :value="getValue()" ref="focusTarget" :type="isButton?'hidden':'text'" class="mdl-textfield__input">
            <label class="mdl-textfield__label">{{label}}</label>
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
            label: {
                type: String,
                required: false
            },
            value: {
                type: String | Date,
                required: false
            },
            onSelect: {
                type: Function,
                required: false
            },
            inline: {
                type: Boolean,
                required: false,
                default: false
            },
            isButton: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
            }
        },
        methods: {
            getValue() {
                return this.value ? moment(this.value).format('DD.MM.YYYY') : ''
            }
        },
        created () {
        },
        mounted () {
            componentHandler.upgradeElement(this.$el);

            let $datepicker = $(this.$refs.focusTarget);
            console.log($datepicker);

            let $dp = $datepicker.datepicker({
                    inline: true,
                    showOn: this.isButton?'button':'focus',
                    changeYear: true,
                    changeMonth: true,
                    onSelect: newVal => {
                        console.log(newVal);
                        if(this.isButton) {
                            $datepicker.next('button').button("option", "label", newVal);
                        }
                        this.$emit('input', newVal)
                        if(this.onSelect) {
                            this.onSelect(newVal);
                        }
                    },
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
    .button {
        input {
            width: 80px;
        }
    }
</style>