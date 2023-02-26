<template>
  <div class="dashboard-container">
    <div v-loading="loading" class="app-container">
      <el-card>
        <!-- 页签设置 -->
        <el-tabs>
          <el-tab-pane label="角色管理">

            <!-- 新增按钮 -->
            <el-row>
              <el-button type="primary" size="small" icon="el-icon-plus" @click="addRole">新增角色</el-button>
            </el-row>
            <!-- 员工表格 -->
            <el-table :data="employeeList" border style="width:100%;margin-top: 10px;">
              <el-table-column type="index" label="序号" width="100px" />
              <el-table-column prop="name" label="名称" />
              <el-table-column prop="description" label="描述" />
              <el-table-column label="操作">
                <!-- 作用域插槽 -->
                <template slot-scope="{row}">
                  <el-button size="mini" type="success">分配权限</el-button>
                  <el-button size="mini" type="primary" @click="showDetail(row.id)">编辑</el-button>
                  <el-button size="mini" type="danger" @click="deleteRole(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页设置 -->
            <el-row type="flex" justify="center" align="middle" style="height: 60px">
              <el-pagination
                layout="prev,pager,next"
                :current-page="page.page"
                :page-size="page.pagesize"
                :total="page.total"
                @current-change="changePage"
              />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <!-- 公司信息 -->
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
            />
            <el-form :label-position="labelPosition" label-width="70px" style="margin-top:50px;margin-left: 50px;">
              <el-form-item label="企业名称">
                <el-input v-model="companyInfo.name" disabled />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="companyInfo.companyAddress" disabled />
              </el-form-item>
              <el-form-item label="电话">
                <el-input v-model="companyInfo.companyPhone" disabled />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="companyInfo.mailbox" disabled />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="companyInfo.remarks" type="textarea" :rows="3" style="width:400px;" disabled />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <edit-role ref="editRole" :show-dialog.sync="showDialog" @addRole="getRoleList" />
  </div>
</template>

<script>
import { getRoleList, getCompanyInfo, deleteRole } from '@/api/setting'
import { mapGetters } from 'vuex'
import editRole from './component/edit-role.vue'
export default {
  components: {
    editRole
  },
  data() {
    return {
      employeeList: [],
      // 配置分页组件
      page: {
        page: 1,
        pagesize: 10,
        total: 0 // 记录总条目数
      },
      labelPosition: 'left',
      companyInfo: {},
      showDialog: false, // 控制对话框显示
      roleId: ' ', // 编辑的id
      loading: false
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
  },
  methods: {
    async getRoleList() {
      this.loading = true
      const result = await getRoleList(this.page)
      this.employeeList = result.rows
      this.page.total = result.total
      this.loading = false
    },
    // 点击分页
    changePage(newpage) {
      this.page.page = newpage
      this.getRoleList()
    },
    // 获取公司信息
    async getCompanyInfo() {
      const result = await getCompanyInfo(this.companyId)
      this.companyInfo = result
    },
    // 删除角色信息
    async deleteRole(id) {
      try {
        // 提示信息
        await this.$confirm('确认删除该角色吗？', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await deleteRole(id)
        this.$message.success('删除角色成功！')
      } catch (error) {
        this.$message.error(error)
      }
    },
    // 点击编辑按钮
    showDetail(id) {
      this.showDialog = true
      this.roleId = id
      this.$refs.editRole.getRoleDetail(id)
    },
    // 点击新增角色
    addRole() {
      this.showDialog = true
    }

  }
}
</script>

<style scoped>
.el-input{
	width:400px !important
}
</style>
