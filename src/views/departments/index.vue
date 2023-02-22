<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构的内容 -->
      <el-card class="tree-card">
        <!-- 头部 属性绑定要用冒号-->
        <tree-tools :tree-node="company" :is-root="true" />
        <!-- 放置树组件 -->
        <el-row>
          <el-tree :data="departs" :props="defaultProps" @node-click="handleNodeClick">
            <!-- 传入内容，有多少节点，循环多少次 -->
            <!-- 作用域插槽 slot-scope='obj' 接收传给插槽的数据 data表示数据-->
            <tree-tools slot-scope="{data}" :tree-node="data" />
          </el-tree>
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script>
import TreeTools from './components/tree-tools.vue'
import { getDepartment } from '@/api/department'
import { transListToTreeData } from '@/utils'
export default {
  components: {
    TreeTools
  },
  data() {
    return {
      company: { name: '', manager: '' }, // 头部的数据
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      departs: []
    }
  },
  created() {
    this.getDepartment()
  },
  methods: {
    handleNodeClick(data) {
      console.log(data)
    },
    async getDepartment() {
      const result = await getDepartment()
      this.company = { name: result.companyName, manager: '负责人' }
      this.departs = transListToTreeData(result.depts, '')
      console.log(result)
    }
  }
}

</script>

<style scoped>
.tree-card {
  padding: 30px  140px;
  font-size:14px;
}
</style>
