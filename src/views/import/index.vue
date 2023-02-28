<template>
  <!-- 公共导入组件 -->
  <upload-excel :on-success="success" />
</template>
<script>
import { importEmployee } from '@/api/employees'
export default {
  methods: {
    async success({ header, results }) {
      const userRelation = {
        '手机号': 'mobile',
        '姓名': 'username',
        '入职日期': 'timeOfEntry',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      const newArr = results.map(item => {
        var newitem = {} // 定义新的对象
        header.forEach(key => {
          if (key === '入职日期' || key === '转正日期') {
            // 后端限制，只能转换成时间类型才能入库
            newitem[userRelation[key]] = new Date(this.formatDate(item[key], '/'))
          } else {
            newitem[userRelation[key]] = item[key]
          } // 把原来的键名换成对应的英文
        })
        return newitem
      })
      console.log(newArr)
      await importEmployee(newArr) // 调用接口
      this.$message.success('excel导入成功')
      this.$router.back() // 返回
    },
    // 转化excel的日期格式
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>
