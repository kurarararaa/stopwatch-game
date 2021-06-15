export const state = () => ({
  localRanking: [],
})
export const mutations = {
  add(state, args) {
    state.localRanking.push({
      key: args.key,
      time: args.time,
      score: args.score,
    })
  },
}
export const actions = {
  addLocalRanking({ commit }, rankingData) {
    commit('add', rankingData)
  },
}
export const getters = {
  top3(state) {
    return _(state.localRanking).sortBy(['score']).reverse().slice(0, 3)
  },
}
