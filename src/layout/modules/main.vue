<template>
  <el-tabs v-model="activeIndex" type="card" @tab-remove="removeTab" @tab-click="clickTab">
    <el-tab-pane v-for="(tab, index) in tabs" :key="index" :label="tab.name" :name="tab.path" :closable="tab.close">

    </el-tab-pane>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </el-tabs>
</template>

<script>
import {computed, reactive} from "vue";
import store from "../../store";
import routers from "../../router/routers";

export default {
  name: "main",
  setup(){
    const state = reactive({

    })

    //  当前激活tab
    let activeIndex = computed({
      get(){
        return store.state.activeIndex
      },
      set(val){
        store.dispatch('setActiveIndexAction', val)
      }
    })

    //  已打开tab列表
    const tabs = computed({
      get(){
        return store.state.openTabs
      }
    })

    //  关闭tabs
    function removeTab(targetName){
      //  遍历当前已打开tab
      tabs.value.forEach((tab, index) => {
        //  如果关闭的是当前激活状态的，就将后面的一个当作下一个激活的tab
        //  如果关闭的是最后个，就将前面的一个当作激活tab
        if (tab.path === targetName) {
          const nextTab = tabs.value[index + 1] || tabs.value[index - 1]
          if (nextTab) {
            store.dispatch('setActiveIndexAction', nextTab.path)
            routers.push({path: nextTab.path})
          }
        }
      })
      store.dispatch('delTabsAction', targetName)
    }

    function clickTab(tab){
      routers.push({path: tab.props.name})
    }
    return {
      state,
      removeTab,
      clickTab,
      activeIndex,
      tabs
    }
  }
}
</script>

<style scoped lang="scss">

.el-tabs__nav .el-tabs__item:nth-child(1) span{
   display: none;
}

.el-tabs{
  height: calc(100vh - 50px) !important;
}

/deep/  .el-tabs__header{
  background-color: #F2F6FC;
  height: 30px;
  width: calc(100vw - 200px);
  padding-top: 5px;
  padding-bottom: 5px;
  border-bottom: none!important;
}

/deep/  .el-tabs__nav{
  border: none!important;
  margin-left: 10px;
}

/deep/  .el-tabs__item{
  height: 30px;
  line-height: 30px;
  font-size: 12px;
  border-style: none!important;
}

/deep/  .el-tabs__item.is-active{
  color: #ffffff;
  background-color: #67C23A;
}

/deep/  .el-tabs__content{
  padding-left: 20px;
  padding-right: 20px;
}

</style>