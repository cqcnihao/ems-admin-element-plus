<template>
  <el-pagination
      v-model:currentPage="state.currentPage"
      v-model:pageSize="state.pageSize"
      :page-sizes="[10, 20, 50, 100, 500, 1000]"
      :pager-count="10"
      :total="total"
      layout="prev, pager, next, total, sizes"
  >
  </el-pagination>
</template>

<script>
import {inject, reactive, ref, watch} from "vue";

export default {
  name: "Pagination",
  props: ['total'],
  setup(props, context){
    const state = reactive({
      currentPage: 1,
      pageSize: 10,
    })
    return {
      state
    }
  }
}
</script>

<style scoped>

</style>