import { _ } from "core-js"

export const state = () => ({
  localRanking: [],
})
export const mutations = {
  add(state, args) {
    state.localRanking.push({
      playMode: args.playMode,
      insertDate: args.insertDate,
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
  easyTop3(state) {
    return _(state.localRanking).sortBy(['score']).filter(['playMode', 'easy']).slice(0, 3).value()
  },
  normalTop3(state) {
    return _(state.localRanking).sortBy(['score']).filter(['playMode', 'normal']).slice(0, 3).value()
  },
  hardTop3(state) {
    return _(state.localRanking).sortBy(['score']).filter(['playMode', 'hard']).slice(0, 3).value()
  },
}
