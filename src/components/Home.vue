<template>
  <div>
    <the-header></the-header>
    <the-aside></the-aside>
    <div class="content-box" :class="{ 'content-collapse': collapse }">
      <router-view />
    </div>
  </div>
</template>

<script>
import bus from "../assets/js/bus";
import TheHeader from "./TheHeader";
import TheAside from "./TheAside";
export default {
  components: {
    TheHeader,
    TheAside,
  },
  data() {
    return {
      collapse: false,
    };
  },
  created() {
    //通过bus进行组件间通信,折叠侧边栏
    bus.$on("collapse", (msg) => {
      this.collapse = msg;
    });
  },
};
</script>

<style>
</style>