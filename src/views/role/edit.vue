<template>
  <el-dialog v-model="editVisible" title="编辑角色" @opened="openedDialog" destroy-on-close>
    <el-form ref="formRef" :model="roleObj" :rules="roleRule" label-width="80">
      <el-form-item size="mini" label="角色名称" prop="roleName">
        <el-input type="text" class="dialog-input" v-model="roleObj.roleName" size="mini"></el-input>
      </el-form-item>
      <el-form-item size="mini" label="角色代码" prop="roleCode">
        <el-input type="text" class="dialog-input" v-model="roleObj.roleCode" size="mini" :disabled="roleObj.roleCode === 'ROLE_ADMIN'"></el-input>
      </el-form-item>
      <el-form-item size="mini" label="角色描述" prop="description">
        <el-input type="textarea" class="dialog-input" v-model="roleObj.description" size="mini"></el-input>
      </el-form-item>
    </el-form>
    <el-footer>
      <el-button size="small" @click="closedDialog">取消</el-button>
      <el-button size="small" type="primary" @click="submit">确认</el-button>
    </el-footer>
  </el-dialog>
</template>

<script>
import {inject, nextTick, reactive, ref} from "vue";
import {editRole} from "../../api/role/role";
import {errorMsg, successMsg} from "../../utils/layerMsg";

export default {
  name: "edit",
  emits: ['get-role-list'],
  setup(props, context){
    const state = reactive({

    })

    const roleRule = {
      roleName: [
        {required: true, message: '角色名称不能为空', trigger: 'blur'}
      ],
      roleCode: [
        {required: true, message: '角色代码不能为空', trigger: 'blur'}
      ],
      description: [
        {required: true, message: '角色描述不能为空', trigger: 'blur'}
      ],
    }

    const editVisible = inject('editVisible', false)
    const roleObj = inject('roleObj')

    const openedDialog = () => {

    }

    const closedDialog = () => {
      editVisible.value = false
    }

    const formRef = ref()

    const submit = () => {
      formRef.value.validate((valid) => {
        if (valid){
          editRole(roleObj).then(res => {
            if (res.success){
              context.emit('get-role-list')
              successMsg(res.data)
              closedDialog()
            }else {
              errorMsg(res.msg)
            }
          })
        }
      })
    }

    return {
      state,
      roleRule,
      editVisible,
      roleObj,
      openedDialog,
      closedDialog,
      formRef,
      submit
    }
  }
}
</script>

<style scoped>

</style>