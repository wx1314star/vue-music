<template>
  <div class="header">
    <!-- 折叠图片 -->
    <div class="collapse-btn" @click="collapseChange">
      <em class="el-icon-menu"></em>
    </div>
    <div class="logo">music后台管理</div>
    <div class="header-right">
      <!-- 全屏按钮 -->
      <div class="btn-fullscreen" @click="handleFullScreen">
        <el-tooltip
          :content="fullscreen ? '取消全屏' : '全屏'"
          placement="bottom"
        >
          <em class="el-icon-rank"></em>
        </el-tooltip>
      </div>
      <!-- 用户头像 -->
      <div class="user-avator">
        <img src="../assets/images/user.jpg" alt="" />
      </div>
      <!-- 退出登录 -->
      <el-dropdown class="user-name" trigger="click" @command="handleCommand">
        <span class="el-dropdown-link">
          {{ userName }}
          <em class="el-icon-caret-bottom"></em>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import bus from "../assets/js/bus";
export default {
  data() {
    return {
      collapse: false,
      fullscreen: false,
    };
  },
  computed: {
    userName() {
      return localStorage.getItem("userName");
    },
  },
  methods: {
    //侧边栏折叠
    collapseChange() {
      this.collapse = !this.collapse;
      bus.$emit("collapse", this.collapse);
    },
    //全屏事件
    handleFullScreen() {
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
          //safari.chrome
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
          //firefox
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
          //IE
        } else if (document.msExitFullScreen) {
          document.msExitFullScreen();
        }
      } else {
        let element = document.documentElement;
        if (element.requestFullscreen) {
          element.requestFullscreen();
          //safari.chrome
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
          //firefox
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
          //IE
        } else if (element.msRequestFullScreen) {
          element.msRequestFullScreen();
        }
      }
      this.fullscreen = !this.fullscreen;
    },
    //退出登录
    handleCommand(command) {
      if (command == "logout") {
        localStorage.removeItem("userName");
        this.$router.push("/");
      }
    },
  },
};
</script>

<style scoped>
.header {
  position: relative;
  background-color: #253041;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 22px;
  color: #fff;
}
.collapse-btn {
  float: left;
  padding: 0 21px;
  cursor: pointer;
  line-height: 70px;
}
.header .logo {
  float: left;
  line-height: 70px;
}

.header-right {
  float: right;
  padding-right: 50px;
  display: flex;
  height: 70px;
  align-items: center;
}
.btn-fullscreen {
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
}
.user-avator {
  margin-left: 20px;
}

.user-avator img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.user-name {
  margin-left: 10px;
}
.el-dropdown-link {
  color: #fff;
  cursor: pointer;
}
</style>