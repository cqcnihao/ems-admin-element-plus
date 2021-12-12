<template>
<el-row>
  <el-col :span="12" class="head-left">
    <Switch></Switch>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item v-for="(bread, index) in breads" :key="index" @click="goBack(bread.path)"><a>{{bread.name}}</a></el-breadcrumb-item>
    </el-breadcrumb>
  </el-col>
  <el-col :span="12" class="head-right">
    <el-dropdown trigger="click">
      <span class="username">{{state.username}}</span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="logout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </el-col>
</el-row>
</template>

<script>
import {computed, reactive} from "vue";
import Switch from './switch'
import store from "../../store";
import routers from "../../router/routers";
import {ElMessageBox} from "element-plus";
import {infoMsg} from "../../utils/layerMsg";

export default {
  name: "header",
  components: {
    Switch
  },
  setup(){
    const state = reactive({
      username: store.state.user.nickName,
    })

    const breads = computed({
      get(){
        return store.state.breads
      }
    })

    const logout = () => {
      ElMessageBox.confirm('确认退出？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        sessionStorage.clear()
        store.dispatch('tokenAction', null)
        routers.push({path: '/login'})
      }).catch(() => {
        infoMsg('已取消')
      })
    }

    const goBack = (path) =>{
      if (path){
        routers.push({path: path})
        store.dispatch('setActiveIndexAction', path)
      }
    }

    return {
      state,
      logout,
      goBack,
      breads
    }
  }
}
</script>

<style scoped lang="scss">

</style>