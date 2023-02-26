<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 通用栏 -->
      <page-tools :show-before="true">
        <template #before>
          共{{ page.total }}条信息
        </template>
        <template #after>
          <el-button size="small" type="warning">excel导入</el-button>
          <el-button size="small" type="danger">excel导出</el-button>
          <el-button size="small" type="primary">新增员工</el-button>
        </template>
      </page-tools>
      <!-- 表格和分页 -->
      <el-card v-loading="loading">
        <!-- 表格 -->
        <el-table :data="employeeList">
          <el-table-column label="序号" type="index" sortable="" />
          <el-table-column label="姓名" prop="username" sortable="" />
          <el-table-column label="头像">
            <img src="staffPhoto" alt="">
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
            <template>
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small">删除</el-button>
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
      </el-card>
    </div>
  </div>
</template>

<script>
import { getEmployees } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
export default {
  data() {
    return {
      employeeList: [],
      page: {
        page: 1,
        size: 10,
        total: 0
      },
      loading: false
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
    }
  }
}
</script>

<style>

</style>
