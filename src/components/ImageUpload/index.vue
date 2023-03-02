<template>
  <div>
    <el-upload
      list-type="picture-card "
      :limit="1"
      action="#"
      :file-list="fileList"
      :on-preview="preview"
      :on-remove="handleRemove"
      :on-change="changeFile"
      :before-upload="beforeUpload"
      :http-request="upload"
      :class="{disabled:fileComputed}"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <!-- 弹层 -->
    <!-- 放置进度条 -->
    <el-progress v-if="showPercent" style="width:180px" :percentage="percent" />
    <el-dialog :visible.sync="showDialog" titel="图片预览">
      <img :src="imgUrl" alt="" width="100%">
    </el-dialog>

  </div>
</template>
<script>
import COS from 'cos-js-sdk-v5' // 引入腾讯云的包
// 需要实例化
const cos = new COS({
  SecretId: 'AKIDz22zsiVDqTvNsJj5YyKes6GXL1ZyFNOG',
  SecretKey: 'rZAf1DMPN2eQ8oS5gDf5RDvaBg6sjcRC'
})

export default {
  data() {
    return {
      fileList: [],
      showDialog: false,
      imgUrl: '',
      currentFileUid: null, // 记录当前上传图片的id
      percent: 0,
      showPercent: false

    }
  },
  computed: {
    // 设定一个 计算属性 判断是否已经上传完了一张
    fileComputed() {
      return this.fileList.length === 1
    }
  },
  methods: {
    preview(file) {
      console.log(file)
      this.imgUrl = file.url
      this.showDialog = true
    },
    // 删除文件
    handleRemove(file) {
      // 排除掉点击的文件，剩下的就是最新的数组了
      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
    },
    // 文件状态改变
    changeFile(file, filelist) {
      this.fileList = filelist.map(item => item)
    },
    // 上传之前检查
    beforeUpload(file) {
      // 检查文件类型
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(file.type)) {
        this.$message.error('上传图片只能是JPG、GIF、BMP、PNG格式！')
        return false // 注意要return false
      }
      // 检查大小
      const maxSize = 5 * 1024 * 1024
      if (maxSize < file.size) {
        this.$message.error('图片大小最大不能超过5M')
        return false
      }
      this.currentFileUid = file.uid
      this.showPercent = true
      return true
    },
    // 自定义上传操作
    upload(params) {
      if (params.file) {
        cos.putObject({
          Bucket: 'staffphoto-1317053941', // 存储桶
          Region: 'ap-shanghai', // 地域
          Key: params.file.name, // 文件名
          Body: params.file, // 上传的文件对象
          StorageClass: 'STANDARD', // 上传的模式类型
          // 进度条
          onProgress: (params) => {
            this.percent = params.percent * 100
          }
        }, function(err, data) {
          console.log(err || data)
          if (!err && data.statusCode === 200) {
            // 上传成功
            this.fileList = this.fileList.map(item => {
              // 需要知道当前上传成功的是哪一张图片
              if (item.uid === this.currentFileUid) {
                return { url: 'http://' + data.Location, upload: true }
                // 有upload说已经保存成功了
              }
              return item
              // 将上传成功的地址回写到了fileList中
            })
            setTimeout(() => {
              this.showPercent = false // 隐藏进度条
              this.percent = 0 // 进度归0
            }, 2000)
          }
        })
      }
    }
  }
}
</script>
<style>
.disabled .el-upload--picture-card {
  display: none
}
</style>
