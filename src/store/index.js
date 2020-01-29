import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

const api = "http://localhost:5555";

export default new Vuex.Store({
  state: {
    continents: {
      EU: "Europe",
      AM: "Americas",
      AS: "Asia",
      AF: "Africa",
      OC: "Oceania"
    },
    countries: [],
    more: false,
    noEvents: false,
    events: [],
    topics: [],
    stats: {
      country: undefined,
      total: 0,
      shown: 0
    },
    pages: 0,
    cursor: "",
    country: ""
  },
  actions: {
    moreEvents({ commit, state }) {
      return axios
        .get(`${api}/events/search`, {
          params: {
            ...{ start: state.cursor },
            ...state.route.params
          }
        })
        .then(response =>
          commit("eventsFetched", { data: response.data, merge: true })
        );
    },
    fetchEvents({ commit, state }) {
      return axios
        .get(`${api}/events/search`, {
          params: state.route.params
        })
        .then(response => commit("eventsFetched", { data: response.data }));
    }
  },
  mutations: {
    eventsFetched(state, { data, merge = false }) {
      const [events, meta] = data;
      state.events = merge ? state.events.concat(events) : events;
      state.topics = meta.topics;
      state.countries = meta.countries;
      state.stats.total = meta.total;
      state.stats.shown = state.events.length;
      state.noEvents = state.events.length == 0;
      state.more = meta.more;
      state.cursor = meta.cursor;
    }
  }
});