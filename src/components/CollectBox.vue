<template>
  <el-row justify="center">
    <el-row class="links-box el-col-12" justify="start" v-if="showCollect==='true'">
      <div class="links-item el-col-4" v-for="(item, index) in collect" :key="index">
        <el-link class="links-i" :underline="false" :href="item.url">{{ item.name }}</el-link>
      </div>
    </el-row>
  </el-row>
</template>

<script>
export default {
  name: "CollectBox",
  data() {
    return {
      showCollect: true,
      collect: [],
    }
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      this.showCollect = this.$cookies.get('showCollect');
      this.collect = JSON.parse(decodeURIComponent(this.$cookies.get('collect')));
    },
  }
}
</script>

<style scoped lang="less">
.links-box {
  margin-top: 50px;
  background-color: rgba(255, 255, 255, 0.75);
  border-radius: 5px;
  padding: 10px 0;

  .links-item {
    text-align: center;
    margin: 10px 0;

    .links-i {
      color: #2c2c2c;
    }

    .links-i:hover {
      color: #409eff;
    }
  }
}
</style>