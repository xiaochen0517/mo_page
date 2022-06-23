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
          <br>
          <el-row align="middle">
            <el-button class="el-col-offset-2" @click="showEditCollect = true">修改收藏夹内容
              <el-icon>
                <Edit/>
              </el-icon>
            </el-button>
          </el-row>
        </div>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button type="primary" @click="doneSettings"> 完成</el-button>
        </div>
      </template>
    </el-drawer>
    <!--    修改搜索引擎内容弹窗-->
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
    <!--    修改收藏夹链接弹窗-->
    <el-dialog
        v-model="showEditCollect"
        title="修改收藏夹内容"
        width="50%">
      <div>
        <el-button type="primary" size="small" @click="showAddCollectDialog">添加收藏链接</el-button>
        <el-popconfirm title="确认删除所有已选链接？" @confirm="deleteSelectedCollect" confirmButtonText="确认"
                       cancelButtonText="取消" confirmButtonType="danger" cancelButtonType="default">
          <template #reference>
            <el-button type="danger" size="small">删除所选</el-button>
          </template>
        </el-popconfirm>
        <br><br>
        <el-table ref="collectTable" :data="collectData" border style="width: 100%">
          <el-table-column type="selection" width="55"/>
          <el-table-column prop="name" label="名称" width="150"/>
          <el-table-column prop="url" label="链接"/>
          <el-table-column fixed="right" label="操作" width="150">
            <template #default="scope">
              <el-button link type="primary" size="small" @click="editCollect(scope.$index)">修改</el-button>
              <el-popconfirm title="确认删除此链接？" @confirm="deleteCollect(scope.$index)" confirmButtonText="确认"
                             cancelButtonText="取消" confirmButtonType="danger" cancelButtonType="default">
                <template #reference>
                  <el-button link type="danger" size="small">删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="showEditCollect = false">关闭</el-button>
      </span>
      </template>
    </el-dialog>
    <!--    收藏夹添加链接弹窗-->
    <el-dialog
        v-model="showAddCollect"
        :title="isAdd ? '添加链接' : '修改链接'"
        width="30%">
      <div>
        <el-input placeholder="名称" v-model="addCollectName"></el-input>
        <br><br>
        <el-input placeholder="链接" v-model="addCollectUrl"></el-input>
      </div>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="showAddCollect = false">取消</el-button>
        <el-button type="primary" @click="saveAddCollect">保存</el-button>
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
      dateTime: { // 时间数据
        year: '0000',
        month: '00',
        day: '00',
        hour: '00',
        minute: '00',
        second: '00',
      },
      ShowSetting: false, // 显示设置抽屉内容
      showCollect: 'true', // 是否显示收藏链接
      showEditEngine: false, // 显示修改搜索引擎弹窗
      engine: {}, // 搜索引擎内容
      editor: null, // json编辑器
      showEditCollect: false, // 显示修改收藏夹弹窗
      collectData: [], // 收藏夹数据
      showAddCollect: false, // 显示添加收藏夹连接弹窗
      addCollectName: '', // 添加收藏夹链接名称
      addCollectUrl: '', // 添加收藏夹链接内容
      isAdd: true, // true：添加链接 false：修改链接
      editIndex: 0, // 修改链接的下标
    }
  },
  created() {
    this.refreshTime();
    this.initData();
  },
  methods: {
    /**
     * 保存搜索引擎修改内容 *后期需要替换
     * @returns {Promise<void>}
     */
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
    /**
     * 读取初始化数据
     */
    initData() {
      this.engine = JSON.parse(decodeURIComponent(this.$cookies.get('searchEngine')));
      // cookie中储存的是string，直接赋值会出现bug
      this.showCollect = this.$cookies.get('showCollect') === 'true';
      this.collectData = JSON.parse(decodeURIComponent(this.$cookies.get('collect')));
    },
    /**
     * 首页时间定时器刷新
     */
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
    /**
     * 设置是否显示收藏夹
     */
    showCollectChange() {
      this.$cookies.set('showCollect', this.showCollect, -1);
    },
    /**
     * 完成设置，刷新页面
     */
    doneSettings() {
      this.ShowSetting = false
      location.reload();
    },
    /**
     * 删除所选链接
     */
    deleteSelectedCollect() {
      let selectionRows = this.$refs.collectTable.getSelectionRows();
      console.log('selectionRows', selectionRows);
      if (selectionRows.length === 0) {
        ElNotification({
          title: '提示',
          message: '未选中任何链接。',
          type: 'info',
        })
        return;
      }
      // 遍历删除链接对象
      for (let i = 0; i < selectionRows.length; i++) {
        let index = this.collectData.findIndex(item => item.name === selectionRows[i].name);
        this.collectData.splice(index, 1);
        // 保存到cookie
        this.$cookies.set('collect', encodeURIComponent(JSON.stringify(this.collectData)), -1);
      }
    },
    showAddCollectDialog() {
      this.addCollectName = '';
      this.addCollectUrl = '';
      this.showAddCollect = true;
    },
    /**
     * 添加或者修改收藏夹链接
     */
    saveAddCollect() {
      // 处于修改状态
      if (!this.isAdd) {
        this.collectData[this.editIndex].name = this.addCollectName;
        this.collectData[this.editIndex].url = this.addCollectUrl;
        // 保存到cookie
        this.$cookies.set('collect', encodeURIComponent(JSON.stringify(this.collectData)), -1);
        this.showAddCollect = false;
        this.isAdd = true;
        return;
      }
      // 处于添加状态
      let addCollect = {
        name: this.addCollectName,
        url: this.addCollectUrl,
      }
      this.collectData.push(addCollect);
      // 保存到cookie
      this.$cookies.set('collect', encodeURIComponent(JSON.stringify(this.collectData)), -1);
      this.showAddCollect = false;
    },
    editCollect(index) {
      this.isAdd = false;
      let data = this.collectData[index];
      this.addCollectName = data.name;
      this.addCollectUrl = data.url;
      this.editIndex = index;
      this.showAddCollect = true;
    },
    deleteCollect(index) {
      this.collectData.splice(index, 1);
      // 保存到cookie
      this.$cookies.set('collect', encodeURIComponent(JSON.stringify(this.collectData)), -1);
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