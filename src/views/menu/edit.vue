<template>
  <el-dialog v-model="editVisible" title="编辑菜单" @opened="openedDialog" destroy-on-close>
    <el-form ref="formRef" :model="menuObj" :rules="menuRule" label-width="80">
      <el-row :gutter="100">
        <el-col :span="12">
          <el-form-item label="上级目录" size="mini" prop="parentId">
            <treeselect
                v-model="menuObj.parentId"
                :options="state.options"
                :normalizer="normalizer"
                :clearable="false"
                class="treeselect-main "></treeselect>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="菜单排序" size="mini" prop="sort">
            <el-input type="text" v-model="menuObj.sort" size="mini"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="菜单类型" size="mini" prop="type">
        <el-radio-group v-model="menuObj.type" style="display: flex;" @change="chargeType">
          <el-radio label="1">菜单</el-radio>
          <el-radio label="2">页面</el-radio>
          <el-radio label="3">按钮</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="菜单名称" size="mini" prop="name">
        <el-input type="text" v-model="menuObj.name" size="mini"></el-input>
      </el-form-item>
      <el-form-item v-if="state.isPage" label="菜单路由" size="mini" prop="path">
        <el-input type="text" v-model="menuObj.path" size="mini"></el-input>
      </el-form-item>
      <el-form-item v-if="state.isPage" label="菜单组件" size="mini" prop="component">
        <el-input type="text" v-model="menuObj.component" size="mini"></el-input>
      </el-form-item>
    </el-form>
    <el-footer>
      <el-button size="small" @click="closedDialog">取消</el-button>
      <el-button size="small" type="primary" @click="submit">确认</el-button>
    </el-footer>
  </el-dialog>
</template>

<script>
import Treeselect from 'vue3-treeselect'
import 'vue3-treeselect/dist/vue3-treeselect.css'
import {inject, nextTick, onMounted, reactive, ref} from "vue";
import {editMenu, getSelectTree} from "../../api/menu/menu";
import {errorMsg, successMsg} from "../../utils/layerMsg";

export default {
  name: "Edit",
  components: { Treeselect },
  setup(props, context){
    const state = reactive({
      isPage: false,
      options: null,
    })

    const menuRule = {
      parentId: [
        {required: true, message: '上级目录不能为空', trigger: 'blue'},
      ],
      sort: [
        {required: true, message: '排序不能为空', trigger: 'blue'},
      ],
      type: [
        {required: true, message: '类型不能为空', trigger: 'blue'},
      ],
      name: [
        {required: true, message: '菜单名称不能为空', trigger: 'blue'},
      ],
      path: [
        {required: true, message: '菜单路由不能为空', trigger: 'blue'},
      ],
      component: [
        {required: true, message: '菜单组件不能为空', trigger: 'blue'},
      ],
    }

    const editVisible = inject('editVisible', false)
    const parentId = inject('parentId', null)
    const menuObj = inject('menuObj')

    const openedDialog = () => {
      state.isPage = false
      state.isPage = menuObj.type !== '1'
      getParentTree(parentId)
    }

    const chargeType = (val) => {
      state.isPage = val !== '1';
    }

    const closedDialog = () => {
      editVisible.value = false
    }

    const formRef = ref()
    const submit = () => {
      formRef.value.validate((valid) => {
        if (valid){
          editMenu(menuObj).then(res => {
            if (res.success){
              successMsg(res.data)
            } else {
              errorMsg(res.msg)
            }
          })
        }
      })
    }

    const normalizer = (node) => {
      return {
        id: node.id,
        label: node.name,
        children: node.children,
      }
    }

    //  获取菜单数据
    function getParentTree(parentId) {
      getSelectTree().then(res => {
        if (res.success){
          state.options = res.data
        } else {
          errorMsg(res.msg)
        }
      })
    }

    //  form表单渲染
    nextTick(() => {
      const form = window.layui.form
      //  渲染radio
      form.render('radio')
      //  监听radio
      form.on('radio(type)', function (obj) {
        if (obj.value === '2' || obj.value === '3'){
          state.isPage = true
        } else {
          state.isPage = false
        }
      })
      //  提交
      form.on('submit(form)', function (data) {
        console.info('aaa')
        console.info(data.field)

        return false
      })
    })

    return {
      state,
      menuRule,
      editVisible,
      parentId,
      menuObj,
      normalizer,
      openedDialog,
      chargeType,
      closedDialog,
      formRef,
      submit
    }
  }
}
</script>

<style scoped lang="scss">
 :deep(.treeselect-main){
  line-height: 28px!important;
  .vue-treeselect__placeholder {
    line-height: 28px!important;
  }
  .vue-treeselect__control {
    height: 28px!important;
    font-size: 12px;
  }
  .vue-treeselect__single-value{
    line-height: 30px!important;
    color: #606266;
    padding-left: 8px;
  }
}

</style>