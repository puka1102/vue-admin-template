<template>
  <div>
    <svg-icon icon-class="fullscreen" style="color:#fff; width: 17px; height: 17px" @click="changeScreen" />
  </div>
</template>
<script>
import ScreenFull from 'screenfull'
export default {
  methods: {
    changeScreen() {
      if (!ScreenFull.isEnabled) {
        this.$message.warning('当前全屏不可用！')
        return
      }
      ScreenFull.toggle()
    }
  }
}
</script>
