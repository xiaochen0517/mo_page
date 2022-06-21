<template>
  <div>
    <el-row justify="center">
      <!--      搜索框-->
      <el-autocomplete
          class="el-col-md-8 search-input"
          v-model="keyWord"
          :fetch-suggestions="querySearchAsync"
          placeholder=""
          @select="handleSelect"
          @keyup.enter="handleSelect"
          value-key="q"
          clearable
          :teleported="true">
        <template #prefix>
          <!--          选择搜索引擎弹出框-->
          <el-popover width="150px"
                      trigger="hover"
                      :hide-after="0">
            <!--            搜索框左侧显示图标-->
            <template #reference>
              <span :class="'engine-icon show-engine-icon icon iconfont '+engine[useEngine].icon"></span>
            </template>
            <!--            点击图标弹出内容-->
            <template #default>
              <el-row class="popover-content" justify="center" v-for="(val, key, index) in engine" :key="index">
                <el-button class="el-col-24" style="margin-top: 5px;margin-bottom: 5px" @click="changeUseEngine(key)">
                  <span :class="'engine-icon icon iconfont '+val.icon"></span>
                  <span style="margin-left: 10px"> {{ val.name }} </span>
                </el-button>
              </el-row>
            </template>
          </el-popover>
        </template>
      </el-autocomplete>
      <el-button class="search-button" type="primary" @click="handleSelect">
        <el-icon>
          <search/>
        </el-icon>
      </el-button>
    </el-row>
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
      this.engine = JSON.parse(decodeURIComponent(this.$cookies.get('searchEngine')));
      this.useEngine = this.$cookies.get('useEngine');
    },
    /**
     * 修改使用的搜索引擎
     * @param name
     */
    changeUseEngine(name) {
      this.$cookies.set('useEngine', name, -1);
      this.useEngine = name;
    }
  }
}
</script>

<style scoped>


.search-button {
  margin-left: 10px;
  margin-top: 1px;
}

.el-form-item__content {
  //margin-left: 0 !important;
}

.engine-icon {
  font-size: 25px;
}

.show-engine-icon {
  color: #2c2c2c;
}
</style>