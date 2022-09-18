<template>
<div class="table">
    <div class="crumbs">
        <em class="el-icon-tickets"></em>歌曲信息
    </div>
    <div class="container">
        <div class="handle-box">
            <!-- 批量删除按钮 -->
            <el-button type="primary" size="mini" plain @click="delAll">批量删除</el-button>
            <!-- 搜索框 -->
            <el-input v-model="search_word" size="mini" placeholder="请输入歌曲名" class="handle-input"></el-input>
            <!-- 添加按钮 -->
            <el-button type="primary" size="mini" plain @click="centerDialogVisible = true">添加歌曲</el-button>
        </div>
    </div>
    <el-table :data="data" style="width: 100%" height="700px" size="mini" @selection-change="handleSelectionChange">
        <!-- 添加批量删除多选框 -->
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="id" label="序号" width="50" align="center">
        </el-table-column>
        <el-table-column label="歌曲图片" width="110" align="center">
            <template slot-scope="scope">
                <div class="song-img">
                    <img :src="getUrl(scope.row.pic)" stype="width:100%" height="100px" alt="" />
                </div>
                <!-- 播放按钮 -->
                <div class="play" @click="setSongUrl(scope.row.url,scope.row.name)">
                    <div v-if="toggle==scope.row.name">
                        <svg class="icon">
                            <use xlink:href="#icon-zanting"></use>
                        </svg>
                    </div>
                    <div v-if="toggle!=scope.row.name">
                        <svg class="icon">
                            <use xlink:href="#icon-bofanganniu"></use>
                        </svg>
                    </div>
                </div>
            </template>
        </el-table-column>
        <el-table-column prop="name" label="歌手-歌名" width="120" align="center">
        </el-table-column>
        <el-table-column prop="introduction" label="专辑" width="150" align="center">
        </el-table-column>

        <el-table-column label="歌词" align="center">
            <template slot-scope="scope">
                <ul style="height:100px;overflow:scroll;width: 200px;">
                    <li v-for="(item,index) in parseLyrit(scope.row.lyric)" :key="index">
                        {{item}}
                    </li>
                </ul>
            </template>
        </el-table-column>

        <el-table-column label="资源更新" align="center" width="100">
            <template slot-scope="scope">
                <el-upload :action="uploadUrl(scope.row.id)" :before-upload="beforeAvatorUpload" :on-success="handleAvatorSuccess">
                    <el-button size="mini" type="primary" round>更新图片</el-button>
                </el-upload>
                <br />
                <el-upload :action="uploadSongUrl(scope.row.id)" :before-upload="beforeSongUpload" :on-success="handleSongSuccess">
                    <el-button size="mini" type="primary" round>更新歌曲</el-button>
                </el-upload>
            </template>
        </el-table-column>

        <el-table-column label="操作" width="150" align="center">
            <template slot-scope="scope">
                <!-- 修改歌手 -->
                <el-button size="mini" @click="handleEdit(scope.row)" type="success" round>编辑</el-button>
                <!-- 删除歌手 -->
                <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)" round>删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <!-- 页面分页部分 -->
    <div class="pagination">
        <el-pagination background layout="total, prev, pager, next" :current-page="currentPage" :page-size="pageSize" :total="tableData.length" @current-change="handleCurrentChange">
        </el-pagination>
    </div>

    <!-- 弹出提示框(添加歌手表单) -->
    <el-dialog title="添加歌曲" :visible.sync="centerDialogVisible" width="400px" center>
        <!-- 添加歌手表单 -->
        <el-form ref="registerForm" :model="registerForm" label-width="80px" action="" id="tf">
            <div>
                <label>歌名</label>
                <el-input v-model="registerForm.name" name="name"></el-input>
            </div>
            <div>
                <label>专辑</label>
                <el-input v-model="registerForm.introduction" name="introduction"></el-input>
            </div>

            <div>
                <label>歌词</label>
                <el-input v-model="registerForm.lyric" name="lyric"></el-input>
            </div>
            <div>
                <label>歌曲上传</label>
                <input type="file" name="songFile" />
            </div>
        </el-form>
        <span slot="footer">
            <el-button type="danger" plain size="mini" @click="centerDialogVisible = false">取消</el-button>
            <el-button type="primary" plain size="mini" @click="addSong">确定</el-button>
        </span>
    </el-dialog>

    <!-- 弹出提示框(编辑歌手表单) -->
    <el-dialog title="编辑歌曲" :visible.sync="editDialogVisible" width="400px" center>
        <!-- 编辑歌手表单 -->
        <el-form ref="editForm" :model="editForm" label-width="80px">
            <el-form-item prop="name" label="歌手-歌名" size="mini">
                <el-input v-model="editForm.name" placeholder="歌手-歌名"></el-input>
            </el-form-item>
            <el-form-item label="专辑" size="mini">
                <el-input v-model="editForm.introduction" placeholder="专辑"></el-input>
            </el-form-item>
            <el-form-item label="歌词" size="mini">
                <el-input v-model="editForm.lyric" placeholder="歌词" type="textarea"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer">
            <el-button type="danger" plain size="mini" @click="editDialogVisible = false">取消</el-button>
            <el-button type="primary" plain size="mini" @click="editSong">确定</el-button>
        </span>
    </el-dialog>
