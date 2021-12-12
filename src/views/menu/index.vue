<template>
  <div class="body">
    <el-row class="search-row">
      <el-col :span="12" style="display: flex;">
        <el-input type="text" class="search-input" v-model="state.blurry" placeholder="请输入用户名/昵称" size="small" clearable></el-input>
        <el-button type="primary" size="small" @click="getTableTree">查询</el-button>
      </el-col>
      <el-col :span="12" style="text-align: right;">
        <el-button type="primary" size="small" @click="editMenu">新增</el-button>
      </el-col>
    </el-row>
    <el-table :data="state.tableData" size="small" border row-key="id" :height="state.tableHeight" :max-height="state.tableHeight">
      <el-table-column label="菜单名称" prop="name"></el-table-column>
      <el-table-column label="菜单路由" prop="path"></el-table-column>
      <el-table-column label="菜单组件" prop="component"></el-table-column>
      <el-table-column label="菜单类型" prop="type">
        <template #default="scope">
          <span v-if="scope.row.type === '1'">菜单</span>
          <span v-else-if="scope.row.type === '2'">页面</span>
          <span v-else-if="scope.row.type === '3'">按钮</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="sort"></el-table-column>
      <el-table-column label="操作" prop="option" align="center" width="160">
        <template #default="scope">
          <el-button type="primary" size="mini" @click="editMenu(scope.row)">修改</el-button>
          <el-button type="danger" size="mini" @click="delMenu(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <Edit></Edit>
</template>

<script>
import {getMenuTable} from "@/api/menu/menu";
import {errorMsg} from "@/utils/layerMsg";
import {onMounted, provide, reactive, ref} from "vue";
import {infoMsg, successMsg} from "@/utils/layerMsg";
import {deleteMenu} from "@/api/menu/menu";
import Edit from './edit'
import {ElMessageBox} from "element-plus";
import {deleteRole} from "../../api/role/role";

export default {
  name: "Index",
  components: { Edit },
  setup(props, context){
    const state = reactive({
      blurry: '',
      parentId: '',
      tableData: null,
      tableHeight: window.innerHeight - 220,
    })

    onMounted(() => {
      getTableTree()
    })

    //  初始化角色数据
    const initMenu = () => {
      return {
        id: null,
        parentId: 0,
        name: null,
        path: null,
        component: null,
        type: null,
        sort: null
      }
    }

    const editVisible = ref(false)
    const parentId = ref(null)
    const menuObj = reactive(initMenu())
    provide('editVisible', editVisible)
    provide('parentId', parentId)
    provide('menuObj', menuObj)

    function getTableTree(){
      getMenuTable({blurry: state.blurry}).then(res => {
        if (res.success){
          state.tableData = res.data
        } else {
          errorMsg(res.msg)
        }
      })
    }

    //  编辑菜单
    function editMenu(obj){
      editVisible.value = true
      //  编辑
      if (obj && obj.id){
        menuObj.parentId = obj.parentId
        menuObj.name = obj.name
        menuObj.path = obj.path
        menuObj.type = obj.type
        menuObj.component = obj.component
        menuObj.sort = obj.sort
      } else {
        //  新增
        Object.assign(menuObj, initMenu())
      }
    }

    //  删除菜单
    function delMenu(id){
      ElMessageBox.confirm('确认删除菜单？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMenu({id: id}).then(res => {
          if (res.success){
            successMsg(res.data)
            getTableTree()
          } else {
            errorMsg(res.msg)
          }
        })
      }).catch(() => {
        infoMsg('已取消')
      })
    }

    return {
      state,
      editVisible,
      getTableTree,
      editMenu,
      delMenu
    }
  }
}
</script>

<style scoped>

</style>