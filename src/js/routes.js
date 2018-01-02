import './core.js';


console.log(nwin);

window.VueRouter = require("vue-router").default;
Vue.use(VueRouter);


import {VueExtendLayout, layout} from 'vue-extend-layout';

Vue.config.productionTip = false;
Vue.use(VueExtendLayout);

// 0. При использовании модульной системы (напр. vue-cli),
// импортируйте Vue и VueRouter и затем вызовите `Vue.use(VueRouter)`
// var ngui = window.nwDispatcher.requireNwGui() ;
/*nwin.moveTo(1000, 0);
nwin.width(800);*/

import SetsEdit from '../components/sets/edit.vue';
import DefectsEdit from '../components/defects/edit.vue';
import WorksEdit from '../components/works/edit.vue';
import DefectsPrint from '../components/defects/print.vue';
import WorksPrint from '../components/works/print.vue';
import ResultsPrint from '../components/results/print.vue';
import OperationsPrint from '../components/operations/print.vue';
import ResourcesPrint from '../components/resources/print.vue';
import OverspendPrint from '../components/overspend/print.vue';

// 1. Определение путей
// Каждый путь должен указывать на компонент
// "Компонентом" может быть как созданный через `Vue.extend()`
// полноценный конструктор, так и просто объект с настройками компонента
// Вложенные пути будут рассмотрены далее.
const routes = [
    {path: '/sets/edit', component: SetsEdit, meta: {layout: 'appLayout'}},
    {path: '/defects/edit', component: DefectsEdit, meta: {layout: 'appLayout'}},
    {path: '/works/edit', component: WorksEdit, meta: {layout: 'appLayout'}},
    {path: '/defects/print', component: DefectsPrint, meta: {layout: 'printLayout'}},
    {path: '/works/print', component: WorksPrint, meta: {layout: 'printLayout'}},
    {path: '/results/print', component: ResultsPrint, meta: {layout: 'printLayout'}},
    {path: '/operations/print', component: OperationsPrint, meta: {layout: 'printLayout'}},
    {path: '/resources/print', component: ResourcesPrint, meta: {layout: 'printLayout'}},
    {path: '/overspend/print', component: OverspendPrint, meta: {layout: 'printLayout'}},
];

// 2. Создаём экземпляр роутера с опцией `routes`
// Можно передать и другие опции, но пока не будем усложнять
const router = new VueRouter({
    routes // сокращение от `routes: routes`
});

if(getRequests()['route']) {
    router.replace({path: getRequests()['route'], redirect: '/'});
} else {
    router.replace({path: '/sets/edit', redirect: '/'});
}

// 3. Создаём и монтируем корневой экземпляр Vue нашего приложения.
// Удостоверьтесь, что передали экземпляр роутера в опции `router`,
// что позволит приложению знать о его наличии
// $(function() {
window.appa = new Vue({
    router,
    ...layout
}).$mount('#app');
// });


// Всё, приложение работает! ;)