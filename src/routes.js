require('babel-polyfill');
import 'core/main';

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

import Settings from '@/settings/main.vue';
import Print from '@/print/main.vue';
import DictCondition from '@/dictionaries/condition.vue';
import DictObj from '@/dictionaries/obj.vue';
import DictRet from '@/dictionaries/ret.vue';
import DictType from '@/dictionaries/type.vue';
import DictRepair from '@/dictionaries/repair.vue';

import SetsEdit from '@/sets/edit.vue';
import DefectsEdit from '@/defects/edit.vue';
import WorksEdit from '@/works/edit.vue';
import OverrunEdit from '@/overrun/edit.vue';

import DefectsPrint from '@/defects/print.vue';
import WorksPrint from '@/works/print.vue';
import ResultsPrint from '@/results/print.vue';
import OperationsPrint from '@/operations/print.vue';
import ResourcesPrint from '@/resources/print.vue';
import OverrunPrint from '@/overrun/print.vue';

// 1. Определение путей
// Каждый путь должен указывать на компонент
// "Компонентом" может быть как созданный через `Vue.extend()`
// полноценный конструктор, так и просто объект с настройками компонента
// Вложенные пути будут рассмотрены далее.
const routes = [
    {path: '/settings', component: Settings, meta: {layout: 'appLayout'}},
    {path: '/print', component: Print, meta: {layout: 'appLayout'}},
    {path: '/dictionary/condition', component: DictCondition, meta: {layout: 'appLayout'}},
    {path: '/dictionary/obj', component: DictObj, meta: {layout: 'appLayout'}},
    {path: '/dictionary/ret', component: DictRet, meta: {layout: 'appLayout'}},
    {path: '/dictionary/type', component: DictType, meta: {layout: 'appLayout'}},
    {path: '/dictionary/repair', component: DictRepair, meta: {layout: 'appLayout'}},
    {path: '/sets/edit', component: SetsEdit, meta: {layout: 'appLayout'}},
    {path: '/defects/edit', component: DefectsEdit, meta: {layout: 'appLayout'}},
    {path: '/works/edit', component: WorksEdit, meta: {layout: 'appLayout'}},
    {path: '/overrun/edit', component: OverrunEdit, meta: {layout: 'appLayout'}},
    {path: '/defects/print', component: DefectsPrint, meta: {layout: 'printLayout'}},
    {path: '/works/print', component: WorksPrint, meta: {layout: 'printLayout'}},
    {path: '/results/print', component: ResultsPrint, meta: {layout: 'printLayout'}},
    {path: '/operations/print', component: OperationsPrint, meta: {layout: 'printLayout'}},
    {path: '/resources/print', component: ResourcesPrint, meta: {layout: 'printLayout'}},
    {path: '/overrun/print', component: OverrunPrint, meta: {layout: 'printLayout'}},
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