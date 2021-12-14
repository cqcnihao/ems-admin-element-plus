<template>
<el-container style="height: calc(100vh)">
  <el-aside width="200px">
    <Aside></Aside>
  </el-aside>
  <el-container>
    <el-header>
      <Header></Header>
    </el-header>
    <el-main>
      <Main></Main>
    </el-main>
<!--    <el-footer>FOOTER</el-footer>-->
  </el-container>
</el-container>
</template>

<script>
import Aside from './modules/aside'
import Main from './modules/main'
import Header from './modules/header'
import {onMounted} from "vue";
import store from "../store";
import routers from "../router/routers";
export default {
  components: {
    Aside,
    Main,
    Header
  },
  name: "index",
  setup(){

    //  默认添加首页
    onMounted(() => {
      //  刷新后清空缓存，如果想要刷新后保存之前打开的页面，可以不清空缓存
      store.dispatch('clearTabsAction')
      store.dispatch('addTabsAction', {path: '/home', name: '首页'})
      store.dispatch('setActiveIndexAction', '/home')
      routers.push({path: '/home'})
    })

    return{

    }
  }
}
</script>

<style scoped lang="scss">
.el-main{
  padding: 0;
}
</style>