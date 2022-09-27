<template>
<div class="table">
    <div class="container">
        <div class="handle-box">
            <!-- 批量删除按钮 -->
            <el-button type="primary" size="mini" plain @click="delAll">批量删除</el-button>
            <!-- 搜索框 -->
            <el-input v-model="search_word" size="mini" placeholder="筛选相关用户" class="handle-input"></el-input>
            <!-- 添加按钮 -->
            <el-button type="primary" size="mini" plain @click="centerDialogVisible = true">添加新用户</el-button>
        </div>
    </div>
    <el-table :data="data" style="width: 100%" height="700px" size="mini" @selection-change="handleSelectionChange">
        <!-- 添加批量删除多选框 -->
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="id" label="序号" width="50" align="center">
        </el-table-column>
        <el-table-column label="用户头像" width="110" align="center">
            <template slot-scope="scope">
                <div class="consumer-img">
                    <img :src="getUrl(scope.row.avator)" stype="width:100%" height="100px" alt="" />
                </div>
                <el-upload :action="uploadUrl(scope.row.id)" :before-upload="beforeAvatorUpload" :on-success="handleAvatorSuccess">
                    <el-button size="mini" type="primary" round>更新头像</el-button>
                </el-upload>
            </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名" width="120" align="center">
        </el-table-column>

        <el-table-column label="性别" width="50" align="center">
            <template slot-scope="scope">
                {{ changeSex(scope.row.sex) }}
            </template>
        </el-table-column>
        <el-table-column prop="phoneNum" label="手机号" width="120" align="center">
        </el-table-column>
        <el-table-column prop="email" label="电子邮箱" width="240" align="center">
        </el-table-column>
        <el-table-column label="生日" width="120" align="center">
            <template slot-scope="scope">
                {{ attachBirth(scope.row.birth) }}
            </template>
        </el-table-column>
        <el-table-column prop="introduction" label="签名" align="center"></el-table-column>
        <el-table-column prop="location" label="地区" width="100" align="center">
        </el-table-column>

        <el-table-column label="操作" width="150" align="center">
            <template slot-scope="scope">
                <!-- 修改用户 -->
                <el-button size="mini" @click="handleEdit(scope.row)" type="success" round>编辑</el-button>
                <!-- 删除用户 -->
                <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)" round>删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <!-- 页面分页部分 -->
    <div class="pagination">
        <el-pagination background layout="total, prev, pager, next" :current-page="currentPage" :page-size="pageSize" :total="tableData.length" @current-change="handleCurrentChange">
        </el-pagination>
    </div>

    <!-- 弹出提示框(添加新用户表单) -->
    <el-dialog title="添加新用户" :visible.sync="centerDialogVisible" width="400px" center>
        <!-- 添加用户表单 -->
        <el-form ref="registerForm" :model="registerForm" label-width="80px" :rules="rules">
            <el-form-item prop="username" label="用户名" size="mini">
                <el-input v-model="registerForm.username" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item prop="password" label="密码" size="mini">
                <el-input type="password" v-model="registerForm.password" placeholder="密码"></el-input>
            </el-form-item>
            <el-form-item label="性别" size="mini">
                <input type="radio" name="sex" value="0" v-model="registerForm.sex" />&nbsp;女&nbsp;&nbsp;
                <input type="radio" name="sex" value="1" v-model="registerForm.sex" />&nbsp;男&nbsp;&nbsp;
            </el-form-item>
            <el-form-item prop="phoneNum" label="手机号" size="mini">
                <el-input v-model="registerForm.phoneNum" placeholder="手机号"></el-input>
            </el-form-item>
            <el-form-item prop="email" label="电子邮箱" size="mini">
                <el-input v-model="registerForm.email" placeholder="电子邮箱"></el-input>
            </el-form-item>

            <el-form-item prop="birth" label="生日" size="mini">
                <el-date-picker v-model="registerForm.birth" style="width: 100%" type="date" placeholder="选择日期" placement="bottom-start">
                </el-date-picker>
            </el-form-item>

            <el-form-item prop="introduction" label="签名" size="mini">
                <el-input v-model="registerForm.introduction" placeholder="签名"></el-input>
            </el-form-item>
            <el-form-item prop="location" label="地区" size="mini">
                <el-input v-model="registerForm.location" placeholder="地区"></el-input>
            </el-form-item>

        </el-form>
        <span slot="footer">
            <el-button type="danger" plain size="mini" @click="centerDialogVisible = false">取消</el-button>
            <el-button type="primary" plain size="mini" @click="addConsumer">确定</el-button>
        </span>
    </el-dialog>

    <!-- 弹出提示框(编辑用户表单) -->
    <el-dialog title="编辑用户" :visible.sync="editDialogVisible" width="400px" center>
        <!-- 编辑用户表单 -->
        <el-form ref="editForm" :model="editForm" label-width="80px" :rules="rules">
            <el-form-item prop="username" label="用户名" size="mini">
                <el-input v-model="editForm.username" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item prop="password" label="密码" size="mini">
                <el-input type="password" v-model="editForm.password" placeholder="密码"></el-input>
            </el-form-item>
            <el-form-item label="性别" size="mini">
                <input type="radio" name="sex" value="0" v-model="editForm.sex" />&nbsp;女&nbsp;&nbsp;
                <input type="radio" name="sex" value="1" v-model="editForm.sex" />&nbsp;男&nbsp;&nbsp;
            </el-form-item>
            <el-form-item prop="phoneNum" label="手机号" size="mini">
                <el-input v-model="editForm.phoneNum" placeholder="手机号"></el-input>
            </el-form-item>
            <el-form-item prop="email" label="电子邮箱" size="mini">
                <el-input v-model="editForm.email" placeholder="电子邮箱"></el-input>
            </el-form-item>

            <el-form-item prop="birth" label="生日" size="mini">
                <el-date-picker v-model="editForm.birth" style="width: 100%" type="date" placeholder="选择日期" placement="bottom-start">
                </el-date-picker>
            </el-form-item>

            <el-form-item prop="introduction" label="签名" size="mini">
                <el-input v-model="editForm.introduction" placeholder="签名"></el-input>
            </el-form-item>
            <el-form-item prop="location" label="地区" size="mini">
                <el-input v-model="editForm.location" placeholder="地区"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer">
            <el-button type="danger" plain size="mini" @click="editDialogVisible = false">取消</el-button>
            <el-button type="primary" plain size="mini" @click="editConsumer">确定</el-button>
        </span>
    </el-dialog>
