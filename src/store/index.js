import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  getters: {
    id: state => state.id,
    model: state => state.model
  },
  state: () => ({
    id: '',
    model: {}
  }),
  mutations: {
    setId(state, id) {
      state.id = id
    },
    setModel(state, model) {
      state.model = model
    }
  },
  actions: {
    setId({ commit }, id) {
      commit('setId', id)
    },
    setModel({ commit }, model) {
      commit('setModel', model)
    }
  }
})
