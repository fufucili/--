<script>
import { queryPageApi } from "@/api/log";

export default {
  data() {
    return {
      //列表展示数据
      tableData: [],
      //分页组件
      pagination: { currentPage: 1, pageSize: 15, total: 0 },
    };
  },
  methods: {
    //每页展示记录数发生变化时触发
    handleSizeChange: function (pageSize) {
      this.pagination.pageSize = pageSize;
      this.queryPage();
    },
    //当前页码发生变化时触发
    handleCurrentChange: function (page) {
      this.pagination.currentPage = page;
      this.queryPage();
    },
    //分页条件查询
    queryPage: async function () {
      const result = await queryPageApi(
        this.pagination.currentPage,
        this.pagination.pageSize
      );

      if (result.code) {
        this.tableData = result.data.rows;
        this.pagination.total = result.data.total;
      }
    },
  },
  //钩子函数 - 页面加载时触发
  mounted: function()  {
    this.queryPage();
  },
};
</script>

<template>
  <div>
    <!-- 顶部标题 -->
    <div>
      <div id="title">日志管理</div>
      <br />
    </div>

    <!-- 列表展示 -->
    <el-table :data="tableData" border style="width: 100%" fit size="small">
      <el-table-column
        prop="operateEmpName"
        label="操作人"
        align="center"
        width="80px"
      />
      <el-table-column
        prop="operateTime"
        label="操作时间"
        align="center"
        width="150px"
      />
      <el-table-column
        prop="className"
        label="类名"
        align="center"
        width="300px"
      />
      <el-table-column
        prop="methodName"
        label="方法名"
        align="center"
        width="100px"
      />
      <el-table-column
        prop="costTime"
        label="操作耗时(ms)"
        align="center"
        width="100px"
      />
      <el-table-column
        prop="methodParams"
        label="请求参数"
        align="center"
        width="280px"
      >
        <template #default="scope">
          <el-popover
            effect="light"
            trigger="hover"
            placement="top"
            width="auto"
            popper-style="font-size:12px"
          >
            <template #default>
              <div>参数: {{ scope.row.methodParams }}</div>
            </template>
            <template #reference>
              <el-tag v-if="scope.row.methodParams.length <= 30">{{
                scope.row.methodParams
              }}</el-tag>
              <el-tag v-else>{{
                scope.row.methodParams.substring(0, 30) + "..."
              }}</el-tag>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        prop="returnValue"
        label="返回值"
        align="center"
      ></el-table-column>
    </el-table>
    <br />
    <!-- 分页组件Pagination -->
    <el-pagination
      :current-page="pagination.currentPage"
      :page-size="pagination.pageSize"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>


<style scoped>
#title {
  font-size: 20px;
  font-weight: 600;
}
</style>