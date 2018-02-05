<template>
    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" :class="{'is-dirty':isDirty}">
        <input class="mdl-textfield__input"
               ref="focusTarget"
               :value="value"
               @input="fireInputEvent()"
               @change="fireChangeEvent()"
               :id="id" :pattern="pattern"
               :disabled="disabled"
               :required="required"
               :readonly="readonly"
               :maxlength="maxlength"/>
        <label class="mdl-textfield__label" :for="id">{{label}}</label>
    </div>
</template>

<script>
    export default {
        props: {
            maxlength: {
                required: false
            },
            id: String,
            value: {
                required: false
            },
            disabled: {
                type: [Boolean, String],
                fill: true,
                required: false,
                default: false
            },
            strict: {
                type: Boolean,
                required: false,
                default: false
            },
            required: {
                type: [Boolean, String],
                fill: true,
                required: false,
                default: false
            },
            readonly: {
                type: [Boolean, String],
                fill: true,
                required: false,
                default: false
            },
            pattern: String,
            label: String,
            options: {
                required: true
            }
        },
        data() {
            return {}
        },

        methods: {
            fireInputEvent: function () {
                let val = this.$refs.focusTarget.value;
                if (!this.strict || this.optionsObject.includes(val)) {
                    this.$emit('input', this.$refs.focusTarget.value)
                }
            },
            fireChangeEvent: function () {
                let val = this.$refs.focusTarget.value;
                if (!this.strict || this.optionsObject.includes(val)) {
                    this.$emit('input', this.$refs.focusTarget.value)
                } else {
                    this.$refs.focusTarget.value = this.value;
                }
            },
            focus() {
                this.$refs.focusTarget.focus()
                return this
            },
            select() {
                this.$refs.focusTarget.select()
                return this
            },
            blur() {
                this.$refs.focusTarget.blur()
                return this
            },
            initAutocomplete() {
                if (this.optionsObject.length) {
                    let $el = $(this.$refs.focusTarget);
                    if ($el.autocomplete("instance")) {
                        $el.autocomplete("destroy");
                    }
                    $el.autocomplete({
                        source: this.optionsObject,
                        select: (event, ui) => {
                            setTimeout(() => this.fireChangeEvent(), 0);
                        }
                    });
                }
            }
        },

        computed: {
            isDirty() {
                return '' + this.value
            },
            optionsObject() {
                if (this.options && this.options.length !== undefined) {
                    return this.options.map(item => ( item.value ));
                }
                return [];
            }
        },
        mounted() {
            componentHandler.upgradeElements(this.$el);
            this.initAutocomplete();
        },
        watch: {
            options: function () {
                this.initAutocomplete();
            }
        }
    }
</script>
