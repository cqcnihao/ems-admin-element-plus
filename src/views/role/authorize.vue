<template>
  <el-dialog v-model="authorizeVisible" title="角色授权" @opened="openedDialog" destroy-on-close>
    <el-tree
        ref="treeRef"
        :data="state.treeData"
        show-checkbox
        default-expand-all
        node-key="id"
        :default-checked-keys="state.checkedKeys"
        :props="state.defaultProps">
    </el-tree>
    <el-footer>
      <el-button size="small" @click="closeDialog">取消</el-button>
      <el-button type="primary" size="small" @click="authorize">授权</el-button>
    </el-footer>
  </el-dialog>
</template>

<script>
import {inject, nextTick, reactive, ref} from "vue";
import {getRoleMenuTree} from "@/api/menu/menu";
import {errorMsg, successMsg} from "@/utils/layerMsg";
import {authorizeRole} from "../../api/menu/menu";
export default {
  name: "authorize",
  setup(props, context){
    const state = reactive({
      menuIds: [],
      treeData: null,
      selectedMenus: [],
      selectTmp: [],
      checkedKeys: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
    })

    //  接收父组件传过来的authorizeVisible的值
    const authorizeVisible = inject('authorizeVisible', false)
    const authorizeId = inject('authorizeId', null)

    //  打开dialog之后
    const openedDialog = () => {
      state.selectTmp = []
      state.selectedMenus = []
      state.checkedKeys = []
      getMenuTree(authorizeId.value)
    }

    //  获取菜单树
    function getMenuTree(roleId) {
      getRoleMenuTree({roleId: roleId}).then(res => {
        if (res.success){
          state.treeData = res.data
          //  查询勾选菜单ID
          getSelectedIds(res.data)
        } else {
          errorMsg(res.msg)
        }
      })
    }

    //  获取已选中的菜单id
    function getSelectedIds(treeData){
      treeData.forEach((item) => {
        //  如果当前存在已选中的，则直接添加
        if (item.checked){
          state.selectedMenus.push(item)
        }
        //  如果children不为空，递归查询子菜单是否已被勾选
        if (item.children && item.children.length > 0){
          state.selectedMenus.push.apply(state.selectedMenus, getChildren(item.children))
        }
      })

      //  如果存在已勾选菜单，则将ID取出来添加到默认勾选列表中
      if (state.selectedMenus.length > 0){
        state.selectedMenus.forEach((menu) => {
          state.checkedKeys.push(menu.id)
        })
      }
    }

    //  获取下级菜单的递归方法
    function getChildren(children){
      children.forEach((child) => {
        //  如果勾选，就保存在临时数组中
        if (child.checked){
          state.selectTmp.push(child)
        }
        if (child.children && child.children.length > 0){
          getChildren(child.children)
        }
      })
      return state.selectTmp
    }

    const treeRef = ref()

    //  授权
    const authorize = () => {
      //  获取已选中的节点id
      const checkedData = treeRef.value.getCheckedKeys(true)
      authorizeRole({roleId: authorizeId.value, menuIds: checkedData}).then(res => {
        if (res.success){
          successMsg(res.data)
          closeDialog()
        } else {
          errorMsg(res.msg)
        }
      })
    }
    //  关闭当前dialog
    const closeDialog = () => {
      authorizeVisible.value = false
    }

    return {
      state,
      authorizeVisible,
      openedDialog,
      closeDialog,
      treeRef,
      authorize,
    }
  }
}
</script>

<style scoped>
.el-tree{
  height: 300px;
}
</style>