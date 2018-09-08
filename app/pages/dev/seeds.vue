<template>
    <div class="box">
        <h4>Наполнение базы</h4>
        <p class="bordered-bottom" style="padding-bottom: 20px;">
            <label>Все</label>
            <mdl-button primary="" @click.native="runAllSeeds">Запустить</mdl-button>
        </p>
        <p v-for="(seed, index) in seeds" :key="index">
            <label v-html="seed.title"></label>
            <mdl-button primary="" @click.native="runSeed(seed)">Запустить</mdl-button>
        </p>
    </div>
</template>

<script>
  import setsSeed from '~seeds/sets';
  import defectsSeed from '~seeds/defects';
  import worksSeed from '~seeds/works';
  import overrunSeed from '~seeds/overrun';
  import {clone} from '~js/helpers';
  import {mapActions, mapGetters, mapMutations, mapState} from 'vuex';
  
  export default {
    data() {
      return {
        seeds: [
          {
            title: 'sets',
            run: setsSeed,
            sort: 1,
          },
          {
            title: 'defects',
            run: defectsSeed,
            sort: 1,
          },
          {
            title: 'works',
            run: worksSeed,
            sort: 1,
          },
          {
            title: 'overrun',
            run: overrunSeed,
            sort: 2,
          },
        ],
      }
    },
    methods: {
      ...mapActions(['notify']),
      async runAllSeeds() {
        let seeds = clone(this.seeds);
        seeds.sort((m1, m2) => ( m1.sort < m2.sort ? -1 : m1.sort > m2.sort ? 1 : 0 ));
        for (let seed of seeds) {
          await this.runSeed(seed, false);
        }
        this.notify('Выполнено');
      },
      async runSeed(seed, notify = true) {
        await seed.run();
        if (notify) {
          this.notify('Выполнено');
        }
      },
    },
  }
</script>

<style scoped>

</style>