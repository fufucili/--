<script>
import { queryPageApi, addApi, queryInfoApi, updateApi, deleteApi } from '@/api/emp'
import { queryAllApi as queryAllDeptApi } from '@/api/dept'
import store from "@/store";
import { Message, MessageBox } from 'element-ui'

export default {
  data() {
    return {
      //职位列表数据
      jobs: [{ name: '班主任', value: 1 }, { name: '讲师', value: 2 }, { name: '学工主管', value: 3 }, { name: '教研主管', value: 4 }, { name: '咨询师', value: 5 }, { name: '其他', value: 6 }],
      //性别列表数据
      genders: [{ name: '男', value: 1 }, { name: '女', value: 2 }],
      //搜索表单对象
      searchEmp: { begin: '', end: '', date: [], name: '', gender: '' },
      //列表展示数据
      tableData: [],
      token: '',
      //部门列表
      depts: [],
      //复选框选择
      selectIds: [],
      //分页组件
      pagination: { currentPage: 1, pageSize: 5, total: 0 },
      //----------- 新增 / 修改 ---------------------------
      //控制新增/修改的对话框的显示与隐藏
      dialogFormVisible: false,
      //form表单label的宽度
      labelWidth: "80px",
      //表单的标题
      formTitle: '',
      //员工对象-表单数据绑定
      emp: {
        username: '',
        password: '',
        name: '',
        gender: '',
        phone: '',
        job: '',
        salary: '',
        image: '',
        entryDate: '',
        deptId: '',
        exprList: []
      },
      //表单校验规则
      rules: {
        username: [
          { required: true, message: '用户名为必填项', trigger: 'blur' },
          { min: 2, max: 20, message: '用户名长度为2-20个字', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '姓名为必填项', trigger: 'blur' },
          { min: 2, max: 10, message: '姓名长度为2-10个字', trigger: 'blur' }
        ],
        gender: [{ required: true, message: '性别为必填项', trigger: 'change' }],
        phone: [
          { required: true, message: '手机号为必填项', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/g, message: '请输入合法的手机号', trigger: 'blur' }
        ],
        salary: [
          { pattern: /^[1-9]\d*$/g, message: '请输入合法的数字', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    //加载所有的部门数据
    queryAllDept: async function()  {
      let result = await queryAllDeptApi()
      if (result.code) {
        this.depts = result.data
      }
    },
    handleSelectionChange: function(selection)  {
      this.selectIds = selection.map(item => item.id)
    },
    //每页展示记录数发生变化时触发
    handleSizeChange: function(pageSize)  {
      this.pagination.pageSize = pageSize
      this.queryPage()
    },
    //当前页码发生变化时触发
    handleCurrentChange: function(page)  {
      this.pagination.currentPage = page
      this.queryPage()
    },
    //分页条件查询
    queryPage: async function()  {
      const result = await queryPageApi(
        this.searchEmp.begin,
        this.searchEmp.end,
        this.searchEmp.gender,
        this.searchEmp.name,
        this.pagination.currentPage,
        this.pagination.pageSize
      );

      if (result.code) {
        this.tableData = result.data.rows
        this.pagination.total = result.data.total
      }
    },
    //清空搜索栏
    clear: function()  {
      this.searchEmp = { begin: '', end: '', date: [], name: '', gender: '' }
      this.queryPage()
    },
    //清空表单
    clearEmp: function()  {
      this.emp = {
        username: '',
        password: '',
        name: '',
        gender: '',
        phone: '',
        job: '',
        salary: '',
        image: '',
        entryDate: '',
        deptId: '',
        exprList: []
      }
    },
    //新增员工
    addEmp: function()  {
      this.dialogFormVisible = true
      this.formTitle = '新增员工'
      this.clearEmp()
    },
    //修改员工
    updateEmp: async function(id)  {
      this.clearEmp()
      this.dialogFormVisible = true
      let result = await queryInfoApi(id)
      if (result.code) {
        this.emp = result.data

        //处理工作经历中的时间范围
        let exprList = this.emp.exprList;
        if (exprList && exprList.length > 0) {
          exprList.forEach(expr => {
            expr.exprDate = [expr.begin, expr.end]
          })
        }
      }
    },
    //文件上传
    handleAvatarSuccess: function(response, uploadFile)  {
      console.log(uploadFile);
      this.emp.image = response.data;
    },
    beforeAvatarUpload: function(rawFile)  {
      if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
        Message.error('图片格式不支持!')
        return false
      } else if (rawFile.size / 1024 / 1024 > 10) {
        Message.error('图片大小不能超过 10 MB!')
        return false
      }
      return true
    },
    //动态添加工作经历 .
    addWorkItem: function()  {
      this.emp.exprList.push({ exprDate: [], begin: '', end: '', company: '', job: '' })
    },
    //动态删除工作经历 .
    delWorkItem: function(expr)  {
      if (this.emp.exprList) {
        const index = this.emp.exprList.indexOf(expr)
        if (index != -1) {
          this.emp.exprList.splice(index, 1)
        }
      }
    },
    //重置表单
    resetForm: function(formName)  {
      if (!formName) return
       this.$refs[formName]?.resetFields();
    },
    //-------------保存员工信息 
    save: function(formName)  {
      //表单校验
      if (!formName) return
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let api
          if (this.emp.id) {
            api = updateApi(this.emp)
          } else {
            api = addApi(this.emp)
          }

          let result = await api
          if (result.code) {
            Message.success('操作成功')
            this.dialogFormVisible = false
            this.queryPage()
          } else {
            Message.error(result.msg)
          }
        } else {
          return false
        }
      })
    },
    //------- 删除员工
    //根据ID删除单个员工
    delById: async function(id)  {
      MessageBox.confirm('您确认删除此数据吗?', '删除员工', { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' })
        .then(async ()=> {
          let result = await deleteApi(`${id}`)
          if (result.code) {
            Message.success('删除成功')
            this.queryPage()
          } else {
            Message.error(result.msg)
          }
        }).catch(() => {
          Message.info('取消删除')
        })
    },
    //批量删除员工
    delByIds: async function()  {
      MessageBox.confirm('您确认删除此数据吗?', '删除员工', { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' })
        .then(async () => {
          let result = await deleteApi(this.selectIds.join(','))
          if (result.code) {
            Message.success('删除成功')
            this.queryPage()
          } else {
            Message.error(result.msg)
          }
        }).catch(() => {
          Message.info('取消删除')
        })
    }
  },
  mounted: function()  {
    this.queryPage()
    this.queryAllDept()
    this.token = store.getters.userInfo.token;
  },
  //监听searchEmp的date属性
  watch: {
    'searchEmp.date': {
      handler(newVal, oldVal) {
        console.log(`newVal : ${newVal} ; oldVal: ${oldVal} `)
        if (newVal.length > 0) {
          console.log('-----------');
          this.searchEmp.begin = newVal[0]
          this.searchEmp.end = newVal[1]
        } else {
          console.log('==========');
          this.searchEmp.begin = ''
          this.searchEmp.end = ''
        }
      }
    },
    //监听-emp员工对象中的工作经历数据
    emp: {
      handler() {
        if (this.emp.exprList) {
          this.emp.exprList.forEach(expr => {
            expr.begin = expr.exprDate[0]
            expr.end = expr.exprDate[1]
          })
        }
      },
      deep: true
    }
  }
}

</script>

<template>
  <div>
    <!-- 顶部标题 -->
    <div>
      <div id="title">员工管理</div>
      <br><br>
    </div>

    <el-row>
      <el-col :span="4">
        <!-- 功能按钮 -->
        <el-button type="success" @click="addEmp(); resetForm('empFromRef')">+ 新增员工</el-button>
        <el-button type="danger" @click="delByIds()">- 批量删除</el-button>
      </el-col>
      <el-col :span="20">
        <!-- 条件搜索表单 -->
        <el-form :inline="true" :model="searchEmp" class="demo-form-inline">
          <el-form-item label="姓名">
            <el-input v-model="searchEmp.name" placeholder="请输入员工姓名" />
          </el-form-item>

          <el-form-item label="性别">
            <el-select v-model="searchEmp.gender" placeholder="请选择">
              <el-option v-for="gender in genders" :label="gender.name" :value="gender.value" :key="gender.value" />
            </el-select>
          </el-form-item>

          <el-form-item label="入职时间">
            <el-date-picker v-model="searchEmp.date" type="daterange" range-separator=" 至 " start-placeholder="开始时间"
              end-placeholder="结束时间" value-format="yyyy-MM-dd" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="queryPage()">查询</el-button>
            <el-button type="info" @click="clear()">清空</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    

    <!-- 列表展示 -->
    <el-table :data="tableData" border style="width: 100%" fit @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="姓名" align="center" width="130px" />
      <el-table-column label="性别" align="center" width="100px">
        <template #default="scope">
          {{ scope.row.gender == 1 ? '男' : '女' }}
        </template>
      </el-table-column>
      <el-table-column prop="image" label="头像" align="center">
        <template #default="scope">
          <img :src="scope.row.image" height="40">
        </template>
      </el-table-column>
      <el-table-column prop="dept.name" label="所属部门" align="center" />
      <el-table-column prop="job" label="职位" align="center" width="100px">
        <template #default="scope">
          <span v-if="scope.row.job == 1">班主任</span>
          <span v-else-if="scope.row.job == 2">讲师</span>
          <span v-else-if="scope.row.job == 3">学工主管</span>
          <span v-else-if="scope.row.job == 4">教研主管</span>
          <span v-else-if="scope.row.job == 5">咨询师</span>
          <span v-else>其他</span>
        </template>
      </el-table-column>
      <el-table-column prop="entryDate" label="入职时间" align="center" width="130px" />
      <el-table-column prop="updateTime" label="最后修改时间" align="center" />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button type="primary" size="small" @click="updateEmp(scope.row.id); resetForm('empFromRef')">编辑</el-button>
          <el-button type="danger" size="small" @click="delById(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <br>

    <!-- 分页组件Pagination -->
    <el-pagination :current-page="pagination.currentPage" :page-size="pagination.pageSize"
      :page-sizes="[5, 10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"
      @size-change="handleSizeChange" @current-change="handleCurrentChange" />

    <!-- 新增/修改员工对话框 -->
    <el-dialog :visible.sync="dialogFormVisible" :title="formTitle" class="dialog">
      <el-form :model="emp" ref="empFromRef" :rules="rules">
        <!-- 第一行 -->
        <el-row>
          <el-col :span="11">
            <el-form-item label="用户名" :label-width="labelWidth" prop="username">
              <el-input v-model="emp.username" />
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="姓名" :label-width="labelWidth" prop="name">
              <el-input v-model="emp.name" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第二行 -->
        <el-row>
          <el-col :span="11">
            <el-form-item label="性别" :label-width="labelWidth" prop="gender">
              <el-select v-model="emp.gender" placeholder="请选择" style="width: 100%;">
                <el-option v-for="gender in genders" :label="gender.name" :value="gender.value" :key="gender.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="手机号" :label-width="labelWidth" prop="phone">
              <el-input v-model="emp.phone" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第三行 -->
        <el-row>
          <el-col :span="11">
            <el-form-item label="薪资" :label-width="labelWidth" prop="salary">
              <el-input v-model="emp.salary" />
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="入职日期" :label-width="labelWidth">
              <el-date-picker v-model="emp.entryDate" type="date" placeholder="请选择入职日期" value-format="yyyy-MM-dd"
                style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第四行 -->
        <el-row>
          <el-col :span="11">
            <el-form-item label="所属部门" :label-width="labelWidth">
              <el-select v-model="emp.deptId" placeholder="请选择" style="width: 100%;">
                <el-option v-for="dept in depts" :label="dept.name" :value="dept.id" :key="dept.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="职位" :label-width="labelWidth">
              <el-select v-model="emp.job" placeholder="请选择" style="width: 100%;">
                <el-option v-for="job in jobs" :label="job.name" :value="job.value" :key="job.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第五行 -->
        <el-row :gutter="10">
          <el-col :span="3">
            头像
          </el-col>
          <el-col :span="5">
            <el-upload class="avatar-uploader" action="/api/upload" :show-file-list="false" :headers="{ token: token }"
              :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
              <img v-if="emp.image" :src="emp.image" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-col>
        </el-row>

        <!-- 第六行 -->
        <el-row :gutter="10" style="padding-top:5px">
           <el-col :span="2" style="padding-left:10px;line-height:30px" >
            工作经历
           </el-col>
          <el-col :span="4">
            <el-button type="success" size="small" @click="addWorkItem">+ 添加工作经历</el-button>
          </el-col>
        </el-row>
        <!-- 第七...行 -->
        <el-row :gutter="5" v-for="expr in emp.exprList" :key="expr.id" style="padding-top:5px">
          <el-col :span="10">
              <el-date-picker v-model="expr.exprDate" type="daterange" range-separator="至" start-placeholder="开始时间"
                end-placeholder="结束时间" value-format="yyyy-MM-dd" size="small" />
          </el-col>

          <el-col :span="5">
              <el-input v-model="expr.company" placeholder="公司名称" size="small" />
          </el-col>

          <el-col :span="6">
              <el-input v-model="expr.job" placeholder="职位名称" size="small" />
          </el-col>

          <el-col :span="2">
              <el-button type="danger" @click="delWorkItem(expr)" size="small">- 删除</el-button>
          </el-col>
        </el-row>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false; resetForm('empFromRef')">取消</el-button>
          <el-button type="primary" @click="save('empFromRef')">保存</el-button>
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

.avatar-label{
  text-align: center;
}

.avatar-uploader .avatar {
  width: 150px;
  height: 150pxpx;
  display: block;
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 78px;
  height: 78px;
  text-align: center;
  border: 1px dashed #ccc;
  border-radius: 5px;
  line-height: 3;
}
</style>