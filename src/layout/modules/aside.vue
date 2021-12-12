<template>
  <el-menu active-text-color="#ffd04b" background-color="#545c64" text-color="#fff" unique-opened router :default-active="activeMenu">
    <el-sub-menu v-for="(menu,menuIndex) in state.menuList" :key="menuIndex" :index="menu.name">
      <template #title>
        <span>{{menu.name}}</span>
      </template>
      <el-sub-menu v-if="menu.children.children && menu.children.children.length > 0"></el-sub-menu>
      <el-menu-item
          v-else
          v-for="(item, itemIndex) in menu.children"
          :key="itemIndex"
          :route="item.path"
          :index="item.path" @click="openTabs(item.path, item.name, menu.name)">{{item.name}}</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script>
import {computed, onMounted, reactive} from "vue";
import {getMenuList} from "../../api/menu/menu";
import {errorMsg} from "../../utils/layerMsg";
import store from "../../store";
import routers from "../../router/routers";

export default {
  name: "Aside",
  setup(){
    const state = reactive({
      menuList: []
    })

    onMounted(() => {
      getMenuTree()
    })

    const activeMenu = computed({
      get(){
        getBreads(store.state.activeIndex)
        return store.state.activeIndex
      }
    })

    //  获取菜单树
    function getMenuTree(){
      getMenuList().then(res => {
        if (res.success){
          state.menuList = res.data
        } else {
          errorMsg(res.msg)
        }
      })
    }

    //  获取当前菜单的名称及上级名称，组装🍞屑
    function getBreads(path){
      let breads = []
      if (state.menuList && state.menuList.length > 0){
        state.menuList.forEach((menu) => {
          if (menu.children && menu.children.length > 0){
            menu.children.forEach((child) => {
              if (child.path === path){
                breads.push({name: menu.name, path: null})
                breads.push({name: child.name, path: null})
              }
            })
          }
        })
        store.dispatch('addBreadAction', breads)
      }
    }

    function getChildrenName(children, path,breads){
      if (children.children && children.children.length > 0){
        breads.push({name: children.children.name, path: null})
        getChildrenName(children.children)
      } else {
        console.log('aaa')
        if (children.path === path){
          console.info()
          breads.push({name: children.name, path: null})
        } else {
          breads = []
        }
      }
      return breads
    }

    //  添加菜单打开tabs，如果没有打开就打开，如果已就在就跳转
    function openTabs(path, name, parentName){
      store.dispatch('addTabsAction', {name: name, path: path})
      store.dispatch('setActiveIndexAction', path)
      store.dispatch('addBreadAction', [{name: parentName, path: null},{name: name, path: null}])
    }

    return {
      state,
      openTabs,
      activeMenu
    }
  }
}
</script>

<style scoped>
  .el-menu{
    height: calc(100vh);
  }
</style>