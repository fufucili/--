<script>
import {
  addApi,
  deleteApi,
  queryInfoApi,
  queryPageApi,
  updateApi,
} from "@/api/clazz";
import { queryAllApi as queryAllEmpApi } from "@/api/emp";
import { Message, MessageBox } from "element-ui";

export default {
  data() {
    return {
      //学科列表数据
      subjects: [
        { name: "Java", value: 1 },
        { name: "前端", value: 2 },
        { name: "大数据", value: 3 },
        { name: "Python", value: 4 },
        { name: "Go", value: 5 },
        { name: "嵌入式", value: 6 },
      ],
      //搜索表单对象
      searchClazz: { begin: "", end: "", date: [], name: "" },
      //列表展示数据
      tableData: [],
      //所有的员工数据
      emps: [],
      //分页组件
      pagination: { currentPage: 1, pageSize: 10, total: 0 },
      //----------- 新增 / 修改 ---------------------------
      //控制新增/修改的对话框的显示与隐藏
      dialogFormVisible: false,
      //form表单label的宽度
      labelWidth: 80,
      //表单的标题
      formTitle: "",
      //员工对象-表单数据绑定
      clazz: {
        id: "",
        name: "",
        room: "",
        beginDate: "",
        endDate: "",
        subject: "",
        masterId: "",
      },
      rules: {
        name: [
          { required: true, message: "班级名称为必填项", trigger: "blur" },
          { min: 4, max: 30, message: "用户名长度为4-30个字", trigger: "blur" },
        ],
        room: [
          {
            min: 1,
            max: 20,
            message: "班级教室长度为1-20个字",
            trigger: "blur",
          },
        ],
        beginDate: [
          { required: true, message: "开课时间为必填项", trigger: "change" },
        ],
        endDate: [
          { required: true, message: "结课时间为必填项", trigger: "change" },
        ],
        subject: [
          { required: true, message: "学科为必填项", trigger: "change" },
        ],
      },
    };
  },
  methods: {
    //加载所有的员工数据
    queryAllEmp1: async function() {
      let result = await queryAllEmpApi();
      if (result.code) {
        this.emps = result.data;
      }
    },
    //每页展示记录数发生变化时触发
    handleSizeChange: function(pageSize)  {
      this.pagination.pageSize = pageSize;
      this.queryPage();
    },
    //当前页码发生变化时触发
    handleCurrentChange: function(page)  {
      this.pagination.currentPage = page;
      this.queryPage();
    },
    //分页条件查询
    queryPage: async function()  {
      const result = await queryPageApi(
        this.searchClazz.begin,
        this.searchClazz.end,
        this.searchClazz.name,
        this.pagination.currentPage,
        this.pagination.pageSize
      );

      if (result.code) {
        this.tableData = result.data.rows;
        this.pagination.total = result.data.total;
      }
    },
    //清空搜索栏
    clear: function()  {
      this.searchClazz = { begin: "", end: "", date: [], name: "" };
      this.queryPage();
    },
    //清空表单
    clearClazz: function()  {
      this.clazz = {
        id: "",
        name: "",
        room: "",
        beginDate: "",
        endDate: "",
        subject: "",
        masterId: "",
      };
    },
    //新增班级
    addClazz: function()  {
      this.dialogFormVisible = true;
      this.formTitle = "新增班级";
      this.clearClazz();
    },
    //修改班级
    updateClazz: async function (id)  {
      this.clearClazz();
      this.dialogFormVisible = true;
      let result = await queryInfoApi(id);
      if (result.code) {
        this.clazz = result.data;
      }
    },
    //重置表单
    resetForm: function(formName)  {
      if (!formName) return;
      this.$refs[formName].resetFields();
    },
    //-------------保存班级信息
    save: function(formName)  {
      console.log("clazzForm: " + this.clazz);
      // debugger;
      //表单校验
      if (!formName) return;
      this.$refs[formName].validate(async (valid)=>  {
        if (valid) {
          let api;
          if (this.clazz.id) {
            api = updateApi(this.clazz);
          } else {
            api = addApi(this.clazz);
          }
          let result = await api;
          if (result.code) {
            Message.success("操作成功");
            this.dialogFormVisible = false;
            this.queryPage();
          } else {
            Message.error(result.msg);
          }
        } else {
          console.log("valid: " + valid);

          return false;
        }
      });
    },
    //------- 删除班级
    //根据ID删除单个班级
    delById: async function(id)  {
      MessageBox.confirm("您确认删除此数据吗?", "删除班级", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async()=>  {
          let result = await deleteApi(id);
          if (result.code==1) {
            Message.success("删除成功");
            this.queryPage();
          } else {
            Message.error(result.msg);
          }
        }).catch(() => {
          Message.info("取消删除");
        });
    },
    //解析状态
    parseStatus:function(row){
        let beginDate = new Date(row.beginDate);
        let endDate = new Date(row.endDate);
        if(new Date()-beginDate<0){
            return '未开班';
        }else if(new Date()-endDate<=0){
            return '已开班'
        }else{
            return '已结课'
        }
    }
  },
  //钩子函数 - 页面加载时触发
  mounted: function() {
    this.queryPage()
    this.queryAllEmp1();
  },
  //监听searchEmp的date属性
  watch: {
    "searchClazz.date": {
      handler(newVal, oldVal) {
        console.log(`newVal : ${newVal} ; oldVal: ${oldVal} `);
        if (newVal.length > 0) {
          console.log("-----------");
          this.searchClazz.begin = newVal[0];
          this.searchClazz.end = newVal[1];
        } else {
          console.log("==========");
          this.searchClazz.begin = "";
          this.searchClazz.end = "";
        }
      },
    },
  },
};
</script>

