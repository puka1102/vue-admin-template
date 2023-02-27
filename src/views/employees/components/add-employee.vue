<template>
  <el-dialog title="新增员工" :visible="showDialog" @close="btnCancel">
    <el-form ref="Form" :model="formData" :rules="rules" label-width="100px">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" class="formItem" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" class="formItem" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker
          v-model="formData.timeOfEntry"
          class="formItem"
          type="date"
          placeholder="请选择入职时间"
        />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" class="formItem" placeholder="请选择聘用形式">
          <el-option v-for="(item) in EmployeeEnum.hireType" :key="item.id" :label="item.value" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" class="formItem" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input v-model="formData.departmentName" class="formItem" placeholder="请选择部门" @focus="getDepartment" />
        <!-- 树形控件 -->
        <el-tree
          v-if="showTree"
          v-loading="loading"
          :data="treeData"
          :props="{ label: 'name' }"
          @node-click="handleNodeClick"
        />

      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker
          v-model="formData.correctionTime"
          class="formItem"
          type="date"
          placeholder="请选择入职时间"
        />
      </el-form-item>
    </el-form>
    <!-- 底部栏 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-button size="small" type="primary" @click="btnOK">确认</el-button>
      <el-button size="small" @click="btnCancel">取消</el-button>
    </el-row>
  </el-dialog>
</template>
<script>
import { addEmployee } from '@/api/employees'
import { getDepartment } from '@/api/department'
import { transListToTreeData } from '@/utils/index'
import EmployeeEnum from '@/api/constant/employees'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      EmployeeEnum, // 相同名称直接写
      formData: { // 不要偷懒，一开始各项属性要写好
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      treeData: [], // 接收树形数据
      showTree: false,
      loading: false,
      rules: {
        username: [{ required: true, message: '用户姓名不能为空', trigger: 'blur' },
          { min: 1, max: 4, message: '用户姓名为1~4位', trigger: 'blur' }],
        mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }],
        formOfEmployment: [{ required: true, message: '招聘形式不能为空', trigger: 'blur' }],
        workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
        departmentName: [{ required: true, message: '部门不能为空', trigger: 'change' }],
        timeOfEntry: [{ required: true, message: '入职时间不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 获取部门
    async getDepartment() {
      this.showTree = true
      this.loading = true
      const { depts } = await getDepartment()
      this.treeData = transListToTreeData(depts, '')
      this.loading = false
    },
    // 点击选择部门
    handleNodeClick(node) {
      this.formData.departmentName = node.name
      this.showTree = false
    },
    // 点击确认键提交
    async btnOK() {
      try {
        await this.$refs.Form.validate()
        await addEmployee(this.formData)
        this.$message.success('新增员工成功！')
        this.$emit('addEmployee')
        this.$emit('update:showDialog', false)
      } catch (error) {
        this.$message.error(error)
      }
    },
    // 点击取消键
    btnCancel() {
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      this.$refs.Form.resetFields()
      this.$emit('update:showDialog', false)
    }

  }

}
</script>
<style scoped>
.formItem{
	width:80%
}
</style>
