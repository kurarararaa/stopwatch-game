import db from '~/plugins/db'
export const state = () => ({
  ranking: [],
  unsubscribe: null,
})
export const mutations = {
  update(state, args) {
    if (_(state.ranking).find((e) => e.id === args.id)) {
      _(state.ranking)
        .filter(['id', args.id])
        .forEach((e) => {
          _(args).keys((key) => {
            console.log(key)
            e[key] = args[key]
          })
        })
    } else {
      state.ranking.push(args)
    }
  },
}
export const actions = {
  async onSnapshot({ commit }) {
    this.unsubscribe = await db.collection('time-ranking').onSnapshot(
      (snapshot) => {
        _(snapshot.docs).forEach((doc) => {
          const ranking = doc.data()
          ranking.id = doc.id
          commit('update', ranking)
        })
      },
      (err) => {
        /* eslint no-console: 0 */
        console.error(`Encountered error: ${err}`)
      }
    )
  },
  async stopSnapshot({ commit }) {
    await this.unsubscribe()
  },
  async insert({ commit }, ranking) {
    return await db.collection('time-ranking').add(ranking)
  },
  async selectAll({ commit }) {
    db.collection("time-ranking").get().then((query) => {
      var buff = [];
      query.forEach((doc) => {
        var data = doc.data()
        // buffの中に参照したデータをセット
        buff.push([doc.id, data.time])
      });
      // console.log(buff)
      return buff
    })
      .catch((error) => {
        console.log(`データの取得に失敗しました (${error})`);
      });


  },
  async delete({ commit }, id) {
    await db.collection('time-ranking').doc(id).delete()
  },
}
