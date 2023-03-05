<template>
  <el-dialog :visible="showResignDialog" title="离职申请" @close="btnCancel">
    <el-form ref="resignForm" :model="formData" status-icon :rules="rules" label-width="120px">
      <el-form-item label="期望离职时间" prop="exceptTime">
        <el-date-picker v-model="formData.exceptTime" type="datetime" style="width: 70%;" value-format="yyyy-MM-dd HH:mm:ss" />
      </el-form-item>
      <el-form-item label="离职原因" prop="reason">
        <el-input v-model="formData.reason" type="textarea" :rows="3" style="width: 70%;" />
      </el-form-item>
    </el-form>
    <el-row slot="footer" type="flex" justify="center">
      <el-button size="small" type="primary" @click="btnOK(userId)">确定</el-button>
      <el-button size="small" @click="btnCancel">取消</el-button>
    </el-row>
  </el-dialog>
</template>
<script>
import { startProcess } from '@/api/approvals'
export default {
  props: {
    showResignDialog: {
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
      formData: {
        exceptTime: '',
        reason: '',
        processKey: 'process_dimission', // 特定的审批
        processName: '离职'
      },
      rules: {
        exceptTime: [{ required: true, message: '离职时间不能为空', trigger: 'blur' }],
        reason: [{ required: true, message: '离职原因不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    async btnOK(id) {
      try {
        await this.$refs.resignForm.validate()
        await this.$confirm('确认要提交吗？')
        await startProcess({ ...this.formData, userId: id })
        this.$message.success('提交成功！')
        this.$emit('update:showResignDialog', false)
      } catch (error) {
        this.$message.error(error)
      }
    },
    btnCancel() {
      this.formData = {
        resignTime: '',
        reason: '',
        processKey: 'process_dimission', // 特定的审批
        processName: '离职'
      }
      this.$refs.resignForm.resetFields()
      this.$emit('update:showResignDialog', false)
    }
  }
}
</script>
