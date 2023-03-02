<template>
  <div>
    <el-upload
      action="#"
      :limit="1"
      list-type="picture-card"
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
    <!-- 放置进度条 -->
    <el-progress v-if="showPercent" style="width: 180px;" :percentage="percent" />
    <el-dialog :visible.sync="showDialog" title="图片预览">
      <img width="100%" :src="imageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
// 需要实例化
const cos = new COS({
  SecretId: 'AKIDz22zsiVDqTvNsJj5YyKes6GXL1ZyFNOG',
  SecretKey: 'rZAf1DMPN2eQ8oS5gDf5RDvaBg6sjcRC'
})
export default {
  data() {
    return {
      fileList: [], // 图片地址设置为数组
      imageUrl: '',
      showDialog: false,
      currentFileUid: '',
      percent: 0,
      showPercent: false
    }
  },
  computed: {
    fileComputed() {
      return this.fileList.length === 1
    }
  },
  methods: {
    handleRemove(file) {
      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
    },
    // 预览图片
    preview(file) {
      this.imageUrl = file.url
      this.showDialog = true
    },
    changeFile(file, fileList) {
      this.fileList = fileList.map(item => item)
    },
    beforeUpload(file) {
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(file.type)) {
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false
      }
      const maxSize = 5 * 1024 * 1024
      if (maxSize < file.size) {
        this.$message.error('上传头像图片大小不能超过 5MB!')
        return false
      }
      this.currentFileUid = file.uid
      this.showPercent = true // 显示进度条
      return true
    },
    // 自定义上传
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
        }, (err, data) => {
          console.log(err || data)
          if (!err && data.statusCode === 200) {
            // 文件上传成功，需要将fileList中的数据的url变成现在上传成功的地址
            this.fileList = this.fileList.map(item => {
              if (item.uid === this.currentFileUid) {
                return { url: 'http://' + data.Location, upload: true }
              }
              return item
            })
            setTimeout(() => {
              this.showPercent = false
              this.percent = 0
            }, 2000)
          }
        })
      }
    }

  }
}
</script>
<style>
.disabled .el-upload--picture-card{
	display: none
}
</style>
