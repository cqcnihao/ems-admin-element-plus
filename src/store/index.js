import {createStore} from "vuex";
import createPersistedState from "vuex-persistedstate";

const store = createStore({
  state: {
    token: null,
    routers: null,
    isLoadMenu: false,
    user: null,
    //  所有打开的路由
    openTabs: [],
    //  当前激活的路由
    activeIndex: '',
    //  🍞屑
    breads:[{path: '/home', name: '首页', close: false}]
  },
  mutations: {
    //  持久化token
    tokenMutation(state, payload){
      state.token = payload
    },
    //  持久化路由
    routesMutation(state, payload){
      state.routers = payload
    },
    //  持久化是否加载路由状态
    loadMenuMutation(state, payload){
      state.isLoadMenu = payload
    },
    //  持久化用户对象
    userMutation(state, payload){
      state.user = payload
    },
    //  添加tabs
    addTabs(state, payload){
      if (!state.openTabs.find((tab) => tab.path === payload.path)){
        //  首页禁止关闭
        if (payload.name !== '首页'){
          payload.close = true
        }
        state.openTabs.push(payload)
      }
    },
    //  删除tabs
    delTabs(state, payload){
      state.openTabs = state.openTabs.filter((tab) => tab.path !== payload)
    },
    //  清空tabs
    clearTabs(state, payload){
      state.openTabs = []
    },
    //  设置当前激活的tab
    setActiveIndex(state, payload){
      state.activeIndex = payload
    },
    //  添加🍞屑
    addBread(state, payload){
      state.breads = [{path: '/home', name: '首页', close: false}]
      if (payload && payload.length > 0){
        payload.forEach((item) => {
          state.breads.push(item)
        })
      }
    }
  },
  actions: {
    //  持久化token
    tokenAction(context, data){
      context.commit('tokenMutation', data)
    },
    //  持久化路由
    routesActions(context, data){
      context.commit('routesMutation', data)
    },
    //  持久化是否加载路由状态
    loadMenuAction(context, data){
      context.commit('loadMenuMutation', data)
    },
    //  持久化用户对象
    userAction(context, data){
      context.commit('userMutation', data)
    },
    //  添加tabs
    addTabsAction(context, data){
      context.commit('addTabs', data)
    },
    //  清空tabs
    clearTabsAction(context, data){
      context.commit('clearTabs', data)
    },
    //  删除tabs
    delTabsAction(context, data){
      context.commit('delTabs', data)
    },
    //  设置当前激活的tab
    setActiveIndexAction(context, data){
      context.commit('setActiveIndex', data)
    },
    //  添加🍞屑
    addBreadAction(context, data){
      context.commit('addBread', data)
    }
  },
  plugins: [createPersistedState({storage: sessionStorage})]
})

export default store
