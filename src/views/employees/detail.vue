<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <el-form label-width="100px" style="margin-left: 120px;margin-top: 30px;">
              <el-form-item>
                <el-input label="姓名：" />
              </el-form-item>
              <el-form-item>
                <el-input label="密码：" type="password" />
              </el-form-item>
              <el-form-item>
                <el-button>更新 </el-button>
              </el-form-item>
            </el-form>

          </el-tab-pane>
          <el-tab-pane label="个人详情" />
          <el-tab-pane label="岗位信息" />
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>
<script>
export default {

}
</script>
<style scoped>
.el-input{
	width: 400px;
}
</style>
