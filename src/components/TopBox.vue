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
          <el-row align="middle" justify="center">
            <el-button class="el-col-10" @click="showEditEngine = true">设置搜索引擎
              <el-icon>
                <Edit/>
              </el-icon>
            </el-button>
            <el-button class="el-col-10" @click="showEditCollect = true">修改收藏夹内容
              <el-icon>
                <Edit/>
              </el-icon>
            </el-button>
          </el-row>
          <br>
          <input id="importJsonInput" type="file" accept=".json" style="display:none"/>
          <el-row align="middle" justify="center">
            <el-button class="el-col-10" @click="exportSettings">备份设置
              <el-icon>
                <Upload/>
              </el-icon>
            </el-button>
            <el-button class="el-col-10" @click="importSettings">导入设置
              <el-icon>
                <Download/>
              </el-icon>
            </el-button>
          </el-row>
          <br>
          <el-row align="middle">
            <el-popconfirm title="重置将会丢失所有已设置内容，请备份设置后进行操作。" @confirm="resetAllSettings"
                           confirmButtonText="确认"
                           cancelButtonText="取消" confirmButtonType="danger" cancelButtonType="default">
              <template #reference>
                <el-button class="el-col-offset-2" type="danger">恢复默认设置
                  <el-icon>
                    <Refresh/>
                  </el-icon>
                </el-button>
              </template>
            </el-popconfirm>
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
        <el-button type="primary" size="small" @click="showAddEngineDialog">添加搜索引擎</el-button>
        <el-popconfirm title="确认删除所有已选链接？" @confirm="deleteSelectedEngine" confirmButtonText="确认"
                       cancelButtonText="取消" confirmButtonType="danger" cancelButtonType="default">
          <template #reference>
            <el-button type="danger" size="small">删除所选</el-button>
          </template>
        </el-popconfirm>
        <br><br>
        <el-table ref="engineTable" :data="engineData" border style="width: 100%">
          <el-table-column type="selection" width="55"/>
          <el-table-column prop="name" label="名称" width="150"/>
          <el-table-column prop="icon" label="图标" width="150"/>
          <el-table-column prop="url" label="链接"/>
          <el-table-column fixed="right" label="操作" width="100">
            <template #default="scope">
              <el-button link type="primary" size="small" @click="editEngine(scope.$index)">修改</el-button>
              <el-popconfirm title="确认删除此链接？" @confirm="deleteEngine(scope.$index)" confirmButtonText="确认"
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
        <el-button @click="showEditEngine = false">关闭</el-button>
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
          <el-table-column fixed="right" label="操作" width="100">
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
    <!-- 搜索引擎添加链接弹窗-->
    <el-dialog
        v-model="showAddEngine"
        :title="isAdd ? '添加链接' : '修改链接'"
        width="30%">
      <div>
        <el-input placeholder="名称" v-model="addEngineName"></el-input>
        <br><br>
        <el-input placeholder="链接" v-model="addEngineUrl"></el-input>
        <br><br>
        <el-input placeholder="图标" v-model="addEngineIcon"></el-input>
      </div>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="showAddEngine = false">取消</el-button>
        <el-button type="primary" @click="saveAddEngine">保存</el-button>
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
import {Edit, Refresh, Upload, Download} from '@element-plus/icons-vue'
import {ElNotification} from 'element-plus'
import FileSaver from 'file-saver'

