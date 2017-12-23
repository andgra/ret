<template>
    <!-- Always shows a header, even in smaller screens. -->
    <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
        <header class="mdl-layout__header">
            <div class="mdl-layout__header-row">
                <!-- Title -->
                <span class="mdl-layout-title">Учет РЭТ</span>
                <!-- Add spacer, to align navigation to the right -->
                <div class="mdl-layout-spacer"></div>
                <!-- Navigation. We hide it in small screens. -->
                <nav class="mdl-navigation mdl-layout--large-screen-only">
                    <!-- используйте компонент router-link для создания ссылок -->
                    <!-- входной параметр `to` определяет путь для перехода -->
                    <!-- `<router-link>` по умолчанию преобразуется в тег `<a>` -->
                    <button id="print-menu" class="mdl-button mdl-js-button mdl-button--white">
                        Печать
                    </button>
                    <ul class="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect" for="print-menu">
                        <li class="mdl-menu__item" onclick="openPdf('/defects/print')">Справка по состоянию РЭТ</li>
                        <li class="mdl-menu__item" onclick="openPdf('/works/print')">Таблица контроля работ представителей промышленности</li>
                        <li class="mdl-menu__item" onclick="openPdf('/operations/print')">Итоги эксплуатации</li>
                        <li class="mdl-menu__item" onclick="openPdf('/operations/print')">Справка по срокам эксплатуации</li>
                        <li class="mdl-menu__item" onclick="openPdf('/resources/print')">Ресурс</li>
                        <li class="mdl-menu__item" onclick="openPdf('/overspend/print')">Перерасход</li>
                    </ul>

                    <button id="tables-menu" class="mdl-button mdl-js-button mdl-button--white">
                        Таблицы
                    </button>
                    <ul class="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect" for="tables-menu">
                        <router-link tag="li" to="/sets/edit" class="mdl-menu__item">Таблица сводных данных</router-link>
                        <router-link tag="li" to="/defects/edit" class="mdl-menu__item">Справка по состоянию РЭТ</router-link>
                        <router-link tag="li" to="/works/edit" class="mdl-menu__item">Таблица контроля работ представителей промышленности</router-link>
                    </ul>
                </nav>
            </div>
        </header>
        <main class="mdl-layout__content overflow-x">
            <!-- отображение компонента, для которого совпал путь -->
            <router-view></router-view>
        </main>
    </div>
</template>
<script>
    export default {
        name: 'appLayout' // id of the layout, use "CamelCase" for compound words
    }
</script>