<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <el-form ref="detailForm" :model="userInfo" :rules="rules" label-width="100px" style="margin-left: 120px;margin-top: 30px;">
              <el-form-item label="姓名：" prop="username">
                <el-input v-model="userInfo.username" />
              </el-form-item>
              <el-form-item label="密码：" prop="password2">
                <el-input v-model="userInfo.password2" type="password" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveUserDetail">更新 </el-button>
              </el-form-item>
            </el-form>

          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <!-- 放置个人详情组件 -->
            <component :is="userComponent" />
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <!-- 放置岗位详情组件 -->
            <component :is="jobInfo" />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>
<script>
import { getUserDetail, saveUserDetail } from '@/api/user'
import userComponent from './components/user-info.vue'
import jobInfo from './components/job-info.vue'

export default {
  components: {
    userComponent,
    jobInfo
  },

  data() {
    return {
      userId: this.$route.params.id, // 动态路由的参数
      userInfo: {
        username: '',
        password2: ''
      },
      userComponent,
      jobInfo,
      rules: {
        username: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        password2: [{ required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 9, message: '密码长度为6-9位', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getUserDetail()
  },
  methods: {
    // 获取用户信息
    async getUserDetail() {
      this.userInfo = await getUserDetail(this.userId)
    },
    // // 保存用户信息
    async saveUserDetail() {
      try {
        await this.$refs.detailForm.validate()
        await saveUserDetail({ ...this.userInfo, password: this.userInfo.password2 })
        this.$message.success('保存成功！')
      } catch (error) {
        this.$message.error(error)
      }
    }
  }

}
</script>
<style scoped>
.el-input{
	width: 300px;
}
</style>
