<template>
    <div class="loading">
        <div class="loading-background" v-if="background"></div>
        <div class="loading-img"><mdl-spinner></mdl-spinner></div>
    </div>
</template>

<script>
  export default {
    name: "loading",
    props: {
      background: {
        type: Boolean,
        default: false
      }
    }
  }
</script>

<style scoped lang="scss">
    $size: 60px;
    .loading {
        position: fixed;
        width: 100%;
        height: 100%;
        z-index: 1000;
        &-img {
            position: absolute;
            top: calc(50vh - #{$size} / 2);
            left: calc(50vw - #{$size} / 2);
        }
        &-background {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            background: rgba(0,0,0,0.2);
        }
        .mdl-spinner {
            height: $size;
            width: $size;
        }
    }
</style>