<script>
import { Message, MessageBox } from 'element-ui'

export default {
  data() {
    return {
      loginName: '',
    }
  },
  methods: {
    //退出 
    logout: function()  {
      MessageBox.confirm('您确认退出登录吗?', '退出登录', { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' }).then(async ()=> {
          this.$store.commit("SET_USER_INFO",null);
          this.$router.push('/login')
        }).catch(() => {
          Message.info('取消退出')
        })
    },
    changePassword:function(){
      this.$router.push('/changePassword');
      //TODO 暂未实现
    }
  },
  mounted: function()  {
    this.loginName = this.$store.getters.userInfo.name
  }
}
</script>

<template>
  <div class="common-layout">
    <el-container>
      <!-- Header 头部区域 -->
      <el-header class="header">
        <span id="title">
          Tlias智能学习辅助系统
        </span>

        <span id="right_tool">
          <a href="javascript:void(0)" @click="changePassword">
            <el-icon>
              <Edit />
            </el-icon> 修改密码 &nbsp;&nbsp;|&nbsp;&nbsp;
          </a>
          <a href="javascript:void(0)" @click="logout">
            <el-icon>
              <SwitchButton />
            </el-icon> 退出登录【{{ loginName }}】
          </a>
        </span>
      </el-header>
      <!-- 左侧菜单及右侧主区域 -->
      <el-container>
        <!-- 左侧菜单 -->
        <el-aside width="200px" class="aside">
          <el-scrollbar>
            <el-menu router>
              <el-menu-item index="/index">
                <i class="el-icon-position"></i>
                 工作台
              </el-menu-item>
              <el-submenu index="/manage">
                <template #title>
                  <i class="el-icon-menu"></i>
                  班级学员管理
                </template>
                <el-menu-item index="/clazz">
                  <i class="el-icon-user-solid"></i>
                  班级管理
                </el-menu-item>
                <el-menu-item index="/stu">
                  <i class="el-icon-reading"></i>
                  学员管理
                </el-menu-item>
              </el-submenu>

              <el-submenu index="/system">
                <template #title>
                  <i class="el-icon-s-tools"></i>
                  系统信息管理
                </template>
                <el-menu-item index="/dept">
                  <i class="el-icon-s-help"></i>
                  部门管理
                </el-menu-item>
                <el-menu-item index="/emp">
                  <i class="el-icon-user-solid"></i>
                  员工管理
                </el-menu-item>
              </el-submenu>

              <el-submenu index="/report">
                <template #title>
                 <i class="el-icon-s-data"></i>
                  数据统计管理
                </template>
                <el-menu-item index="/empReport">
                  <i class="el-icon-info"></i>
                  员工信息统计
                </el-menu-item>
                <el-menu-item index="/stuReport">
                  <i class="el-icon-share"></i>
                  学员信息统计
                </el-menu-item>
                <el-menu-item index="/log">
                  <i class="el-icon-document"></i>
                  日志信息统计
                </el-menu-item>
              </el-submenu>
            </el-menu>
          </el-scrollbar>
        </el-aside>
        <!-- 右侧主区域 -->
        <el-main>
          <!-- 动态展示选中菜单对应的组件 -->
          <!-- <IndexView></IndexView> -->
          <RouterView></RouterView>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
.header {
  /* background-color: #474ebf; */
  background-image: linear-gradient(to right, #6947bf, #8753c9, #a260d2, #bc6edc, #d57de5);
}

#title {
  font-size: 40px;
  font-weight: bold;
  font-family: 楷体;
  color: white;
  line-height: 60px;
}

#right_tool {
  float: right;
  line-height: 60px;
}

#right_tool>a {
  text-decoration: none;
  color: white;
}

.aside {
  width: 220px;
  border: 1px solid #ccc;
  height: 90vh;
}
</style>