<template>
  <div class="table">
    <div class="container">
      <div class="handle-box">
        <!-- 批量删除按钮 -->
        <el-button
          type="primary"
          size="mini"
          plain
          @click="delAll"
          >批量删除</el-button
        >
        <!-- 搜索框 -->
        <el-input
          v-model="search_word"
          size="mini"
          placeholder="请输入歌手名"
          class="handle-input"
        ></el-input>
        <!-- 添加按钮 -->
        <el-button
          type="primary"
          size="mini"
          plain
          @click="centerDialogVisible = true"
          >添加歌手</el-button
        >
      </div>
    </div>
    <el-table
      :data="data"
      style="width: 100%"
      height="700px"
      size="mini"
      @selection-change="handleSelectionChange"
    >
      <!-- 添加批量删除多选框 -->
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="id" label="序号" width="50" align="center">
      </el-table-column>
      <el-table-column label="歌手图片" width="110" align="center">
        <template slot-scope="scope">
          <div class="singer-img">
            <img
              :src="getUrl(scope.row.pic)"
              stype="width:100%"
              height="100px"
              alt=""
            />
          </div>
          <el-upload
            :action="uploadUrl(scope.row.id)"
            :before-upload="beforeAvatorUpload"
            :on-success="handleAvatorSuccess"
          >
            <el-button size="mini" type="primary" round>更新图片</el-button>
          </el-upload>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="120" align="center">
      </el-table-column>
      <el-table-column label="性别" width="50" align="center">
        <template slot-scope="scope">
          {{ changeSex(scope.row.sex) }}
        </template>
      </el-table-column>
      <el-table-column label="生日" width="120" align="center">
        <template slot-scope="scope">
          {{ attachBirth(scope.row.birth) }}
        </template>
      </el-table-column>
      <el-table-column prop="location" label="地区" width="100" align="center">
      </el-table-column>
      <el-table-column label="简介">
        <template slot-scope="scope">
          <p style="height: 100px; overflow: scroll">
            {{ scope.row.introduction }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="歌曲管理" width="110px" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="songEdit(scope.row.id,scope.row.name)">
            歌曲管理
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <!-- 修改歌手 -->
          <el-button
            size="mini"
            @click="handleEdit(scope.row)"
            type="success"
            round
            >编辑</el-button
          >
          <!-- 删除歌手 -->
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row.id)"
            round
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 页面分页部分 -->
    <div class="pagination">
      <el-pagination
        background
        layout="total, prev, pager, next"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="tableData.length"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>

    <!-- 弹出提示框(添加歌手表单) -->
    <el-dialog
      title="添加歌手"
      :visible.sync="centerDialogVisible"
      width="400px"
      center
    >
      <!-- 添加歌手表单 -->
      <el-form ref="registerForm" :model="registerForm" label-width="80px">
        <el-form-item prop="name" label="歌手名" size="mini">
          <el-input v-model="registerForm.name" placeholder="歌手名"></el-input>
        </el-form-item>
        <el-form-item label="性别" size="mini">
          <el-radio-group v-model="registerForm.sex">
            <el-radio :label="0">女</el-radio>
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">组合</el-radio>
            <el-radio :label="3">不明</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="birth" label="生日" size="mini">
          <el-date-picker
            v-model="registerForm.birth"
            style="width: 100%"
            type="date"
            placeholder="选择日期"
            placement="bottom-start"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="location" label="地区" size="mini">
          <el-input
            v-model="registerForm.location"
            placeholder="地区"
          ></el-input>
        </el-form-item>
        <el-form-item label="简介" size="mini">
          <el-input
            v-model="registerForm.introduction"
            placeholder="简介"
            type="textarea"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button
          type="danger"
          plain
          size="mini"
          @click="centerDialogVisible = false"
          >取消</el-button
        >
        <el-button type="primary" plain size="mini" @click="addSinger"
          >确定</el-button
        >
      </span>
    </el-dialog>

    <!-- 弹出提示框(编辑歌手表单) -->
    <el-dialog
      title="编辑歌手"
      :visible.sync="editDialogVisible"
      width="400px"
      center
    >
      <!-- 编辑歌手表单 -->
      <el-form ref="editForm" :model="editForm" label-width="80px">
        <el-form-item prop="name" label="歌手名" size="mini">
          <el-input v-model="editForm.name" placeholder="歌手名"></el-input>
        </el-form-item>
        <el-form-item label="性别" size="mini">
          <el-radio-group v-model="editForm.sex">
            <el-radio :label="0">女</el-radio>
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">组合</el-radio>
            <el-radio :label="3">不明</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="生日" size="mini">
          <el-date-picker
            v-model="editForm.birth"
            style="width: 100%"
            type="date"
            placeholder="选择日期"
            placement="bottom-start"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="location" label="地区" size="mini">
          <el-input v-model="editForm.location" placeholder="地区"></el-input>
        </el-form-item>
        <el-form-item label="简介" size="mini">
          <el-input
            v-model="editForm.introduction"
            placeholder="简介"
            type="textarea"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button
          type="danger"
          plain
          size="mini"
          @click="editDialogVisible = false"
          >取消</el-button
        >
        <el-button type="primary" plain size="mini" @click="editSinger"
          >确定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
