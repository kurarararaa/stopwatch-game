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
  async delete({ commit }, id) {
    await db.collection('time-ranking').doc(id).delete()
  },
}
export const getters = {
  worldTop3(state) {
    return _(state.ranking)
  },
}
