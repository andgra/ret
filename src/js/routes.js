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

// 1. Определение путей
// Каждый путь должен указывать на компонент
// "Компонентом" может быть как созданный через `Vue.extend()`
// полноценный конструктор, так и просто объект с настройками компонента
// Вложенные пути будут рассмотрены далее.
const routes = [
    {path: '/sets/edit', component: require('@/sets/edit'), meta: {layout: 'appLayout'}},
    {path: '/defects/edit', component: require('@/defects/edit'), meta: {layout: 'appLayout'}},
    {path: '/works/edit', component: require('@/works/edit'), meta: {layout: 'appLayout'}},
    {path: '/defects/print', component: require('@/defects/print'), meta: {layout: 'printLayout'}},
    {path: '/works/print', component: require('@/works/print'), meta: {layout: 'printLayout'}},
    {path: '/results/print', component: require('@/results/print'), meta: {layout: 'printLayout'}},
    {path: '/operations/print', component: require('@/operations/print'), meta: {layout: 'printLayout'}},
    {path: '/resources/print', component: require('@/resources/print'), meta: {layout: 'printLayout'}},
    {path: '/overspend/print', component: require('@/overspend/print'), meta: {layout: 'printLayout'}},
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
const app = new Vue({
    router,
    ...layout
}).$mount('#app');
// });


// Всё, приложение работает! ;)