<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构的内容 -->
      <el-card class="tree-card">
        <!-- 头部 属性绑定要用冒号-->
        <tree-tools :tree-node="company" :is-root="true" @addDepts="addDepts" />
        <!-- 放置树组件 -->
        <el-row>
          <el-tree :data="departs" :props="defaultProps" @node-click="handleNodeClick">
            <!-- 传入内容，有多少节点，循环多少次 -->
            <!-- 作用域插槽 slot-scope='obj' 接收传给插槽的数据 data表示数据-->
            <tree-tools slot-scope="{data}" :tree-node="data" @addDepts="addDepts" @editDepts="editDepts" @delDepts="getDepartment" />
          </el-tree>
        </el-row>
      </el-card>
    </div>
    <!-- 弹出对话框 通过tree-node属性把当前节点传给子组件-->
    <add-depts ref="editDepts" :show-dialog.sync="showDialog" :tree-node="node" @addDepts="getDepartment" />
  </div>
</template>

<script>
import TreeTools from './components/tree-tools.vue'
import AddDepts from './components/add-department.vue'
import { getDepartment } from '@/api/department'
import { transListToTreeData } from '@/utils'
export default {
  components: {
    TreeTools,
    AddDepts
  },
  data() {
    return {
      company: { name: '', manager: '' }, // 头部的数据
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      departs: [],
      showDialog: false, // 控制对话框显示
      node: null, // 当前节点
      loading: false
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
      // 获取整体部门信息时加进度条
      this.loading = true
      const result = await getDepartment()
      this.company = { name: result.companyName, manager: '负责人', id: '' }
      this.departs = transListToTreeData(result.depts, '')
      this.loading = false
      // console.log(result)
    },
    // 监听添加子部门事件
    addDepts(node) {
      this.showDialog = true
      this.node = node // 设置当前节点
    },
    // 监听编辑部门事件
    editDepts(node) {
      this.showDialog = true
      this.node = node
      this.$refs.editDepts.getDepartDetail(node.id) // 调用子组件实例的方法
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
