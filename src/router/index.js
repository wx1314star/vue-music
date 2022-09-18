import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  //去掉默认'#'号
  mode: 'history',
  //打包文件夹根目录
  //base: '/dist/', 
  routes: [
    {
      path: "/",
      name: "Login",
      component: resolve => require(["../pages/Login.vue"], resolve)
    },
    {
      path: "/Home",
      name: "Home",
      component: resolve => require(["../components/Home.vue"], resolve),
      children:[
        {
          path: "/Info",
          name: "InfoPage",
          component: resolve => require(["../pages/InfoPage.vue"], resolve)
        },
        {
          path: "/Consumer",
          name: "ConsumerPage",
          component: resolve => require(["../pages/ConsumerPage.vue"], resolve)
        },
        {
          path: "/Singer",
          name: "SingerPage",
          component: resolve => require(["../pages/SingerPage.vue"], resolve)
        },
        {
          path: "/SongList",
          name: "SongListPage",
          component: resolve => require(["../pages/SongListPage.vue"], resolve)
        },
        {
          path: "/Song",
          name: "SongPage",
          component: resolve => require(["../pages/SongPage.vue"], resolve)
        },
      ]
    }, 
  ]
});
