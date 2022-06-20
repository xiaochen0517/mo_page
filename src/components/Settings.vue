<template>
  <div>
    <el-button @click="test1">TEST 1</el-button>
  </div>
</template>

<script>
export default {
  name: "SettingsComponent",
  created() {
    console.log("data", process.env.VUE_APP_HOT_SEARCH);
  },
  methods: {
    test1(){
      this.$cookies.set('hotSearch', '');
    }
  }
}
</script>

<style scoped lang="less">
.box1 {
  width: 200px;
  height: 200px;
  background-color: black;

  .box2 {
    width: 100px;
    height: 100px;
    background-color: coral;
  }
}
</style>