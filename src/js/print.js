import './core.js';

window.VueRouter = require("vue-router").default;
Vue.use(VueRouter);
// 0. При использовании модульной системы (напр. vue-cli),
// импортируйте Vue и VueRouter и затем вызовите `Vue.use(VueRouter)`

// 1. Определение используемых компонентов
// Они могут быть импортированы из внешних файлов
import PrintRet from '../components/print/ret.vue';
import PrintWorks from '../components/print/works.vue';
import PrintResults from '../components/print/results.vue';
import PrintExploit from '../components/print/exploit.vue';
import PrintResource from '../components/print/resource.vue';
import PrintSpending from '../components/print/spending.vue';

// 2. Определение путей
// Каждый путь должен указывать на компонент
// "Компонентом" может быть как созданный через `Vue.extend()`
// полноценный конструктор, так и просто объект с настройками компонента
// Вложенные пути будут рассмотрены далее.
const routes = [
    {path: '/ret', component: PrintRet},
    {path: '/works', component: PrintWorks},
    {path: '/results', component: PrintResults},
    {path: '/exploit', component: PrintExploit},
    {path: '/resource', component: PrintResource},
    {path: '/spending', component: PrintSpending},
];

// 3. Создаём экземпляр роутера с опцией `routes`
// Можно передать и другие опции, но пока не будем усложнять
const router = new VueRouter({
    routes // сокращение от `routes: routes`
});
console.log(getRequests());
router.replace({path: '/' + getRequests()['route'], redirect: '/'});

// 4. Создаём и монтируем корневой экземпляр Vue нашего приложения.
// Удостоверьтесь, что передали экземпляр роутера в опции `router`,
// что позволит приложению знать о его наличии
// $(function() {
const print = new Vue({
    router
}).$mount('#print');
// });

// Всё, приложение работает! ;)