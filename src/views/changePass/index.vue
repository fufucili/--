<template>
  <div class="body">
    <!-- 顶部标题 -->
    <div>
      <div id="title">修改密码</div>
      <br><br>
    </div>
    <!-- 条件搜索表单 -->
    <div class="center">
      <el-form :model="changePassForm" class="demo-form-inline" label-width="120px" width="30%">
        <el-form-item label="原始密码">
          <el-input type="password" v-model="changePassForm.password" placeholder="请输入原始密码" />
        </el-form-item>

        <el-form-item label="确认原始密码">
          <el-input type="password" v-model="changePassForm.repassword" placeholder="请再次输入原始密码" />
        </el-form-item>

        <el-form-item label="新密码">
          <el-input type="password" v-model="changePassForm.newpassword" placeholder="请输入新密码" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="changePassword()">确定</el-button>
          <el-button type="info" @click="clear()">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { changePasswordApi } from '@/api/emp'
import store from "@/store";
import { Message } from 'element-ui';

export default {
  data() {
    return {
      //声明表单数据
      changePassForm: { password: '', repassword: '', newpassword: '' },
    }

  },
  methods: {
    //修改密码
    changePassword: async function()  {
      if (this.changePassForm.password != this.changePassForm.repassword) {
        Message.error('两次输入密码不一致');
        return;
      }
      let result = await changePasswordApi(this.changePassForm)
      if (result.code) {
        store.actions.logout();
        this.$router.push('/login')
      } else {
        Message.error(result.msg)
      }
    },
    //清空表单
    clear: function()  {
      this.changePassForm = { password: '', repassword: '', newpassword: '' }
    }
  }
}
</script>

<style scoped>
#title {
  font-size: 20px;
  font-weight: 600;
}

.center {
  width: 30%;
}
</style>