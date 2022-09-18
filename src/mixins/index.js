export const mixin = {
  methods: {
    //自定义提示信息
    notify(title, type) {
      this.$notify({
        title: title,
        type: type
      });
    },
    //根据相对地址获取绝对地址
    getUrl(url) {
      return `${this.$store.state.HOST}${url}`;
    },
    //根据性别转换中文
    changeSex(value) {
      if (value == 0) {
        return "女";
      } else if (value == 1) {
        return "男";
      } else if (value == 2) {
        return "组合";
      } else if (value == 3) {
        return "不明";
      }
      return value;
    },
    //获取生日
    attachBirth(val) {
      return String(val).substring(0, 10);
    },
    //上传图片前校验
    beforeAvatorUpload(file) {
      const isJpg = file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpg) {
        this.$message.error("上传图像只能是jpg或png格式");
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传图像只能小于2M");
        return false;
      }
      return true;
    },
    //上传图片成功后
    handleAvatorSuccess(res) {
      let _this = this;
      if (res.code == 1) {
        _this.findAll();
        _this.notify("上传成功", "success");
      } else {
        _this.notify("上传失败", "failed");
      }
    },
    //弹出删除框
    handleDelete(id) {
      this.idx = id;
      let _this = this;
      //弹框js
      swal({
        title: "确定删除吗?",
        text: "删除不可恢复...您确定要删除id是" + id + "的数据吗?",
        icon: "warning",
        buttons: true,
        dangerMode: true
      }).then(willDelete => {
        if (willDelete) {
          _this.handleDel();
        } else {
          swal("你后悔了吧,哈哈哈^_^");
        }
      });
    },
    // 把已经选择的项赋值给multipleSelection
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 批量删除已经选择的项
    delAll() {
      for (let item of this.multipleSelection) {
        this.handleDelete(item.id);
        //this.handleDel();
      }
      this.multipleSelection = [];
    },
  }
};
