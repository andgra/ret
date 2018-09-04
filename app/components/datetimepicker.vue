<template>
    <div class="datetimepicker mdl-textfield mdl-js-textfield mdl-textfield--floating-label" :class="{'is-dirty':formatted}">
        <div :class="{'datetimepicker_min-width':inline,'display-inline-block':inline}">
            <input :id="id" :name="name" :value="formatted" ref="focusTarget" class="mdl-textfield__input">
            <label class="mdl-textfield__label">{{label}}</label>
        </div>
    </div>
</template>
<script>
    import moment from 'moment';

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
            time: {
                type: Boolean,
                required: false,
                default: true
            },
        },
        data() {
            return {
            }
        },
        methods: {
        },
        computed: {
          formatted() {
            return this.value ? moment(this.value).format(`DD.MM.YYYY${this.time?' HH:mm':''}`) : ''
          }
        },
        created() {
        },
        mounted() {
            componentHandler.upgradeElement(this.$el);

            $(this.$refs.focusTarget).datetimepicker({
                format: 'd.m.Y'+(this.time?' H:i':''),
                onChangeDateTime: newVal => {
                    this.$emit('input', newVal);
                    if (this.onSelect) {
                        this.onSelect(newVal);
                    }
                },
                dayOfWeekStart: 1,
                timepicker:this.time,
            });

        }
    }
</script>
<style lang="scss">
    .datetimepicker_min-width {
        input {
            width: 140px;
        }
    }
</style>