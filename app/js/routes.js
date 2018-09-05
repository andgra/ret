import Vue from '~js/modules/vue';

let VueRouter = require("vue-router").default;
Vue.use(VueRouter);

Vue.config.productionTip = false;

// 0. При использовании модульной системы (напр. vue-cli),
// импортируйте Vue и VueRouter и затем вызовите `Vue.use(VueRouter)`

import AppLayout from '~layouts/app.vue';
import Settings from '~pages/settings/main.vue';
let Seeds;
if (IS_DEVELOPMENT) {
  Seeds = require('~pages/dev/seeds.vue').default;
}
// import Print from '~pages/settings/print.vue';
// словари
import DictCondition from '~pages/dictionaries/condition.vue';
import DictObj from '~pages/dictionaries/obj.vue';
import DictRet from '~pages/dictionaries/ret.vue';
import DictType from '~pages/dictionaries/type.vue';
import DictRepair from '~pages/dictionaries/repair.vue';
// таблицы
import SetsTable from '~pages/tables/sets.vue';
import DefectsEdit from '~pages/tables/defects.vue';
import WorksTable from '~pages/tables/works.vue';
import OverrunTable from '~pages/tables/overrun.vue';

import moment from 'moment'
moment.locale('ru');

// 1. Определение путей
// Каждый путь должен указывать на компонент
// "Компонентом" может быть как созданный через `Vue.extend()`
// полноценный конструктор, так и просто объект с настройками компонента
// Вложенные пути будут рассмотрены далее.
const routes = [
  {
    path: '', component: AppLayout,
    children: [...[
      {path: '/settings', component: Settings},
      // таблицы
      {path: '/tables/sets', component: SetsTable},
      {path: '/tables/works', component: WorksTable},
      {path: '/tables/overrun', component: OverrunTable},
      {path: '/tables/defects', component: DefectsEdit},
      // справочники
      {path: '/dictionary/condition', component: DictCondition},
      {path: '/dictionary/obj', component: DictObj},
      {path: '/dictionary/ret', component: DictRet},
      {path: '/dictionary/type', component: DictType},
      {path: '/dictionary/repair', component: DictRepair},
    ], ...(IS_DEVELOPMENT ? [
      {path: '/dev/seeds', component: Seeds},
    ] : [])],
  },
];

// 2. Создаём экземпляр роутера с опцией `routes`
// Можно передать и другие опции, но пока не будем усложнять
const router = new VueRouter({
  routes
});

router.replace({path: '/tables/sets', redirect: '/'});

// 3. Создаём и монтируем корневой экземпляр Vue нашего приложения.
// Удостоверьтесь, что передали экземпляр роутера в опции `router`,
// что позволит приложению знать о его наличии
export default router;

// Всё, приложение работает! ;)