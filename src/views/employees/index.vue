<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 通用栏 -->
      <page-tools :show-before="true">
        <template #before>
          共{{ page.total }}条信息
        </template>
        <template #after>
          <el-button size="small" type="warning" @click="$router.push('/import')">excel导入</el-button>
          <el-button size="small" type="danger" @click="exportData">excel导出</el-button>
          <el-button size="small" type="primary" icon="plus" @click="showDialog=true">新增员工</el-button>
        </template>
      </page-tools>
      <!-- 表格和分页 -->
      <el-card v-loading="loading">
        <!-- 表格 -->
        <el-table :data="employeeList">
          <el-table-column label="序号" type="index" sortable="" />
          <el-table-column label="姓名" prop="username" sortable="" />
          <el-table-column label="头像" width="120px">
            <template slot-scope="{row}">
              <img
                v-imagerror="require('@/assets/common/bigUserHeader.png')"
                :src="row.staffPhoto"
                alt=""
                style="border-radius: 50%; width: 100px; height: 100px; padding: 10px"
                @click="showQrCode(row.staffPhoto)"
              >
            </template>
          </el-table-column>
          <el-table-column label="工号" prop="workNumber" sortable="" />
          <el-table-column label="聘用形式" prop="formOfEmployment" sortable="" :formatter="formatEmployment" />
          <el-table-column label="部门" prop="departmentName" sortable="" />
          <el-table-column label="入职时间" prop="timeOfEntry" sortable="">
            <template slot-scope="{row}">
              {{ row.timeOfEntry|formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" prop="enableState" sortable="">
            <template slot-scope="{row}">
              <el-switch :value="row.enableState===1" />
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="240">
            <template slot-scope="{row}">
              <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="editRole(row.id)">角色</el-button>
              <el-button v-if="checkPermission('delEmployees')" type="text" size="small" @click="delEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-row type="flex" justify="center" align="middle">
          <el-pagination
            layout="prev,pager,next"
            :current-page="page.page"
            :total="page.total"
            :page-size="page.size"
            @current-change="changePage"
          />
        </el-row>
        <!-- 新增员工弹层 -->
        <add-employee :show-dialog.sync="showDialog" @add-employee="getEmployees" />
        <!-- 二维码弹层 -->
        <el-dialog
          title="二维码"
          :visible.sync="showCodeDialog"
        >
          <el-row type="flex" justify="center">
            <canvas ref="myCanvas" />
          </el-row>
        </el-dialog>
        <!-- 分配角色弹窗 -->
        <assign-role ref="assignRole" :show-role-dialog.sync="showRoleDialog" :user-id="userId" />
      </el-card>
    </div>
  </div>
</template>

<script>
import { getEmployees, delEmployee } from '@/api/employees'
import AddEmployee from './components/add-employee.vue'
import EmployeeEnum from '@/api/constant/employees'
import { formatDate } from '@/filters'
import QrCode from 'qrcode'
import AssignRole from './components/assign-role.vue' // 分配角色组件
export default {
  components: {
    AddEmployee,
    AssignRole
  },
  data() {
    return {
      employeeList: [],
      page: {
        page: 1,
        size: 10,
        total: 0
      },
      loading: false,
      showDialog: false,
      showCodeDialog: false,
      showRoleDialog: false,
      userId: ''
    }
  },
  created() {
    this.getEmployees()
  },
  methods: {
    async getEmployees() {
      this.loading = true
      const result = await getEmployees(this.page)
      this.employeeList = result.rows
      this.page.total = result.total
      this.loading = false
    },
    // 切换页面
    changePage(newpage) {
      this.page.page = newpage
      this.getEmployees()
    },
    // 格式化聘用形式
    formatEmployment(row, column, value, index) {
      const obj = EmployeeEnum.hireType.find(item => item.id === value)
      return obj ? obj.value : '未知'
    },
    // 删除功能
    async delEmployee(id) {
      await this.$confirm('确定删除该员工吗？', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
      try {
        await delEmployee(id)
        this.getEmployees()
        this.$message.success('删除成功！')
      } catch (error) {
        this.$message.error(error)
      }
    },
    // 转化成二维数组格式
    formatJson(headers, rows) {
      const data = rows.map(item => {
        return headers.map(header => {
          // 需要判断字段
          if (header === 'timeOfEntry' || header === 'correctionTime') {
            return formatDate(item[header])
          } else if (header === 'formOfEmployment') {
            var type = EmployeeEnum.hireType.find(obj => obj.id === item[header])
            return type ? type.value : '未知'
          } else {
            return item[header]
          }
        })
      })
      return data
    },
    // 导出excel
    exportData() {
      // 使用懒加载
      import('@/vendor/Export2Excel').then(async excel => {
        // 把表头转换为中文
        const headers = {
          '手机号': 'mobile',
          '姓名': 'username',
          '入职日期': 'timeOfEntry',
          '转正日期': 'correctionTime',
          '聘用形式': 'formOfEmployment',
          '工号': 'workNumber',
          '部门': 'departmentName'
        }
        // 获取所有员工的数据
        const { rows } = await getEmployees({ page: 1, size: this.page.total })
        const data = this.formatJson(Object.values(headers), rows)
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']] // 注意合并列要写空号占位
        const merges = ['A1:A2', 'B1:F1', 'G1:G2']

        excel.export_json_to_excel({
          header: Object.keys(headers),
          data,
          filename: '员工工资表',
          multiHeader, // 复杂表头
          merges // 合并选项
        })
      })
    },
    // 显示二维码
    showQrCode(url) {
      if (url) {
        console.log(url)
        this.showCodeDialog = true
        // 页面渲染是异步的，不能确保有ref对象
        this.$nextTick(() => {
          QrCode.toCanvas(this.$refs.myCanvas, url) // 降低至转化为二维码
        })
      } else {
        this.$message.warning('该用户还未上传头像')
      }
    },
    // 编辑角色弹窗
    async editRole(id) {
      this.userId = id // props传值是异步的
      await this.$refs.assignRole.getUserDetail(id)
      this.showRoleDialog = true
    }
  }
}
</script>

<style>

</style>
