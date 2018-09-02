<template>
    <div class="cols-toggler">
    <span class="cols-toggler-icon" @click="popupIsActive = !popupIsActive" :style="iconStyle">
      <i class="fa fa-lg" aria-hidden="true" :class="iconClass"></i>
    </span>
        <div class="cols-toggler-popup" v-if="popupIsActive">
            <div class="cols-toggler-popup-actions bordered-bottom text-right">
                <mdl-button colored="" raised @click.native="rememberColspanClick">Запомнить</mdl-button>
            </div>
            <div class="cols-toggler-popup-cols">
                <item-all/>
                <div class="form-indent">
                    <cols-toggler-wrapper :items="struct"></cols-toggler-wrapper>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import ItemAll from '~components/smart-table/cols-toggler/item-all';
  import {mapActions, mapGetters, mapMutations, mapState} from 'vuex';

  export default {
    components: {
      'item-all': ItemAll,
    },
    data() {
      return {
        popupIsActive: false,
      }
    },
    computed: {
      // ...mapState('table/edit', ['editRow', 'editModal']),
      ...mapGetters('table', ['struct']),
      iconClass() {
        return {
          'fa-caret-down': !this.popupIsActive,
          'fa-caret-up': this.popupIsActive,
        }
      },
      iconStyle() {
        let borderRadiusVal = this.popupIsActive ? 0 : undefined;
        return {
          borderBottomLeftRadius: borderRadiusVal,
          borderBottomRightRadius: borderRadiusVal,
        }
      },
    },
    created() {
      let $document = $(document);

      $document.on('mouseup', e => {
        if (this.popupIsActive) {
          // если открыто окно
          if ($(e.target).closest('.cols-toggler-popup, .cols-toggler-icon').length === 0) {
            // и клик за пределы окна, закрываем окно
            this.popupIsActive = false;
          }
        }
      });
    },
    methods: {
      ...mapActions('table', ['rememberColspan']),
      async rememberColspanClick() {
        await this.rememberColspan();
        this.popupIsActive = false;
      }
    },
  }
</script>

<style scoped lang="scss">
    .cols-toggler {
        position: absolute;
        right: 5px;
        top: 5px;
        text-align: right;
        &-icon {
            border: 1px solid #ccc;
            cursor: pointer;
            padding: 4px;
            display: inline-block;
            border-radius: .25em;
            .fa {
                display: block;
            }
            .fa.active {
                color: #337ab7;
            }
            .icon-wide {
                width: 1.05em;
            }
        }
        &-popup {
            text-align: left;
            display: block;
            position: relative;
            top: -1px;
            right: 0;
            background-color: #fff;
            padding: .5em .8em;
            border: 1px solid #ccc;
            box-shadow: 0 1px 2px #ccc;
            border-radius: .2em;
            border-top-right-radius: 0;
            z-index: 10001;
            &-actions {
                padding-bottom: 10px;
            }
            &-cols {
                max-height: 450px;
                overflow-y: auto;
                overflow-x: hidden;
            }
        }
    }
</style>