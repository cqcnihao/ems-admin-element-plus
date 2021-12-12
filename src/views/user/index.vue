<template>
<div class="body">
  <el-row class="search-row">
    <el-col :span="12" style="display: flex;">
      <el-input type="text" class="search-input" v-model="state.blurry" placeholder="请输入用户名/昵称" size="small" clearable></el-input>
      <el-button type="primary" size="small" @click="getUserTable">查询</el-button>
    </el-col>
    <el-col :span="12" style="text-align: right;">
      <el-button type="primary" size="small" @click="editUser">新增</el-button>
    </el-col>
  </el-row>
  <el-table :data="state.tableData" border size="small" :height="state.tableHeight" :max-height="state.tableHeight">
    <el-table-column type="index" title="序号"></el-table-column>
    <el-table-column label="用户名" prop="username"></el-table-column>
    <el-table-column label="昵称" prop="nickName"></el-table-column>
    <el-table-column label="状态" prop="enabled">
      <template #default="scope">
        <span>{{scope.row.enabled ? '启用' : '停用'}}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作" prop="option" header-align="center" width="240" align="center">
      <template #default="scope">
        <el-button v-if="!scope.row.roles.includes('ROLE_ADMIN')" type="warning" size="mini" @click="changeStatus(scope.row.id, !scope.row.enabled)">{{scope.row.enabled ? '停用' : '启用'}}</el-button>
        <el-button v-if="!scope.row.roles.includes('ROLE_ADMIN')" type="primary" size="mini" @click="editUser(scope.row)">编辑</el-button>
        <el-button v-if="!scope.row.roles.includes('ROLE_ADMIN')" type="danger" size="mini" @click="delUser(scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</div>
<Edit @get-user-table="getUserTable"></Edit>
<Pagination v-model:currentPage="state.curr" v-model:pageSize="state.limit" :total="state.total" style="float: left;"></Pagination>
</template>
<script>
import {onMounted, provide, reactive, ref} from "vue";
import {errorMsg, infoMsg, successMsg} from "../../utils/layerMsg";
import {chargeUserStatus, delUserById, getUserList} from "../../api/user/user";
import {ElMessageBox} from "element-plus";
import Edit from "./edit";
import Pagination from "../../components/Pagination";

export default {
  name: "Index",
  components: {Edit, Pagination},
  setup(props, context){
    const state = reactive({
      curr: 1,
      limit: 10,
      total: 0,
      blurry: '',
      tableData: null,
      tableHeight: window.innerHeight - 220,
    })

    //  初始化用户数据
    const initUser = () => {
      return {
        id: null,
        username: null,
        nickName: null,
        roles: null
      }
    }

    //  将初始化的用户对象转成响应对象
    const dialogVisible = ref(false)
    const userObj = reactive(initUser())

    //  设置两个发放对象，用于子页面接收
    provide('dialogVisible', dialogVisible)
    provide('userObj', userObj)

    onMounted(() => {
      getUserTable()
    })

    //  获取用户数据
    function getUserTable() {
      getUserList().then(res => {
        if (res.success){
          state.tableData = res.data
        } else {
          errorMsg(res.msg)
        }
      })
    }

    //  编辑用户
    function editUser(obj){
      dialogVisible.value = true
      //  修改
      if (obj && obj.id){
        userObj.id = obj.id
        userObj.username = obj.username
        userObj.nickName = obj.nickName
        userObj.roles = obj.roles
      //  新增
      } else {
        //  重置数据
        Object.assign(userObj, initUser())
      }
    }

    //  修改用户状态
    function changeStatus(id, enabled){
      chargeUserStatus({id: id, enabled: enabled}).then(res => {
        if (res.success){
          successMsg(res.data)
          getUserTable()
        } else {
          errorMsg(res.msg)
        }
      })
    }

    //  删除用户
    function delUser(id){
      ElMessageBox.confirm('确认删除用户？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delUserById({id: id}).then(res => {
          if (res.success){
            successMsg(res.data)
            getUserTable()
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
      editUser,
      getUserTable,
      changeStatus,
      delUser,
    }
  }
}
</script>

<style scoped>

</style>