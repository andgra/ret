<template>
    <div class="filter-popup">
        <div class="filter-popup__sorting"></div>
        <div class="filter-popup__templates"></div>
        <div class="filter-popup__search">
            <mdl-textfield floating-label="Поиск:" v-model="filter.search" type="text" class="mdl-textfield--full-width"></mdl-textfield>
            <div class="filter-popup__search-list">
                <ul v-if="filter.options.length">
                    <li>
                        <label><input type="checkbox"> Выделить все{{filter.search ? ' результаты поиска' : ''}}</label>
                    </li>
                    <li v-for="val in filter.options">
                        <label><input type="checkbox" :value="val"> {{val}}</label>
                    </li>
                </ul>
            </div>
        </div>
        <div class="filter-popup__buttons">
            <mdl-button primary="" @click.native="">Применить</mdl-button>
            <mdl-button @click.native="">Закрыть</mdl-button>
        </div>
    </div>
</template>

<script>
  export default {
    name: "popup"
  }
</script>

<style scoped>

</style>