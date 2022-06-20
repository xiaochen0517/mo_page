<template>
  <div>
    <el-row justify="center">
      <el-autocomplete
          class="el-col-md-8"
          size="large"
          v-model="keyWord"
          :fetch-suggestions="querySearchAsync"
          placeholder="Please input"
          @select="handleSelect"
          @keyup.enter="handleSelect"
          value-key="q"
          clearable
          :teleported="false">
      </el-autocomplete>
      <el-button class="search-button" type="primary" size="large">
        <el-icon>
          <search/>
        </el-icon>
      </el-button>
    </el-row>

  </div>
</template>

<script>
import {Search} from '@element-plus/icons-vue'

export default {
  components: {
    Search
  },
  name: "SearchBox",
  data() {
    return {
      keyWord: '',
    }
  },
  methods: {
    handleSelect() {
      console.log(this.keyWord);
    },
    querySearchAsync(data, back) {
      // 等待添加热搜列表
      if (data == undefined || data == null || data == '') return;
      this.axios.get(process.env.VUE_APP_BAIDU_PATH + data)
          .then(res => {
            console.log('success', res.data.g);
            back(res.data.g);
          })
          .catch(err => {
            console.log('failure', err);
          });
    }
  }
}
</script>

<style scoped lang="less">
.search-button {
  margin-left: 10px;
}
</style>