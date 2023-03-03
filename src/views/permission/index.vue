<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools>
        <template #after>
          <el-button type="primary" size="small" @click="addPermission('0',1)">添加权限</el-button>
        </template>
      </page-tools>
      <!-- 表格 树表row-key必填-->
      <el-table border :data="List" row-key="id">
        <el-table-column label="名称" prop="name" />
        <el-table-column label="标识" prop="code" align="center" />
        <el-table-column label="描述" prop="description" align="center" />
        <el-table-column label="操作" align="center">
          <template slot-scope="{row}">
            <el-button v-if="row.type===1" type="text" @click="addPermission(row.id,2)">添加</el-button>
            <el-button type="text" @click="editPermission(row.id)">编辑</el-button>
            <el-button type="text" @click="delPermission(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 弹框 -->
      <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
        <!-- 表单 -->
        <el-form ref="formData" :model="formData" :rules="rules" label-width="100px">
          <el-form-item label="权限名称" prop="name">
            <el-input v-model="formData.name" />
          </el-form-item>
          <el-form-item label="权限标识" prop="code">
            <el-input v-model="formData.code" />
          </el-form-item>
          <el-form-item label="权限描述">
            <el-input v-model="formData.description" />
          </el-form-item>
          <el-form-item label="权限开启">
            <el-switch v-model="formData.enVisible" active-value="1" inactive-value="0" />
          </el-form-item>
        </el-form>
        <el-row slot="footer" type="flex" justify="center">
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
          <el-button size="small" @click="btnCancel">取消</el-button>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getPermissionList, addPermission, delPermission, getPermissionDetail, updatePermission } from '@/api/permission'
import { transListToTreeData } from '@/utils'
export default {
  data() {
    return {
      List: [],
      formData: {
        name: '',
        code: '',
        description: '',
        type: 0, // 是否显示添加按钮
        pid: '', // 二级权限需要
        enVisible: '0' // 默认不开启
      },
      showDialog: false,
      rules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑权限' : '新增权限'
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    async getPermissionList() {
      this.List = transListToTreeData(await getPermissionList(), '0') // 此处id为啥是0
    },
    async addPermission(id, type) {
      this.showDialog = true
      this.formData.pid = id
      this.formData.type = type
    },
    // 删除功能
    async delPermission(id) {
      try {
        await this.$confirm('确定要删除该权限点吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
        await delPermission(id)
        this.getPermissionList()
      } catch (error) {
        this.$message.error(error)
      }
    },
    // 编辑功能
    async editPermission(id) {
      this.showDialog = true
      this.formData = await getPermissionDetail(id)
    },
    async btnOK() {
      try {
        // 校验
        await this.$refs.formData.validate()
        // 判断是更新还是新增
        if (this.formData.id) {
          await updatePermission(this.formData)
          this.$message.success('修改成功！')
        } else {
          // 提交
          await addPermission(this.formData)
          this.$message.success('添加权限点成功！')
        }
        // 重新拉取
        this.getPermissionList()
        this.showDialog = false
      } catch (error) {
        this.$message.error(error)
      }
    },
    btnCancel() {
      this.formData = {
        name: '',
        code: '',
        description: '',
        type: 0,
        pid: '', // 二级权限需要
        enVisible: '0' // 默认不开启
      }
      this.$refs.formData.resetFields()
      this.showDialog = false
    }
  }
}
</script>

<style scoped>
.el-input{
	width: 80%;
}
</style>
