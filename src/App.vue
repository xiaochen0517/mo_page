<template>
  <top-box/>
  <search-box/>
  <collect-box/>
</template>

<script>
import SearchBox from "@/components/SearchBox";
import TopBox from "@/components/TopBox";
import CollectBox from "@/components/CollectBox";

export default {
  name: 'App',
  components: {
    SearchBox,
    TopBox,
    CollectBox
  },
  created() {
    this.initPic();
    this.initData();
  },
  methods: {
    initPic() {
    },
    initData() {
      // 已经存在数据，从cookie中取出
      if (!this.$cookies.isKey('searchEngine')) {
        // 搜索引擎
        this.$cookies.set('searchEngine', encodeURIComponent(JSON.stringify(this.$api.Search.engine)), -1);
      }
      if (!this.$cookies.isKey('useEngine')) {
        // 使用的搜索引擎
        this.$cookies.set('useEngine', process.env.VUE_APP_DEFAULT_SEARCH_ENGINE, -1);
      }
      if (!this.$cookies.isKey('collect')) {
        // 收藏链接
        this.$cookies.set('collect', encodeURIComponent(JSON.stringify(this.$api.Collect)), -1);
      }
      if (!this.$cookies.isKey('showCollect')) {
        // 是否显示收藏链接
        this.$cookies.set('showCollect', this.$api.Settings.showCollect, -1);
      }
    }
  }
}
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/**
必应每日一图背景
 */
body {
  margin: 0;
  padding: 0;
  height: 100vh;
  background-image: url("https://api.kdcc.cn");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}

//.el-autocomplete .el-input__inner {
//  background-color: #00000000;
//  color:#FFFFFF;
//}
//
//.el-autocomplete .el-input__wrapper{
//  /* 使input框的背景变透明 */
//  background-color: rgba(0, 0, 0, 0.59);
//  /* 使边框也变透明 */
//  border-color: transparent;
//  box-shadow: none;
//  caret-color: #FFFFFF;
//}
</style>