</div>
</template>

<script>
//引入
import {
    mapGetters
} from "vuex";
import {
    mixin
} from "../mixins/index";

import '@/assets/icons/iconfont.js';
import {
    getSongBySinger,
    updateSong,
    deleteSong
} from "../api/index";

export default {
    mixins: [mixin],
    data() {
        return {
            //歌手id
            singerId: "",
            //歌手姓名
            singerName: "",
            //弹出框
            centerDialogVisible: false,
            editDialogVisible: false,
            delVisible: false,
            //表单添加歌曲
            registerForm: {
                name: "",
                singerName: "",
                introduction: "",
                lyric: "",
            },
            //表单编辑歌曲
            editForm: {
                id: "",
                name: "",
                introduction: "",
                lyric: "",
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
            //播放器的显示图标状态
            toggle: false,
        };
    },
    //计算属性
    computed: {
        ...mapGetters([
            'isPlay'
        ]),
        //计算当前搜索表里的数据<分页后的数据>
        data() {
            return this.tableData.slice(
                (this.currentPage - 1) * this.pageSize,
                this.currentPage * this.pageSize
            );
        },
    },
    //观察者
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
        this.singerId = this.$route.query.id;
        this.singerName = this.$route.query.name;
        this.findAll();
    },
    destroyed() {
        this.$store.commit('setIsPlay', false);
    },
    methods: {
        //分页当前页改变事件函数
        handleCurrentChange(val) {
            this.currentPage = val;
        },
        //修改歌曲按钮单击事件
        handleEdit(row) {
            this.editDialogVisible = true;
            this.editForm = {
                id: row.id,
                name: row.name,
                introduction: row.introduction,
                lyric: row.lyric,
            };
        },
        //删除歌曲按钮单击事件
        handleDel() {
            deleteSong(this.idx)
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

        //添加歌曲
        addSong() {
            let _this = this;
            var form = new FormData(document.getElementById("tf"));
            form.append("singerId", this.singerId);
            form.append("name", this.singerName + "-" + form.get("name"));
            if (!form.get("lyric")) {
                form.set("lyric", "[00:00:00]暂无歌词");
            }
            //原生Ajax请求
            var req = new XMLHttpRequest();
            req.onreadystatechange = function () {
                if (req.readyState == 4 && req.status == 200) {
                    let res = JSON.parse(req.response);
                    if (res.code == 1) {
                        _this.findAll();
                        _this.registerForm = {};
                        _this.notify(res.msg, "success");
                    } else {
                        _this.notify(res.msg, "failed");
                    }
                }
            };
            req.open("post", `${_this.$store.state.HOST}/song/add`, false);
            req.send(form);

            this.centerDialogVisible = false;
        },
        //修改歌曲数据
        editSong() {
            let params = new URLSearchParams();
            params.append("id", this.editForm.id);
            params.append("name", this.editForm.name);
            params.append("introduction", this.editForm.introduction);
            params.append("lyric", this.editForm.lyric);
            updateSong(params)
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
        //查询所有歌曲
        findAll() {
            //清空数据
            this.tempData = [];
            this.tableData = [];
            getSongBySinger(this.singerId)
                .then((res) => {
                    //获取后台数据
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
            return `${this.$store.state.HOST}/song/updateSongPic?id=${id}`;
        },

        //解析歌词
        parseLyrit(text) {
            let lines = text.split("\n");
            //提取中括号中的数字
            let pattern = /\[\d{2}:\d{2}.(\d{3}|\d{2})\]/g;
            let result = [];
            for (let item of lines) {
                //把符合的内容替换成''
                let value = item.replace(pattern, '');
                result.push(value);
            }
            return result;
        },
        //上传歌曲之前校验
        beforeSongUpload(file) {
            var testMsg = file.name.substring(file.name.lastIndexOf('.') + 1);
            //判断是否是mp3或flac格式
            const extension = (testMsg == 'mp3') || (testMsg == 'flac');
            if (!extension) {
                this.$message({
                    message: '上传文件只能是mp3或flac格式',
                    type: 'error',
                });
                return false;
            }
            return true;
        },
        //上传歌曲成功后
        handleSongSuccess(res) {
            let _this = this;
            if (res.code == 1) {
                _this.findAll();
                _this.notify("上传成功", "success");
            } else {
                _this.notify("上传失败", "failed");
            }
        },
        //更新歌曲Url
        uploadSongUrl(id) {
            return `${this.$store.state.HOST}/song/updateSongUrl?id=${id}`;
        },
        //切换播放歌曲
        setSongUrl(url, name) {
            this.toggle = name;
            this.$store.commit('setUrl', this.$store.state.HOST + url);
            if (this.isPlay) {
                this.$store.commit('setIsPlay', false);
            } else {
                this.$store.commit('setIsPlay', true);
            }
        },
    },

};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.song-img {
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

.play {
    position: absolute;
    z-index: 100;
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    top: 18px;
    left: 16px;
}

.icon {
    width: 2em;
    height: 2em;
    color: white;
    fill: currentColor;
    overflow: hidden;
}
</style>
