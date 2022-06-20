<template>
  <div class="top-box">
    <el-row>
      <el-icon :size="30" color="#000000">
        <Setting/>
      </el-icon>
    </el-row>
    <el-row justify="center">
      <img class="main-img" alt="Vue logo" src="../assets/logo.jpg">
    </el-row>
    <el-row justify="center">
      <p>{{dateTime.year}}-{{dateTime.month}}-{{dateTime.day}} {{dateTime.hour}}:{{dateTime.minute}}:{{dateTime.second}}</p>
    </el-row>
  </div>
</template>

<script>
import {Setting} from '@element-plus/icons-vue'

export default {
  name: "TopBox",
  components: {
    Setting
  },
  data() {
    return {
      dateTime: {
        year: '',
        month: '',
        day: '',
        hour: '',
        minute: '',
        second: '',
      }
    }
  },
  created() {
    setInterval(() => { //每1秒刷新一次
      let date = new Date();
      this.dateTime.year = date.getFullYear();
      this.dateTime.month = date.getMonth()+1;
      this.dateTime.day = date.getDate();
      this.dateTime.hour = date.getHours();
      this.dateTime.minute = date.getMinutes();
      this.dateTime.second = date.getSeconds();
    }, 1000);
  },
  methods: {}
}
</script>

<style scoped lang="less">
.top-box {
  color: @color;

  .main-img {
    width: 100px;
    height: 100px;
  }
}
</style>