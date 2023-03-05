<template>
  <div>
    <el-row type="flex" justify="end">
      <el-select v-model="year" placeholder="请选择年" size="small" style="width: 120px;" @change="changeDate">
        <el-option v-for="item in yearList" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="month" placeholder="请选择月" size="small" style="width: 120px;margin-left: 10px;" @change="changeDate">
        <el-option v-for="item in 12" :key="item" :label="item" :value="item" />
      </el-select>
    </el-row>
    <el-calendar v-model="currentDate">
      <template #dateCell="{data,date}" class="content">
        <div class="date-content">
          <span class="text">{{ data.day|getDay }}</span>
          <span v-if="isWeek(date)" class="rest">休</span>
        </div>
      </template>
    </el-calendar>
  </div>
</template>
<script>
export default {
  filters: {
    getDay(value) {
      const day = value.split('-')[2]
      return day.startsWith('0') ? day.substr(1) : day
    }
  },
  props: {
    startDate: { // 设置开始的年份
      type: Date,
      default: () => new Date() // 需要回调函数的返回值
    }
  },
  data() {
    return {
      year: '',
      yearList: [],
      month: '',
      currentDate: ''
    }
  },
  created() {
    this.year = this.startDate.getFullYear()
    this.month = this.startDate.getMonth() + 1
    for (let i = -5; i <= 5; i++) {
      this.yearList.push(this.year + i)
    }
    this.changeDate() // 初始化时就要得到对应的日历
  },
  methods: {
    changeDate() {
      this.currentDate = new Date(`${this.year}-${this.month}-1`) // 以1号为开始
    },
    isWeek(date) {
      // 判断是否是周末
      return date.getDay() === 6 || date.getDay() === 0
    }
  }

}
</script>
<style  scoped>
::v-deep .el-calendar-day {
  height:  auto;
 }
::v-deep .el-calendar-table__row td,::v-deep .el-calendar-table tr td:first-child,  ::v-deep .el-calendar-table__row td.prev{
  border:none;
 }
.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}
.date-content .text{
  width: 20px;
  height: 20px;
  line-height: 20px;
 display: inline-block;

}
::v-deep .el-calendar-table td.is-selected .text{
   background: #409eff;
   color: #fff;
   border-radius: 50%;
 }
::v-deep .el-calendar__header {
   display: none
 }
</style>
