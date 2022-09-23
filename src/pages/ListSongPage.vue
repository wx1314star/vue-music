<template>
<div class="table">
    <div class="crumbs">
        <em class="el-icon-tickets"></em>歌单歌曲信息
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
    <el-table :data="tableData" style="width: 100%" height="700px" size="mini" @selection-change="handleSelectionChange">
        <!-- 添加批量删除多选框 -->
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="id" label="序号" width="50" align="center">
        </el-table-column>

        <el-table-column prop="name" label="歌手-歌名" align="center">
        </el-table-column>

        <el-table-column label="操作" width="150" align="center">
            <template slot-scope="scope">
                <!-- 删除歌曲 -->
                <el-button size="mini" type="danger" @click="handleDelete(scope.row.listSongId)" round>删除</el-button>
            </template>
        </el-table-column>
    </el-table>

    <!-- 弹出提示框(添加歌曲表单) -->
    <el-dialog title="添加歌曲" :visible.sync="centerDialogVisible" width="400px" center>
        <!-- 添加歌曲表单 -->
        <el-form ref="registerForm" :model="registerForm" label-width="80px" action="" id="tf">
            <el-form-item prop="singerName" label="歌手名" size="mini">
                <el-input v-model="registerForm.singerName" placeholder="歌手名"></el-input>
            </el-form-item>
            <el-form-item prop="songName" label="歌曲名" size="mini">
                <el-input v-model="registerForm.songName" placeholder="歌曲名"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer">
            <el-button type="danger" plain size="mini" @click="centerDialogVisible = false">取消</el-button>
            <el-button type="primary" plain size="mini" @click="getSongId">确定</el-button>
        </span>
    </el-dialog>

</div>
</template>

<script>
//引入

import {
    mixin
} from "../mixins/index";

import {
    getSongBySonger,
    getSongBySongName,
    listSongDetail,
    addListSong,
    deleteListSong
} from "../api/index";

export default {
    mixins: [mixin],
    data() {
        return {
            //弹出框
            centerDialogVisible: false,
            delVisible: false,
            //表单添加歌曲
            registerForm: {
                singerName: "",
                songName: "",
            },
            //歌手和歌曲列表
            tableData: [],
            tempData: [],
            //搜索框
            search_word: "",
            //删除时当前选择项
            idx: -1,
            //多选框项目选中
            multipleSelection: [],
            //歌单ID
            songListId: ""
        };
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
        this.songListId = this.$route.query.id;
        this.findAll();
    },
    methods: {
        //添加歌曲前的准备,获取歌曲id
        getSongId() {
            let _this = this;
            var songOfName = _this.registerForm.singerName + "-" + _this.registerForm.songName;
            getSongBySongName(songOfName)
                .then((res) => {
                    _this.addSong(res[0].id);
                }).catch((err) => {
                    console.log(err);
                })
        },
        //添加歌曲
        addSong(songId) {
            let _this = this;
            let params = new URLSearchParams();
            params.append("songId", songId);
            params.append("songListId", this.songListId);

            //提交数据到后端
            addListSong(params)
                .then((res) => {
                    if (res.code == 1) {
                        _this.notify(res.msg, "success");
                        _this.findAll();
                    } else {
                        _this.notify(res.msg, "failed");
                    }
                })
                .catch((err) => {
                    console.log(err);
                });

            this.centerDialogVisible = false;
        },
        //查询所有歌曲
        findAll() {
            //清空数据
            this.tempData = [];
            this.tableData = [];
            listSongDetail(this.songListId)
                .then((res) => {
                    //获取后台数据
                    for (let item of res) {
                        //传入当前的listSongId,为了后续删除
                        this.getSong(item.id, item.songId);
                    }
                    this.currentPage = 1;
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        //根据歌曲ID查询歌曲列表对象,放到tempData和tableData
        getSong(listSongId, id) {
            let _this = this;
            getSongBySonger(id)
                .then((res) => {
                    //listSongId加入内容里,为后续删除
                    res.listSongId = listSongId;
                    _this.tempData.push(res);
                    _this.tableData.push(res);
                }).catch((err) => {
                    console.log(err);
                })
        },
        //删除歌曲按钮单击事件
        handleDel() {
            deleteListSong(this.idx)
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
