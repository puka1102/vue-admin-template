<template>
  <!-- 弹出的对话框 -->
  <el-dialog :title="showTitle" :visible="showDialog" @close="close">
    <!-- 表单数据 设置label-width-->
    <el-form ref="deptForm" :model="formData" :rules="rules" label-width="100px">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" class="form-item" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" class="form-item" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="formData.manager" class="form-item" placeholder="请选择" @focus="getEmployeeSimple">
          <el-option v-for="(item) in peoples" :key="item.id" :label="item.username" :value="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" class="form-item" type="textarea" :rows="7" placeholder="1-300个字符" />
      </el-form-item>
    </el-form>
    <!-- 确定和取消按钮 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" @click="btnCancel">取消</el-button>
        <el-button size="small" type="primary" @click="btnOK">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
import { getDepartment, addDepartments, getDepartDetail, updateDepartment } from '@/api/department'
import { getEmployeeSimple } from '@/api/employees'

export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: null
    }
  },
  emits: ['addDepts'],
  data() {
    // 在data下，return前定义校验函数
    const checkNameRepeat = async(rule, value, callback) => {
      // 先要获取当前最新的组织架构数据
      const { depts } = await getDepartment()
      let isRepeat = false
      if (this.formData.id) {
        // 编辑模式，要排除掉自身，找同级部门中有没有和自己重复的
        isRepeat = depts.filter(item => item.pid === this.treeNode.pid && item.id !== this.treeNode.id).some(item => item.name === value)
      } else {
      // 找到同级子部门的数据
        isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      }
      isRepeat ? callback(new Error('同级部门下已存在该名称')) : callback()
    }
    const checkCodeRepeat = async(rule, value, callback) => {
      const { depts } = await getDepartment()
      // 编码不可重复
      let isRepeat = false
      if (this.formData.id) {
        isRepeat = depts.some(item => item.id !== this.treeNode.id && item.code === value && item.code)
      } else {
        isRepeat = depts.some(item => item.code === value && item.code)
      }
      isRepeat ? callback(new Error('该编码已经存在')) : callback()
    }
    return {
      // 定义表单数据
      formData: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      peoples: [],
      // 定义校验规则
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: 'blur' },
          { validator: checkNameRepeat, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' },
          { validator: checkCodeRepeat, trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: 'blur' }

        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { min: 1, max: 300, message: '部门介绍要求1-300个字符', trigger: 'blur' }
        ]
      }

    }
  },
  // 计算属性控制对话框标题
  computed: {
    showTitle() {
      return this.formData.id ? '编辑部门' : '新增部门' // 点击获取部门详情时formData是有id的
    }
  },
  methods: {
    // 获取部门负责人
    async getEmployeeSimple() {
      const result = await getEmployeeSimple()
      this.peoples = result
    },
    // 获取部门详情
    async getDepartDetail(id) {
      this.formData = await getDepartDetail(id)

      // props传值是异步的
    },
    // 点击确定键提交表单
    btnOK() {
      // 手动校验表单
      this.$refs.deptForm.validate(async isOK => {
        if (isOK) {
          // 需要判断是新增还是更新
          if (this.formData.id) {
            // 更新数据
            await updateDepartment(this.formData)
            this.$message.success('修改成功！')
          } else {
          // 校验通过，发起添加子部门的请求，注意合并pid，即父部门的id
            await addDepartments({ ...this.formData, pid: this.treeNode.id })
          }
          // 提交成功后要通知父组件拉取数据，通过触发自定义事件的方法
          this.$emit('addDepts')
          // 关闭对话框
          this.$emit('update:showDialog', false)
          // 这会触发对话框的close事件
        }
      })
    },
    // 点击取消键
    btnCancel() {
      this.$confirm('此操作将清除所有内容并关闭对话框，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 重置获取部门详情后的formData
        this.formData = {
          name: '',
          code: '',
          manager: '',
          introduce: ''
        }
        this.$refs.deptForm.resetFields() // 重置校验字段
        this.$emit('update:showDialog', false)
      })
    },
    // 点击关闭键
    close() {
      // 重置获取部门详情后的formData
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      this.$refs.deptForm.resetFields() // 重置校验字段
      this.$emit('update:showDialog', false)
    }

  }
}
</script>
<style scoped>
.form-item{
	width:90%;
}
</style>
