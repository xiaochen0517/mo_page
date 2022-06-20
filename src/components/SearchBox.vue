<template>
  <div>
    <el-row justify="center">
      <el-autocomplete
          class="el-col-md-8"
          size="large"
          v-model="keyWord"
          :fetch-suggestions="querySearchAsync"
          placeholder=""
          @select="handleSelect"
          @keyup.enter="handleSelect"
          value-key="q"
          clearable
          :teleported="true">
        <template #prefix>
          <el-popover width="150px"
                      trigger="click">
            <template #reference>
              <img :src="require('../assets'+engine[useEngine].icon)"
                   width="25"
                   height="25"/>
            </template>
            <template #default>
              <el-row class="popover-content" justify="center" v-for="(val, key, index) in engine" :key="index">
                <img class="el-col-4" :alt="key" :src="require('../assets'+val.icon)"
                     width="25"
                     height="25"/>
                <el-link class="popover-link el-col-8" :underline="false">{{ key }}</el-link>
              </el-row>
            </template>
          </el-popover>
        </template>
      </el-autocomplete>
      <el-button class="search-button" type="primary" size="large" @click="handleSelect">
        <el-icon>
          <search/>
        </el-icon>
      </el-button>
    </el-row>
    <el-popover :width="50"
                trigger="click">
      <template #reference>
        <el-button>hover 激活</el-button>
      </template>
      <template #default>
        <p>test</p>
      </template>
    </el-popover>
  </div>
</template>

<script>
import {Search} from '@element-plus/icons-vue'
import jsonp from "jsonp";

export default {
  components: {
    Search
  },
  name: "SearchBox",
  data() {
    return {
      keyWord: '',
      back: null,
      // 搜索引擎列表
      engine: {},
      useEngine: '',
    }
  },
  computed: {},
  mounted() {
    window.baiduCallback = this.baiduCallback;
  },
  created() {
    this.initData();
  },
  methods: {
    /**
     * 开始搜索
     */
    handleSelect() {
      console.log(this.keyWord);
      console.log('engine', this.engine);
      if (this.keyWord == '') return;
      let searchUrl = this.engine[this.useEngine];
      window.location.href = searchUrl.url + this.keyWord;
    },
    /**
     * 搜索关键词补全查询
     * @param data
     * @param back
     */
    querySearchAsync(data, back) {
      this.back = back;
      if (data == undefined || data == null || data == '') {
        if (process.env.VUE_APP_HOT_SEARCH === 'true') {
          // 获取热搜列表
          this.getHotSearch();
          return;
        }
        if (process.env.VUE_APP_SEARCH_HISTORY === 'true') {
          this.getSearchHistory();
          return;
        }
        return;
      }
      jsonp(this.$api.Search.hint + this.keyWord, null, (err, data) => {
        if (err) {
          console.error(err);
        } else {
          console.log(data);
        }
      })
    },
    /**
     * 搜索关键词补全jsonp回调接口
     * @param data 接口返回数据
     */
    baiduCallback(data) {
      console.log('success', data.g);
      this.back(data.g);
    },
    /**
     * 获取热搜列表
     */
    getHotSearch() {
      console.log('cookie', this.$cookies.get('hotSearch'));
      let hotSearch = this.$cookies.get('hotSearch');
      if (this.$cookies.isKey('hotSearch') && hotSearch != null && hotSearch != '') {
        this.back(JSON.parse(hotSearch));
        return;
      }
      this.axios.get('https://v2.alapi.cn/api/new/wbtop?num=10&token=LwExDtUWhF3rH5ib')
          .then(res => {
            let data = res.data;
            console.log(res);
            data.forEach(item => {
              item['q'] = item.hot_word;
            });
            this.back(data);
            this.$cookies.set('hotSearch', JSON.stringify(data), '2h');
          })
          .catch(err => {
            console.log(err);
          })
    },
    /**
     * 获取搜索历史
     */
    getSearchHistory() {
      let searchHistory = this.$cookies.get('searchHistory');
      if (this.$cookies.isKey('searchHistory')
          && searchHistory != null
          && searchHistory != '') {
        this.back(JSON.parse(searchHistory));
      } else {
        this.back([]);
      }
    },
    /**
     * 初始化搜索引擎数据
     */
    initData() {
      let searchEngine = this.$cookies.get('searchEngine');
      // 已经存在数据，从cookie中取出
      if (this.$cookies.isKey('searchEngine') && searchEngine != null
          && searchEngine != '') {
        this.engine = JSON.parse(decodeURIComponent(searchEngine));
        this.useEngine = this.$cookies.get('useEngine');
      } else {
        // 第一次执行，初始化数据
        console.log(this.$api.Search.engine);
        let jsonStr = encodeURIComponent(JSON.stringify(this.$api.Search.engine));
        this.$cookies.set('searchEngine', jsonStr, -1);
        this.$cookies.set('useEngine', process.env.VUE_APP_DEFAULT_SEARCH_ENGINE, -1);
        this.engine = this.$api.Search.engine;
        this.useEngine = process.env.VUE_APP_DEFAULT_SEARCH_ENGINE;
      }
    }
  }
}
</script>

<style scoped lang="less">
.search-button {
  margin-left: 10px;
}

.el-form-item__content {
  //margin-left: 0 !important;
}

//.popover-link:hover+img{
//  overflow: hidden;
//  position: relative;
//  left: -25px;
//  filter: drop-shadow(blue 25px 0);
//}
</style>