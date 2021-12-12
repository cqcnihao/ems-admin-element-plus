<template>
  <div class="body">
    <el-row class="search-row">
      <el-col :span="12" style="display: flex;">
        <el-input type="text" class="search-input" v-model="state.blurry" placeholder="请输入用户名/昵称" size="small" clearable></el-input>
        <el-button type="primary" size="small" @click="getRoleList">查询</el-button>
      </el-col>
      <el-col :span="12" style="text-align: right;">
        <el-button type="primary" size="small" @click="editRole">新增</el-button>
      </el-col>
    </el-row>
    <el-table :data="state.tableData" border size="small" :height="state.tableHeight" :max-height="state.tableHeight">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleCode" label="角色代码"></el-table-column>
      <el-table-column prop="description" label="描述"></el-table-column>
      <el-table-column prop="option" label="操作" align="center" width="240">
        <template #default="scope">
          <el-button type="success" size="mini" @click="authorize(scope.row.id, scope.row.roleCode)">授权</el-button>
          <el-button type="primary" size="mini" @click="editRole(scope.row)">修改</el-button>
          <el-button type="danger" size="mini" @click="delRole(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <Authorize></Authorize>
  <Edit @get-role-list="getRoleList"></Edit>
  <Pagination v-model:currentPage="state.curr" v-model:pageSize="state.limit" :total="state.total" style="float: left;"></Pagination>
</template>

<script>
import {onMounted, provide, reactive, ref} from "vue";
import {getRoleTable} from "@/api/role/role";
import {errorMsg} from "@/utils/layerMsg";
import {infoMsg, successMsg, waringMsg} from "../../utils/layerMsg";
import {deleteRole} from "../../api/role/role";
import {ElMessageBox} from "element-plus";
import {delUserById} from "../../api/user/user";
import Authorize from './authorize'
import Edit from './edit'
import Pagination from "../../components/Pagination";

export default {
  name: "index",
  components: {Authorize, Edit, Pagination},
  setup(props, context){
    const state = reactive({
      blurry: '',
      curr: 1,
      limit: 10,
      total: 0,
      tableData: null,
      tableHeight: window.innerHeight - 220,
    })

    onMounted(() => {
      getRoleList()
    })


    //  初始化角色数据
    const initRole = () => {
      return {
        id: null,
        roleName: null,
        roleCode: null,
        description: null
      }
    }
    //  定义编辑响应变量editVisible与roleObj
    const editVisible = ref(false)
    const roleObj= reactive(initRole())
    //  将变量editVisible与roleObj变化的值传递给Edit子组件
    provide('editVisible', editVisible)
    provide('roleObj', roleObj)

    //  定义授权响应变量authorizeVisible与authorizeId
    const authorizeVisible = ref(false)
    const authorizeId = ref(null)
    //  将变量authorizeVisible和authorizeId的变化的值传给子组件
    provide('authorizeVisible', authorizeVisible)
    provide('authorizeId', authorizeId)

    //  获取角色数据
    function getRoleList(){
      getRoleTable({blurry: state.blurry}).then(res => {
        if (res.success){
          state.tableData = res.data
        } else {
          errorMsg(res.msg)
        }
      })
    }

    //  编辑角色
    function editRole(data){
      editVisible.value = true
      if (data && data.id){
        roleObj.id = data.id
        roleObj.roleName = data.roleName
        roleObj.roleCode = data.roleCode
        roleObj.description = data.description
      } else {
        //  重置数据
        Object.assign(roleObj, initRole())
      }
    }

    //  删除角色
    function delRole(id){
      ElMessageBox.confirm('确认删除角色？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRole({id: id}).then(res => {
          if (res.success){
            successMsg(res.data)
            getRoleList()
          } else {
            errorMsg(res.msg)
          }
        })
      }).catch(() => {
        infoMsg('已取消')
      })
    }

    //  角色授权
    function authorize(id, roleCode){
      if (roleCode === 'ROLE_ADMIN'){
        waringMsg('超级管理员拥有所有菜单权限，无需授权')
        return false
      }
      authorizeVisible.value = true
      authorizeId.value = id
    }

    return{
      state,
      getRoleList,
      editRole,
      authorize,
      delRole
    }
  }
}
</script>

<style scoped>

</style>