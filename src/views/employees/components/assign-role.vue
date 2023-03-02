<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" @close="btnCancel">
    <el-checkbox-group v-model="checkList">
      <!-- label存储id,内容用差值表达式表达 -->
      <el-checkbox v-for="(item) in roleList" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <el-row slot="footer" type="flex" justify="center">
      <el-button size="small" type="primary" @click="btnOK">确定</el-button>
      <el-button size="small" @click="btnCancel">取消</el-button>
    </el-row>
  </el-dialog>
</template>
<script>
import { getRoleList } from '@/api/setting'
import { getUserDetail } from '@/api/user'
import { assignRoles } from '@/api/employees'
export default {
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    userId: {
      type: String,
      default: null,
      required: true
    }
  },
  data() {
    return {
      roleList: [],
      checkList: [] // 选中的复选框
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    // 获取所有角色
    async getRoleList() {
      const { rows } = await getRoleList()
      this.roleList = rows
    },
    // 获取当前用户的角色
    async getUserDetail(id) {
      const result = await getUserDetail(id)
      this.checkList = result.roleIds // checkList要和label对应
      // props是异步传值，需要在父组件调用，因为相当于是初始化就要调用
    },
    async btnOK() {
      await assignRoles({ id: this.userId, roleIds: this.checkList })
      // 关闭窗体
      this.$emit('update:showRoleDialog', false)
    },
    btnCancel() {
      this.checkList = [] // 重置，下一次需要重新获取
      this.$emit('update:showRoleDialog', false)
    }
  }
}
</script>