//引入
import {
  setSinger,
  getSingerAll,
  updateSinger,
  deleteSinger,
} from "../api/index";
import { mixin } from "../mixins/index";
export default {
  mixins: [mixin],
  data() {
    return {
      //弹出框
      centerDialogVisible: false,
      editDialogVisible: false,
      delVisible: false,
      //表单添加歌手
      registerForm: {
        name: "",
        sex: 3,
        birth: "",
        location: "",
        introduction: "",
      },
      //表单编辑歌手
      editForm: {
        id: "",
        name: "",
        sex: 3,
        birth: "",
        location: "",
        introduction: "",
      },
      //歌手列表
      tableData: [],
      tempData: [],
      //搜索框
      search_word: "",
      //每页显示数据
      pageSize: 5,
      //当前页
      currentPage: 1,
      //删除时当前选择项
      idx: -1,
      //多选框项目选中
      multipleSelection: [],
    };
  },
  computed: {
    //计算当前搜索表里的数据<分页后的数据>
    data() {
      return this.tableData.slice(
        (this.currentPage - 1) * this.pageSize,
        this.currentPage * this.pageSize
      );
    },
  },
  watch: {
    /*监控搜索框里的值,发生变化时搜索结果table的列表内容跟着它的内容变化
     *这是遍历查询已经查询到的结果,不用搜索数据库,效率更高
     */
    /* 类似于vue的双向绑定配合歌手名模糊查询功能
     */
    search_word: function () {
      if (this.search_word == "") {
        this.tableData = this.tempData;
      } else {
        this.tableData = [];
        for (let item of this.tempData) {
          if (item.name.includes(this.search_word)) {
            this.tableData.push(item);
          }
        }
      }
    },
  },
  created() {
    this.findAll();
  },
  methods: {
    //分页当前页改变事件函数
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    //修改歌手按钮单击事件
    handleEdit(row) {
      this.editDialogVisible = true;
      this.editForm = {
        id: row.id,
        name: row.name,
        sex: row.sex,
        birth: row.birth,
        location: row.location,
        introduction: row.introduction,
      };
    },
    //删除歌手按钮单击事件
    handleDel() {
      deleteSinger(this.idx)
        .then((res) => {
          if (res.code == 1) {
            this.notify(res.msg, "success");
            this.findAll();
          } else {
            this.notify(res.msg, "failed");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    //添加歌手
    addSinger() {
      let bir = this.registerForm.birth;
      let datetime =
        bir.getFullYear() + "-" + (bir.getMonth() + 1) + "-" + bir.getDate();
      let params = new URLSearchParams();
      params.append("name", this.registerForm.name);
      params.append("sex", this.registerForm.sex);
      params.append("location", this.registerForm.location);
      params.append("birth", datetime);
      params.append("introduction", this.registerForm.introduction);
      params.append("pic", "/img/singerPic/hhh.jpg");

      setSinger(params)
        .then((res) => {
          if (res.code == 1) {
            this.notify(res.msg, "success");
            this.findAll();
          } else {
            this.notify(res.msg, "failed");
          }
        })
        .catch((err) => {
          console.log(err);
        });
      this.centerDialogVisible = false;
    },
    //修改歌手
    editSinger() {
      let bir = new Date(this.editForm.birth);
      let datetime =
        bir.getFullYear() + "-" + (bir.getMonth() + 1) + "-" + bir.getDate();
      let params = new URLSearchParams();
      params.append("id", this.editForm.id);
      params.append("name", this.editForm.name);
      params.append("sex", this.editForm.sex);
      params.append("location", this.editForm.location);
      params.append("birth", datetime);
      params.append("introduction", this.editForm.introduction);

      updateSinger(params)
        .then((res) => {
          if (res.code == 1) {
            this.notify(res.msg, "success");
            this.findAll();
          } else {
            this.notify(res.msg, "failed");
          }
        })
        .catch((err) => {
          console.log(err);
        });
      this.editDialogVisible = false;
    },
    //查询所有歌手
    findAll() {
      //清空数据
      this.tempData = [];
      this.tableData = [];
      getSingerAll()
        .then((res) => {
          this.tempData = res;
          this.tableData = res;
          this.currentPage = 1;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //更新上传图片
    uploadUrl(id) {
      return `${this.$store.state.HOST}/singer/updateSingerPic?id=${id}`;
    },
    //跳转到歌曲管理
    songEdit(id,name){
      this.$router.push({path:`/Song`,query:{id,name}});
    },
  },
};
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}
.singer-img {
  width: 100%;
  height: 80px;
  border-radius: 5px;
  margin-bottom: 5px;
  overflow: hidden;
}
.handle-input {
  width: 300px;
  display: inline-block;
}
.pagination {
  display: flex;
  justify-content: center;
}
</style>