<template>
  <div>
    <!-- 顶部标题 -->
    <div>
      <div id="title">班级管理</div>
      <br />
    </div>

    <el-row type="flex">
      <el-col :span="1">
      <!-- 功能按钮 -->
        <el-button  type="success" @click="addClazz();resetForm('clazzFormRef');">+ 新增班级</el-button>
      </el-col>
      <el-col :span="23">
        <!-- 条件搜索表单 -->
        <el-form :inline="true" :model="searchClazz" class="demo-form-inline">
          <el-form-item label="班级名称">
            <el-input v-model="searchClazz.name" placeholder="请输入班级名称" />
          </el-form-item>

          <el-form-item label="结课时间">
            <el-date-picker
              v-model="searchClazz.date"
              type="daterange"
              range-separator=" 至 "
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="pagination.currentPage=1;queryPage()">查询</el-button>
            <el-button type="info" @click="clear()">清空</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- 列表展示 -->
    <el-table :data="tableData" border style="width: 100%" fit>
      <el-table-column type="index" label="序号" width="55" align="center" />
      <el-table-column
        prop="name"
        label="班级名称"
        align="center"
        width="200px"
      />
      <el-table-column
        prop="room"
        label="班级教室"
        align="center"
        width="100px"
      />
      <el-table-column
        prop="emp.name"
        label="班主任"
        align="center"
        width="100px"
      />
      <el-table-column
        prop="beginDate"
        label="开课时间"
        align="center"
        width="150px"
      />
      <el-table-column
        prop="endDate"
        label="结课时间"
        align="center"
        width="150px"
      />
      <el-table-column prop="status" label="状态" align="center" width="130px" >
       <template slot-scope="scope">
          {{parseStatus(scope.row)}}
       </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="最后修改时间" align="center" />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            @click=" updateClazz(scope.row.id); resetForm('clazzFormRef'); " >编辑</el-button >
          <el-button type="danger" size="small" @click="delById(scope.row.id)"  >删除</el-button >
        </template>
      </el-table-column>
    </el-table>
    <br />

    <!-- 分页组件Pagination -->
    <el-pagination
      :current-page="pagination.currentPage"
      :page-size="pagination.pageSize"
      :page-sizes="[5, 10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 新增/修改员工对话框 -->
    <el-dialog :visible.sync="dialogFormVisible" :title="formTitle" width="35%">
      <el-form :model="clazz" ref="clazzFormRef" :rules="rules">
        <el-form-item label="班级名称" :label-width="labelWidth" prop="name">
          <el-input v-model="clazz.name" placeholder="请输入班级名称" />
        </el-form-item>

        <el-form-item label="班级教室" :label-width="labelWidth" prop="room">
          <el-input v-model="clazz.room" placeholder="请输入班级教室" />
        </el-form-item>

        <el-form-item
          label="开课时间"
          :label-width="labelWidth"
          prop="beginDate"
        >
          <el-date-picker
            v-model="clazz.beginDate"
            type="date"
            placeholder="请选择开课时间"
            value-format="yyyy-MM-dd"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="结课时间" :label-width="labelWidth" prop="endDate">
          <el-date-picker
            v-model="clazz.endDate"
            type="date"
            placeholder="请选择结课时间"
            value-format="yyyy-MM-dd"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="班主任" :label-width="labelWidth">
          <el-select
            v-model="clazz.masterId"
            placeholder="请选择班主任"
            style="width: 100%"
          >
            <el-option
              v-for="emp in emps"
              :label="emp.name"
              :value="emp.id"
              :key="emp.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="学科" :label-width="labelWidth" prop="subject">
          <el-select
            v-model="clazz.subject"
            placeholder="请选择学科"
            style="width: 100%"
          >
            <el-option
              v-for="sub in subjects"
              :label="sub.name"
              :value="sub.value"
              :key="sub.value"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible=false;resetForm('clazzFormRef');" >取消</el-button>
          <el-button type="primary" @click="save('clazzFormRef')">保存</el-button>
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