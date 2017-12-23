<template>
    <div class="interval-picker">
        <div v-if="!edit">
            <span>{{string}}</span>
            <i class="fa fa-pencil" v-if="!outControl" @click="toggleEdit()"></i>
        </div>
        <div v-else>
            <input v-model="days" @change="fireChange"> сут
            <input v-model="hours" @change="fireChange"> час
            <input v-model="minutes" @change="fireChange"> мин
            <i class="fa fa-floppy-o" v-if="!outControl" @click="toggleEdit()"></i>
        </div>
    </div>
</template>
<script>


    export default {
        props: {
            value: {
                type: Number
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
            }
        },
        data () {
            let data = {};
            data.days = Math.floor(Math.floor(this.value/60)/24);
            data.hours = Math.floor((this.value)/60) - data.days*24;
            data.minutes = this.value - (data.hours + data.days*24)*60;
            return data;
        },
        computed: {
            valueProxy() {
                return Number(this.minutes) + (Number(this.hours) + Number(this.days)*24)*60;
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
        },
        methods: {
            toggleEdit () {
                this.edit = !this.edit;
            },
            fireChange (event) {
                this.$emit('input', this.valueProxy)
            }
        },
        mounted () {
            componentHandler.upgradeElement(this.$el);
        }
    };
</script>
<style lang="scss" scoped>
    .interval-picker {
        display: inline-block;
        white-space: nowrap;

        input {
            width:25px;
            margin-left:3px;
        }
    }
</style>