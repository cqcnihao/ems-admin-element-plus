<template>
  <el-dialog v-model="dialogVisible" title="编辑用户" @opened="onOpen">
    <el-form :model="userForm" ref="formRef" :rules="ruleForm" label-position="right" label-width="80px">
      <el-form-item size="mini" label="用户名" prop="username">
        <el-input v-model="userForm.username" class="dialog-input" autocomplete="false" clearable size="mini" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item size="mini" label="昵称" prop="nickName">
        <el-input v-model="userForm.nickName" class="dialog-input" autocomplete="false" clearable size="mini" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item size="mini" label="角色" prop="roles">
        <el-select v-model="userForm.roles" class="dialog-input" multiple size="mini" placeholder="请选择角色">
          <el-option v-for="(item, index) in state.options" :key="index" :label="item.roleName" :value="item.id">

          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="mini" @click="closeDialog">取消</el-button>
        <el-button type="primary" size="mini" @click="submit">确认</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import {inject, nextTick, onMounted, reactive, ref, toRefs, unref, watch} from "vue";
import {getRoleSelect, getRoleTable} from "../../api/role/role";
import {errorMsg, successMsg} from "../../utils/layerMsg";
import {editUser} from "../../api/user/user";

export default {
  name: "edit",
  emits: ['get-user-table'],//  刷新父页面的列表
  props: {},
  setup(props, context){
    const state = reactive({
      options: [],
      selected: null,
      roles: [],
    })

    //  form表单的验证规则
    const ruleForm = {
      username: [
        {required: true, message: '请输入用户名', trigger: 'blur'}
      ],
      nickName: [
        {required: true, message: '请输入昵称', trigger: 'blur'}
      ],
      roles: [
        {required: true, message: '请选择角色', trigger: 'blur'}
      ]
    }

    //  定义form表单
    const formRef = ref()

    //  接收父页面传过来的dialogVisible的值
    let dialogVisible = inject('dialogVisible', false)

    //  监听父页面传过来的用户对象userObj
    const userForm = inject('userObj')

    //  获取所有的角色
    function getAllRoles(){
      getRoleTable().then(res => {
        if (res.success){
          state.options = res.data
        } else {
          errorMsg(res.msg)
        }
      })
    }

    //  打开后调用查询角色的方法
    function onOpen(){
      getAllRoles()
    }

    //  关闭当前dialog
    function closeDialog(){
      dialogVisible.value = false
    }
    //  提交
    function submit(){
      formRef.value.validate((valid) => {
        if (valid){
          editUser(userForm).then(res => {
            if (res.success){
              closeDialog()
              context.emit('get-user-table')
              successMsg(res.data)
            } else {
              errorMsg(res.msg)
            }
          })
        }
      })
    }

    return {
      state,
      formRef,
      ruleForm,
      dialogVisible,
      userForm,
      onOpen,
      submit,
      closeDialog
    }
  }
}
</script>

<style scoped>

</style>