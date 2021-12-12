<template>
  <div class="login-div" style="margin: 0;">
    <el-form class="login-form" ref="loginFormRef" :model="loginForm" :rules="rules">
      <h1 class="login-head">登    录</h1>
      <el-form-item prop="username">
        <el-input type="text" v-model="loginForm.username" clearable placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="loginForm.password" clearable placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="login-input" type="primary" style="opacity: 1" @click="submit()">登    录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {login} from "./api/login/login";
import {errorMsg} from "./utils/layerMsg";
import routers from "./router/routers";
import store from "./store";
import {reactive, ref} from "vue";
export default {
  name: "Login",
  setup(){
    const loginForm = reactive({
      username: '',
      password: ''
    })

    const rules = {
      username: [
        {required: true, message: '用户名不能为空', trigger: 'blur'}
      ],
      password: [
        {required: true, message: '密码不能为空', trigger: 'blur'}
      ]
    }

    const loginFormRef = ref(null)

    //  登录方法
    function submit(){
      loginFormRef.value.validate((valid) => {
        if (valid){
          login(loginForm).then(res => {
            if (res.success){
              store.dispatch('tokenAction', res.data.token)
              store.dispatch('userAction', res.data.userDto)
              routers.push({path: '/Layout'})
            } else {
              errorMsg(res.msg)
            }
          })
        }
      })
    }

    return {
      loginForm,
      rules,
      loginFormRef,
      submit
    }
  }
}
</script>

<style scoped lang="scss">
.el-form-item{
  padding-left: 50px;
  padding-right: 50px;
}
</style>