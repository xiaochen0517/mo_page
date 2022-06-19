<template>
  <div>
    <el-button @click="get">GET TEST</el-button>
  </div>
</template>

<script>
export default {
  name: "SettingsComponent",
  created() {
    console.log("data", this.$api.Search.hint);
  },
  methods: {
    get() {
      this.axios.get("/sugrec?ie=utf-8&json=1&prod=pc&wd=网络")
          .then(res => {
            console.log('success', res);
          })
          .catch(err => {
            console.log('failure', err);
          });
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