<template>
  <!-- 弹出的对话框 -->
  <el-dialog title="新增部门" :visible="showDialog">
    <!-- 表单数据 设置label-width-->
    <el-form label-width="100px">
      <el-form-item label="部门名称">
        <el-input class="form-item" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码">
        <el-input class="form-item" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人">
        <el-select class="form-item" placeholder="请选择" />
      </el-form-item>
      <el-form-item label="部门介绍">
        <el-input class="form-item" type="textarea" :rows="7" placeholder="1-300个字符" />
      </el-form-item>
    </el-form>
    <!-- 确定和取消按钮 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small">取消</el-button>
        <el-button size="small" type="primary">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  }
}
</script>
<style scoped>
.form-item{
	width:90%;
}
</style>
