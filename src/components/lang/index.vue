<template>
  <el-dropdown @command="changeLang">
    <div>
      <svg-icon style="color:#fff;font-size:20px" icon-class="language" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="zh" :disabled="this.$i18n.locale==='zh'">中文</el-dropdown-item>
      <el-dropdown-item command="en" :disabled="this.$i18n.locale==='en'">en</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>
<script>
import Cookie from 'js-cookie'
export default {
  methods: {
    changeLang(type) {
      // 写入缓存
      Cookie.set('language', type)
      this.$i18n.locale = type // 将当前多语言类型改成对应的类型
      this.$message.success('切换多语言成功！')
    }
  }

}
</script>
