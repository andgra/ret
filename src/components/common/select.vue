<template>
    <div class="mdl-selectfield mdl-js-selectfield mdl-selectfield--floating-label" :class="{'is-dirty':name}">
        <select :id="id" ref="select" class="mdl-selectfield__select" @change="emitSelect">
            <option v-for="option in optionsObject"
                    :selected="value===option.value">{{option.name}}
            </option>
        </select>
        <div class="mdl-selectfield__icon"><i class="material-icons">arrow_drop_down</i></div>
        <label class="mdl-selectfield__label" :for="id">{{label}}</label>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                name: ''
            }
        },

        methods: {
            emitSelect() {
                this.$emit('input', this.$refs.select.value)
            },
            setName() {
                this.name = null;
                for (let i = 0; i < this.optionsObject.length; ++i) {
                    let option = this.optionsObject[i];
                    if (this.value === option.value) this.name = option.name
                }
                if (!this.name) this.name = this.value;
            }
        },

        computed: {
            optionsObject() {
                if (this.options && this.options.length !== undefined) {
                    return this.options.map((option) => {
                        if (typeof option === 'string') {
                            return {
                                name: option,
                                value: option
                            }
                        } else {
                            if(option.name === undefined) option.name = option.value;
                            return option
                        }
                    })
                } else {
                    return []
                }
            },
        },
        props: {
            label: String,
            id: {
                required: true
            },
            value: {
                required: false
            },
            options: {
                required: true
            }
        },
        mounted() {
            componentHandler.upgradeElements(this.$el);
            this.setName();
            setTimeout(() => this.emitSelect(), 0);
        },
        watch: {
            value: function () {
                this.setName();
                setTimeout(() => this.emitSelect(), 0);
            },
            options: function () {
                componentHandler.upgradeElements(this.$el);
                this.setName();
                setTimeout(() => this.emitSelect(), 0);
            }
        }
    }
</script>
