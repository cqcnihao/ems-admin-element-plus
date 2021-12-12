<template>
<div class="body">
  <el-row class="search-row">
    <el-col :span="6">
      <label style="width: 80px;">用户名：</label>
      <el-input type="text" class="search-input" v-model="state.username" placeholder="请输入用户名" size="small" clearable></el-input>
    </el-col>
    <el-col :span="6">
      <label style="width: 80px;">描述：</label>
      <el-input type="text" class="search-input" v-model="state.description" placeholder="请输入描述" size="small" clearable></el-input>
    </el-col>
    <el-col :span="6" style="display: flex;align-items: center;">
      <label style="width: 80px;">类型：</label>
      <el-select v-model="state.logType" clearable size="small" style="width: 190px;">
        <el-option value="" label="全部"></el-option>
        <el-option value="1" label="正常"></el-option>
        <el-option value="2" label="异常"></el-option>
      </el-select>
      <el-button type="primary" size="small" @click="getLogs" style="margin-left: 20px;">查询</el-button>
    </el-col>
  </el-row>
  <el-table id="table" :data="state.tableData" border size="small" :height="state.tableHeight" :max-height="state.tableHeight">
    <el-table-column type="index" :index="getIndex" label="序号"></el-table-column>
    <el-table-column prop="username" label="用户名" show-overflow-tooltip></el-table-column>
    <el-table-column prop="description" label="说明" show-overflow-tooltip></el-table-column>
    <el-table-column prop="logType" label="描述">
      <template #default="scope">
        <span>{{scope.row.logType === '1' ? '正常' : '异常'}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="method" label="调用方法" show-overflow-tooltip></el-table-column>
    <el-table-column prop="params" label="参数" show-overflow-tooltip></el-table-column>
    <el-table-column prop="ip" label="IP"></el-table-column>
    <el-table-column prop="time" label="耗时(ms)"></el-table-column>
    <el-table-column prop="exceptionDetail" label="错误信息" show-overflow-tooltip></el-table-column>
    <el-table-column prop="createTime" label="操作时间" show-overflow-tooltip></el-table-column>
  </el-table>
  <Pagination v-model:currentPage="state.curr" v-model:pageSize="state.limit" :total="state.total" style="float: left;"></Pagination>
</div>
</template>

<script>
import {onMounted, reactive, ref, watch} from "vue";
import {errorMsg} from "../../utils/layerMsg";
import {queryLogs} from "../../api/log/log";
import Pagination from "../../components/Pagination";

export default {
  name: "index",
  components: { Pagination },
  setup(props, context){
    const state = reactive({
      total: 0,
      curr: 1,
      limit: 10,
      username: '',
      description: '',
      logType: "",
      tableData: null,
      tableHeight: window.innerHeight - 220,
    })

    onMounted(() => {
      getLogs()
    })

    //  监听页码改变
    watch(
        () => state.curr,
        (newValue, prevValue) => {
          getLogs()
        }
    )

    //  监听每页条数改变
    watch(
        () => state.limit,
        (newValue, prevValue) => {
          getLogs()
        }
    )

    //  序号
    const getIndex = (index) => {
      return (state.curr - 1) * state.limit + index + 1
    }

    //  查询日志记录
    function getLogs(){
      const logParams = {
          current: state.curr,
          size: state.limit,
          username: state.username,
          description: state.description,
          logType: state.logType
      }
      queryLogs(logParams).then(res => {
        if (res.success){
          state.tableData = res.data.records
          state.total = res.data.total
        } else {
          errorMsg(res.msg)
        }
      })
    }

    return {
      state,
      getLogs,
      getIndex,
    }
  }
}
</script>

<style scoped lang="scss">
:deep(.el-input__inner){
  width: 300px;
}
</style>