<template>
    <main class="mdl-layout__content wide">
        <!-- отображение компонента, для которого совпал путь -->
        <router-view></router-view>
    </main>
</template>
<script>
    export default {
        name: 'printLayout' // id of the layout, use "CamelCase" for compound words
    }
</script>