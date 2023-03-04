<template>
  <el-dialog title="分配权限" :visible="showPermDialog" @close="btnCancel">
    <el-tree
      ref="permTree"
      :data="permData"
      show-checkbox
      node-key="id"
      :check-strictly="true"
      :default-expand-all="true"
      :default-checked-keys="checkedList"
      :props="defaultProps"
    />
    <el-row slot="footer" type="flex" justify="center">
      <el-button size="small" type="primary" @click="btnOK">确定</el-button>
      <el-button size="small" @click="btnCancel">取消</el-button>
    </el-row>
  </el-dialog>
</template>
<script>
import { assignPerm, getRoleDetail } from '@/api/setting'
import { getPermissionList } from '@/api/permission'
import { transListToTreeData } from '@/utils'
export default {
  props: {
    showPermDialog: {
      type: Boolean,
      default: false
    },
    userId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      permData: [],
      checkedList: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  methods: {
    async getPermissionList(id) {
      const result = await getPermissionList()
      this.permData = transListToTreeData(result, '0') // 此处id为啥是0
      // 权限开启则选中多选框
      const { permIds } = await getRoleDetail(id)
      this.checkedList = permIds
    },
    async btnOK() {
      await assignPerm({ id: this.userId, permIds: this.$refs.permTree.getCheckedKeys() }) // checkedList还停留在获取之初
      this.$emit('update:showPermDialog', false)
      this.$message.success('修改成功！')
    },
    btnCancel() {
      this.checkedList = []
      this.$emit('update:showPermDialog', false)
    }
  }
}
</script>
