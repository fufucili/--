import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: null
  },
  getters: {
    userInfo: state => {
      if(!state.userInfo){
        let userInfo = sessionStorage.getItem("userInfo");
        state.userInfo = JSON.parse(userInfo);
      }

      return state.userInfo;
    }, // 获取用户信息
    isLoggedIn: (state, getters) => !!getters.userInfo, // 检查用户是否已登录
  },
  mutations: {
    SET_USER_INFO: (state, userInfo) => {
      state.userInfo = userInfo; // 更新用户信息
      if(userInfo){
        sessionStorage.setItem("userInfo",JSON.stringify(userInfo));//保存用户登录信息到浏览器
      }else{
        sessionStorage.removeItem("userInfo");
      }
    },
  },
  actions: {
    // 登录动作，通常会调用 API 进行身份验证，然后通过 commit 调用 mutation 更新用户信息
    login: ({ commit }, userInfo) => {
      // 假设登录成功，直接提交 mutation 设置用户信息
      commit('SET_USER_INFO', userInfo);
    },
    // 登出动作，清除用户信息
    logout: ({ commit }) => {
      // 提交 mutation 清除用户信息
      commit('SET_USER_INFO', null);
    }
  },
  modules: {
  }
})
