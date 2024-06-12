<script>
import {
  queryAllApi,
  addApi,
  queryInfoApi,
  updateApi,
  deleteApi,
} from "@/api/dept";
import { Message, MessageBox } from "element-ui";
export default {
  data() {
    return {
      //列表数据
      tableData: [],
      //控制新增与修改的对话框的显示与隐藏
      dialogFormVisible: false,
      //控制新增与修改的对话框的标题
      formTitle: "",
      //表单数据绑定对象
      dept: { name: "" },
      //表单校验规则
      rules: {
        name: [
          { required: true, message: "请输入部门名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "部门名称的长度在2-10之间",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    //动态加载数据
    queryAll: async function()  {
      const result = await queryAllApi();
      this.tableData = result.data;
    },
    //新增方法
    add: function()  {
      this.dialogFormVisible = true;
      this.formTitle = "新增部门";
      this.dept = { name: "" };
    },
    //重置表单校验信息
    resetForm: function(formName)  {
      if (!formName) return;
      this.$refs[formName].resetFields();
    },
    save: async function(formName)  {
      //表单校验
      if (!formName) return;
      
      this.$refs[formName].validate(async  (valid)=>  {
        if (valid) {
          //保存部门数据, 根据ID判断, 如果存在ID执行更新, 不存在ID执行新增
          let result;
          if (this.dept.id) {
            result = await updateApi(this.dept);
          } else {
            result = await addApi(this.dept);
          }

          if (result.code) {
            Message.success("操作成功");
          } else {
            Message.error(result.msg);
          }
          this.dialogFormVisible = false;
          this.queryAll();
        }
      });
    },
    //修改方法-查询回显
    update: async function(id)  {
      this.dialogFormVisible = true;
      this.formTitle = "修改部门";
      this.dept = { name: "" };

      //根据ID查询回显数据
      const result = await queryInfoApi(id);
      this.dept = result.data;
    },
    //删除方法
    del: function(id)  {
      MessageBox.confirm("您确认删除此数据吗?", "删除部门", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let result = await deleteApi(id);
          if (result.code) {
            Message.success("删除成功");
            this.queryAll();
          } else {
            Message.error(result.msg);
          }
        })
        .catch(() => {
          Message.info("取消删除");
        });
    },
  },
  //钩子函数
  mounted: function()  {
    this.queryAll();
  },
};
</script>

<template>
  <div>
    <!-- 顶部标题 -->
    <div>
      <div id="title">部门管理</div> <br><br>
    </div>

    <el-row>
      <el-col :span="24">
        <el-button type="primary" style="float: left;margin-bottom:20px;" @click="add();resetForm('deptFormRef');"> + 新增部门</el-button> 
      </el-col>
    </el-row>

    <!-- 表格数据展示 -->
    <el-table :data="tableData" border style="width: 100%" fit>
      <el-table-column type="index" label="序号" width="150px" align="center" />
      <el-table-column prop="name" label="部门名称" align="center" />
      <el-table-column prop="updateTime" label="最后修改时间" align="center" />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            @click=" update(scope.row.id); resetForm('deptFormRef'); " >修改</el-button >
          <el-button type="danger" size="small" @click="del(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 添加、修改Dialog -->
    <el-dialog  :visible.sync="dialogFormVisible"  :title="formTitle"  align-center  width="30%" >
      <el-form :model="dept" :rules="rules" ref="deptFormRef">
        <el-form-item label="部门名称" label-width="80px" prop="name">
          <el-input v-model="dept.name" autocomplete="off" />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button
            @click="
              dialogFormVisible = false;
              resetForm('deptFormRef');
            "
            >取消</el-button
          >
          <el-button type="primary" @click="save('deptFormRef')">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
#title {
  font-size: 20px;
  font-weight: 600;
}
</style>