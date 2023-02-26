<template>
  <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
    <el-form ref="roleForm" :rules="rules" :model="roleForm" label-width="120px">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="roleForm.name" />
      </el-form-item>
      <el-form-item label="角色描述">
        <el-input v-model="roleForm.description" />
      </el-form-item>
    </el-form>
    <!-- 底部 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" @click="btnCancel">取消</el-button>
        <el-button size="small" type="primary" @click="btnOK">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
import { getRoleDetail, updateRole, addRole } from '@/api/setting'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    roleId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      roleForm: {},
      showTitle: '编辑部门',
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      }}
  },
  methods: {
    // 获取角色详情
    async getRoleDetail(id) {
      const result = await getRoleDetail(id)
      this.roleForm = result
    },
    // 更新角色详情
    async btnOK() {
      try {
        await this.$refs.roleForm.validate()
        // 校验通过，判断是新增功能还是编辑功能
        if (this.roleForm.id) {
          // id存在，是编辑功能
          await updateRole(this.roleForm)
          this.$message.success('修改角色成功！')
        } else {
          await addRole(this.roleForm)
          this.$message.success('新增角色成功！')
        }
        this.$emit('addRole')
        this.$emit('update:showDialog', false)
      } catch (error) {
        this.$message.error(error)
      }
    },
    // 取消键操作
    btnCancel() {
      this.roleForm = {
        name: '',
        description: ''
      }
      this.$refs.roleForm.resetFields()
      this.$emit('update:showDialog', false)
    }
  }
}
</script>
<style scoped>
.el-input{
	width:400px
}
</style>
