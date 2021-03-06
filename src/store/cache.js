export default {
  state: {
    version: null,
    cards: {},
    trends: {
      data: [],
      dt: null,
    },
    doodle: {
      data: {},
      dt: null,
    },
  },
  mutations: {
    SET_VERSION(state, version) {
      state.version = version;
    },
    SET_CARD_CACHE(state, { key, data }) {
      if (!data || !Object.keys(data).length) return;
      state.cards[key] = { ...data, ...{ CACHE_DT: Date.now() } };
    },
    DEL_CARD_CACHE(state, key) {
      if (state.cards[key]) delete state.cards[key];
    },
    SET_TRENDS_CACHE(state, trends) {
      state.trends.dt = Date.now();
      state.trends.data = trends;
    },
    SET_DOODLE_CACHE(state, doodle) {
      state.doodle.dt = Date.now();
      state.doodle.data = doodle;
    },
  },
};
