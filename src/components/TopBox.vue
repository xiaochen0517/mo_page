<template>
  <div class="top-box">
    <el-row justify="end">
      <el-avatar class="top-avatar" :size="40" :src="require('../assets/logo.jpg')" @click="ShowSetting = true"/>
    </el-row>
    <el-row justify="center" align="bottom">
      <span class="top-time top-time-main">{{ dateTime.hour }}:{{ dateTime.minute }}</span>
      <span class="top-time top-time-sec">{{ dateTime.second }}</span>
    </el-row>
    <el-row justify="center">
      <span class="top-time top-time-date">{{ dateTime.year }}年{{ dateTime.month }}月{{ dateTime.day }}日</span>
    </el-row>
    <el-drawer v-model="ShowSetting" title="设置">
      <template #default>
        <div>
          <el-row align="middle">
            <span class="el-col-8 el-col-offset-2">显示收藏链接</span>
            <el-switch class="el-col-12" v-model="showCollect" @change="showCollectChange"/>
          </el-row>
          <br>
          <el-row align="middle">
            <el-button class="el-col-offset-2" @click="showEditEngine = true">设置搜索引擎
              <el-icon>
                <Edit/>
              </el-icon>
            </el-button>
          </el-row>
        </div>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="doneSettings"> 完成</el-button>
        </div>
      </template>
    </el-drawer>
    <el-dialog
        v-model="showEditEngine"
        title="修改搜索引擎"
        width="50%">
      <div>
        <json-editor-vue ref="jsonEditor" class="editor" v-model="engine"></json-editor-vue>
      </div>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="showEditEngine = false">取消</el-button>
        <el-button type="primary" @click="saveEditEngine">保存</el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {Edit} from '@element-plus/icons-vue'
import JsonEditorVue from 'json-editor-vue3'
import {ElNotification} from 'element-plus'

export default {
  name: "TopBox",
  components: {
    Edit,
    JsonEditorVue,
  },
  data() {
    return {
      dateTime: {
        year: '0000',
        month: '00',
        day: '00',
        hour: '00',
        minute: '00',
        second: '00',
      },
      ShowSetting: false,
      showCollect: 'true', // 是否显示收藏链接
      showEditEngine: false,
      engine: {},
      editor: null,
    }
  },
  created() {
    this.refreshTime();
    this.initData();
  },
  methods: {
    async saveEditEngine() {
      this.editor = this.$refs.jsonEditor.editor;
      let errors = await this.editor.validate();
      // json 中存在错误
      if (errors.length > 0) {
        for (let i = 0; i < errors.length; i++) {
          ElNotification({
            title: 'JSON 错误',
            dangerouslyUseHTMLString: true,
            message: errors[i].message,
            type: 'error',
          })
        }
        return;
      }
    },
    initData() {
      this.engine = JSON.parse(decodeURIComponent(this.$cookies.get('searchEngine')));
      // cookie中储存的是string，直接赋值会出现bug
      this.showCollect = this.$cookies.get('showCollect') === 'true';
    },
    refreshTime() {
      setInterval(() => { //每1秒刷新一次
        let date = new Date();
        this.dateTime.year = date.getFullYear();
        this.dateTime.month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
        this.dateTime.day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        this.dateTime.hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
        this.dateTime.minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
        this.dateTime.second = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
      }, 1000);
    },
    showCollectChange() {
      this.$cookies.set('showCollect', this.showCollect, -1);
    },
    doneSettings() {
      this.ShowSetting = false
      location.reload();
    },
  },

}
</script>

<style scoped lang="less">
.top-box {
  margin-bottom: 50px;

  .top-avatar {
    margin: 30px;
  }

  .main-img {
    width: 100px;
    height: 100px;
  }

  .top-time {
    color: #FFFFFF;
    font-size: 80px;
    line-height: 80px;
  }

  .top-time-sec {
    font-size: 40px;
    line-height: 53px;
    margin-left: 5px;
  }

  .top-time-date {
    color: #FFFFFF;
    font-size: 25px;
  }
}
</style>