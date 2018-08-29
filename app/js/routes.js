import Vue from '~js/modules/vue';

let VueRouter = require("vue-router").default;
Vue.use(VueRouter);

Vue.config.productionTip = false;

// 0. При использовании модульной системы (напр. vue-cli),
// импортируйте Vue и VueRouter и затем вызовите `Vue.use(VueRouter)`

import LayoutTable from '~layouts/app.vue';
import Settings from '~pages/settings/main.vue';
import Seeds from '~pages/dev/seeds.vue';
// import Print from '~pages/settings/print.vue';
// import DictCondition from '~pages/dictionaries/condition.vue';
// import DictObj from '~pages/dictionaries/obj.vue';
// import DictRet from '~pages/dictionaries/ret.vue';
// import DictType from '~pages/dictionaries/type.vue';
// import DictRepair from '~pages/dictionaries/repair.vue';
//
import SetsTable from '~pages/tables/sets.vue';
// import DefectsEdit from '~pages/tables/defects.vue';
// import WorksTable from '~pages/tables/works.vue';
import OverrunTable from '~pages/tables/overrun.vue';
//
// import DefectsPrint from '~pages/print/defects.vue';
// import WorksPrint from '~pages/print/works.vue';
// import ResultsPrint from '~pages/print/results.vue';
// import OperationsPrint from '~pages/print/operations.vue';
// import ResourcesPrint from '~pages/print/resources.vue';
// import OverrunPrint from '~pages/print/overrun.vue';

// 1. Определение путей
// Каждый путь должен указывать на компонент
// "Компонентом" может быть как созданный через `Vue.extend()`
// полноценный конструктор, так и просто объект с настройками компонента
// Вложенные пути будут рассмотрены далее.
const routes = [
  {
    path: '', component: LayoutTable,
    children: [...[
      {path: '/settings', component: Settings},
      {path: '/tables/sets', component: SetsTable},
      {path: '/tables/overrun', component: OverrunTable},
    ], ...(IS_DEVELOPMENT ? [
      {path: '/dev/seeds', component: Seeds},
    ] : [])],
  },
  // {path: '/print', component: Print, meta: {layout: 'appLayout'}},
  //
  // {path: '/dictionary/condition', component: DictCondition, meta: {layout: 'appLayout'}},
  // {path: '/dictionary/obj', component: DictObj, meta: {layout: 'appLayout'}},
  // {path: '/dictionary/ret', component: DictRet, meta: {layout: 'appLayout'}},
  // {path: '/dictionary/type', component: DictType, meta: {layout: 'appLayout'}},
  // {path: '/dictionary/repair', component: DictRepair, meta: {layout: 'appLayout'}},
  //
  // {path: '/defects/edit', component: DefectsEdit, meta: {layout: 'appLayout'}},
  // {path: '/works/edit', component: WorksEdit, meta: {layout: 'appLayout'}},
  // {path: '/overrun/edit', component: OverrunEdit, meta: {layout: 'appLayout'}},
  //
  // {path: '/defects/print', component: DefectsPrint, meta: {layout: 'printLayout'}},
  // {path: '/works/print', component: WorksPrint, meta: {layout: 'printLayout'}},
  // {path: '/results/print', component: ResultsPrint, meta: {layout: 'printLayout'}},
  // {path: '/operations/print', component: OperationsPrint, meta: {layout: 'printLayout'}},
  // {path: '/resources/print', component: ResourcesPrint, meta: {layout: 'printLayout'}},
  // {path: '/overrun/print', component: OverrunPrint, meta: {layout: 'printLayout'}},
];

// 2. Создаём экземпляр роутера с опцией `routes`
// Можно передать и другие опции, но пока не будем усложнять
const router = new VueRouter({
  routes
});

// router.replace({path: '/settings', redirect: '/'});
// if (getRequests()['route']) {
//   router.replace({path: getRequests()['route'], redirect: '/'});
// } else {
// router.replace({path: '/tables/sets', redirect: '/'});
router.replace({path: '/settings', redirect: '/'});
// }

// 3. Создаём и монтируем корневой экземпляр Vue нашего приложения.
// Удостоверьтесь, что передали экземпляр роутера в опции `router`,
// что позволит приложению знать о его наличии
// $(function() {
export default router;
// });


// Всё, приложение работает! ;)