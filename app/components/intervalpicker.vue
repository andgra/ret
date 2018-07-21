<template>
    <div class="interval-picker mdl-textfield mdl-textfield--floating-label is-dirty">
        <div :class="{'display-inline-block':inline}">
            <input v-model="days" @change="fireChange" class="mdl-textfield__input"> сут
            <input v-model="hours" @change="fireChange" class="mdl-textfield__input"> час
            <input v-model="minutes" @change="fireChange" class="mdl-textfield__input"> мин
            <label class="mdl-textfield__label">{{label}}</label>
        </div>
    </div>
</template>
<script>


    export default {
        props: {
            value: {
                type: Number
            },
            label: {
                type: String,
                required: false
            },
            outControl: {
                type: Boolean,
                required: false,
                default: false
            },
            edit: {
                type: Boolean,
                required: false,
                default: false
            },
            inline: {
                type: Boolean,
                required: false,
                default: false
            },
        },
        data() {
            return this.computeData();
        },
        computed: {
            valueProxy() {
                return Number(this.minutes) + (Number(this.hours) + Number(this.days) * 24) * 60;
            },
            string() {
                var result = '';
                if (this.days && this.days > 0) {
                    result += this.days + ' сут';
                }
                if (this.hours && this.hours > 0) {
                    result = result + ((result.length > 0) ? ' ' : '') + this.hours + ' час';
                }
                if (this.minutes && this.minutes > 0) {
                    result = result + ((result.length > 0) ? ' ' : '') + this.minutes + ' мин';
                }
                return result;
            }
        },
        created() {
            this.$watch('value', () => Object.assign(this.$data, this.computeData()))
        },
        methods: {
            computeData() {
                let data = {};
                data.days = Math.floor(Math.floor(this.value / 60) / 24);
                data.hours = Math.floor((this.value) / 60) - data.days * 24;
                data.minutes = this.value - (data.hours + data.days * 24) * 60;
                return data;
            },
            toggleEdit() {
                this.edit = !this.edit;
            },
            fireChange(event) {
                this.$emit('input', this.valueProxy)
            }
        },
        mounted() {
            componentHandler.upgradeElement(this.$el);
        }
    };
</script>
<style lang="scss" scoped>
    .interval-picker {
        white-space: nowrap;

        input {
            width: 25px;
            margin-left: 3px;
            display: inline-block;
        }
    }
</style>