</div>
</template>

<script>
//引入
import {
    getConsumerAll,
    setConsumer,
    updateConsumer,
    deleteConsumer
} from "../api/index";
import {
    mixin
} from "../mixins/index";
export default {
    mixins: [mixin],
    data() {
        return {
            //弹出框
            centerDialogVisible: false,
            editDialogVisible: false,
            delVisible: false,
            //表单添加用户
            registerForm: {
                username: "",
                password: "",
                sex: 1,
                phoneNum: "",
                email: "",
                birth: "",
                introduction: "",
                location: "",
            },
            //表单编辑用户
            editForm: {
                id: "",
                username: "",
                password: "",
                sex: 1,
                phoneNum: "",
                email: "",
                birth: "",
                introduction: "",
                location: "",
            },
            //用户列表
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
            rules: {
                username: [{
                    required: true,
                    message: '请输入用户名',
                    trigger: 'blur'
                }],
                password: [{
                    required: true,
                    message: '请输入密码',
                    trigger: 'blur'
                }],
                phoneNum: [{
                    required: true,
                    message: '请输入电话号码',
                    trigger: 'blur'
                }],
                email: [{
                    required: true,
                    message: '请输入电子邮箱',
                    trigger: 'blur'
                }, {
                    type: 'email',
                    message: '请输入正确的电子邮箱',
                    trigger: ['blur', 'change']
                }],
                introduction: [{
                    required: true,
                    message: '请输入签名',
                    trigger: 'blur'
                }],
                location: [{
                    required: true,
                    message: '请输入地区',
                    trigger: 'blur'
                }],
            }
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
        /* 类似于vue的双向绑定配合用户名模糊查询功能
         */
        search_word: function () {
            if (this.search_word == "") {
                this.tableData = this.tempData;
            } else {
                this.tableData = [];
                for (let item of this.tempData) {
                    if (item.username.includes(this.search_word)) {
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
        //修改用户按钮单击事件
        handleEdit(row) {
            this.editDialogVisible = true;
            this.editForm = {
                id: row.id,
                username: row.username,
                password: row.password,
                sex: row.sex,
                phoneNum: row.phoneNum,
                email: row.email,
                birth: row.birth,
                location: row.location,
                introduction: row.introduction
            };
        },
        //删除用户按钮单击事件
        handleDel() {
            deleteConsumer(this.idx)
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
            this.delVisible = false;
        },

        //添加用户
        addConsumer() {
            this.$refs['registerForm'].validate(valid => {
                if (valid) {
                    let bir = this.registerForm.birth;
                    let datetime =
                        bir.getFullYear() + "-" + (bir.getMonth() + 1) + "-" + bir.getDate();
                    let params = new URLSearchParams();
                    params.append("username", this.registerForm.username);
                    params.append("password", this.registerForm.password);
                    params.append("sex", this.registerForm.sex);
                    params.append("email", this.registerForm.email);
                    params.append("phoneNum", this.registerForm.phoneNum);
                    params.append("location", this.registerForm.location);
                    params.append("birth", datetime);
                    params.append("introduction", this.registerForm.introduction);

                    params.append("avator", "/img/avatorImages/user.jpg");

                    setConsumer(params)
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
                }
            })
        },
        //修改用户
        editConsumer() {
            this.$refs['editForm'].validate(valid => {
                if (valid) {
                    let bir = new Date(this.editForm.birth);
                    let datetime =
                        bir.getFullYear() + "-" + (bir.getMonth() + 1) + "-" + bir.getDate();
                    let params = new URLSearchParams();
                    params.append("id", this.editForm.id);
                    params.append("username", this.editForm.username);
                    params.append("password", this.editForm.password);
                    params.append("sex", this.editForm.sex);
                    params.append("email", this.editForm.email);
                    params.append("phoneNum", this.editForm.phoneNum);
                    params.append("location", this.editForm.location);
                    params.append("birth", datetime);
                    params.append("introduction", this.editForm.introduction);

                    updateConsumer(params)
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
                }
            })

        },
        //查询所有用户
        findAll() {
            //清空数据
            this.tempData = [];
            this.tableData = [];
            getConsumerAll()
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
            return `${this.$store.state.HOST}/consumer/updateConsumerPic?id=${id}`;
        },
    },
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.consumer-img {
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