export default {
  name: "TopBox",
  components: {
    Edit,
    Refresh,
    Upload,
    Download,
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
      /**
       * 搜索引擎修改相关
       */
      engineData: {}, // 搜索引擎内容
      showEditEngine: false, // 显示修改搜索引擎弹窗
      showAddEngine: false,
      addEngineName: '',
      addEngineUrl: '',
      addEngineIcon: '',
      /**
       * 收藏修改相关
       */
      collectData: [], // 收藏夹数据
      showEditCollect: false, // 显示修改收藏夹弹窗
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
     * 读取初始化数据
     */
    initData() {
      this.engineData = JSON.parse(decodeURIComponent(this.$cookies.get('searchEngine')));
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
    /**
     * 多选删除搜索引擎
     */
    deleteSelectedEngine() {
      let selectionRows = this.$refs.engineTable.getSelectionRows();
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
        let index = this.engineData.findIndex(item => item.name === selectionRows[i].name);
        this.engineData.splice(index, 1);
        // 保存到cookie
        this.$cookies.set('searchEngine', encodeURIComponent(JSON.stringify(this.engineData)), -1);
      }
    },
    /**
     * 显示添加收藏夹链接对话框
     */
    showAddCollectDialog() {
      this.addCollectName = '';
      this.addCollectUrl = '';
      this.showAddCollect = true;
    },
    /**
     * 显示添加搜索引擎链接对话框
     */
    showAddEngineDialog() {
      this.addEngineName = '';
      this.addEngineUrl = '';
      this.addEngineIcon = '';
      this.showAddEngine = true;
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
    /**
     * 保存修改/添加的搜索引擎
     */
    saveAddEngine() {
      // 处于修改状态
      if (!this.isAdd) {
        this.engineData[this.editIndex].name = this.addEngineName;
        this.engineData[this.editIndex].url = this.addEngineUrl;
        this.engineData[this.editIndex].icon = this.addEngineIcon;
        // 保存到cookie
        this.$cookies.set('searchEngine', encodeURIComponent(JSON.stringify(this.engineData)), -1);
        this.showAddEngine = false;
        this.isAdd = true;
        return;
      }
      // 处于添加状态
      let addEngine = {
        name: this.addEngineName,
        url: this.addEngineUrl,
        icon: this.addEngineIcon,
      }
      this.engineData.push(addEngine);
      // 保存到cookie
      this.$cookies.set('searchEngine', encodeURIComponent(JSON.stringify(this.engineData)), -1);
      this.showAddEngine = false;
    },
    /**
     * 修改收藏夹链接
     * @param index
     */
    editCollect(index) {
      this.isAdd = false;
      let data = this.collectData[index];
      this.addCollectName = data.name;
      this.addCollectUrl = data.url;
      this.editIndex = index;
      this.showAddCollect = true;
    },
    /**
     * 修改搜索引擎链接
     * @param index
     */
    editEngine(index) {
      this.isAdd = false;
      let data = this.engineData[index];
      this.addEngineName = data.name;
      this.addEngineUrl = data.url;
      this.addEngineIcon = data.icon;
      this.editIndex = index;
      this.showAddEngine = true;
    },
    /**
     * 删除收藏夹链接
     * @param index
     */
    deleteCollect(index) {
      this.collectData.splice(index, 1);
      // 保存到cookie
      this.$cookies.set('collect', encodeURIComponent(JSON.stringify(this.collectData)), -1);
    },
    /**
     * 删除搜索引擎链接
     * @param index
     */
    deleteEngine(index) {
      this.engineData.splice(index, 1);
      // 保存到cookie
      this.$cookies.set('searchEngine', encodeURIComponent(JSON.stringify(this.engineData)), -1);
    },
    /**
     * 重置设置
     */
    resetAllSettings() {
      this.$cookies.remove('collect');
      this.$cookies.remove('useEngine');
      this.$cookies.remove('searchEngine');
      this.$cookies.remove('showCollect');
      location.reload();
    },
    /**
     * 导出设置
     */
    exportSettings() {
      let json = {
        searchEngine: this.engineData,
        collect: this.collectData,
        useEngine: this.$cookies.get('useEngine'),
        showCollect: this.showCollect,
      }
      let blob = new Blob([JSON.stringify(json)], {type: ''})
      FileSaver.saveAs(blob, 'settings.json')
    },
    /**
     * 导入设置
     */
    importSettings() {
      let file = document.getElementById('importJsonInput');
      // 触发选择文件点击事件
      file.click();
      // 监听是否选择文件
      file.addEventListener('change', () => {
        let filesList = document.querySelector('#importJsonInput').files;
        if (filesList.length == 0) { //如果取消上传，则上传文件的长度为0
          console.log("没有上传任何文件");
          return;
        } else {
          let reader = new FileReader();
          reader.readAsText(filesList[0]);
          let data;
          reader.onload = function () {
            // this.result为读取到的json字符串，需转成json对象
            data = JSON.parse(this.result);
            // 检测是否导入成功
            console.log('jsonData', data);
            // 将数据保存到cookie
            // 搜索引擎
            this.$cookies.set('searchEngine', encodeURIComponent(JSON.stringify(data.searchEngine)), -1);
            // 使用的搜索引擎
            this.$cookies.set('useEngine', data.searchEngine, -1);
            // 收藏链接
            this.$cookies.set('collect', encodeURIComponent(JSON.stringify(data.Collect)), -1);
            // 是否显示收藏链接
            this.$cookies.set('showCollect', data.showCollect, -1);
          };
        }
      });
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