<template>
  <el-row type="flex" justify="space-between" align="middle" style="height:40px;width: 100%;">
    <!-- 左侧内容 -->
    <el-col>
      <span>{{ treeNode.name }}</span>
    </el-col>
    <!-- 右侧内容 -->
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <!-- 下拉菜单 -->
          <el-dropdown @command="operDepts">
            <span>
              操作<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add" :disabled="!checkPermission('add-department')">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="delete">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>
<script>
import { delDepartments } from '@/api/department'

export default {
  // 对外开放属性
  props: {
    treeNode: {
      type: Object, // 要求传入对象
      required: true
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  // 方法
  methods: {
    operDepts(type) {
      switch (type) {
        case 'delete':
          this.$confirm('确定要删除吗', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              return delDepartments(this.treeNode.id)
            }).then(() => {
              // 需要通知父组件去重新获取数据
              this.$emit('delDepts') // 触发自定义事件
              this.$message.success('删除成功！')
            })
          break
          // 添加部门
        case 'add':
          this.$emit('addDepts', this.treeNode) // 触发自定义事件，传递参数，this.treeNode是当前点击的部门
          break
          // 编辑部门
        case 'edit':
          this.$emit('editDepts', this.treeNode)
          break
        default:
          break
      }
    }
  }
}
</script>
