<script>
import * as echarts from "echarts";
import { queryEmpJobDataApi, queryEmpGenderDataApi } from "@/api/report";

export default {
  methods: {
    //获取职位统计报表
    loadJobChart: async function () {
      let result = await queryEmpJobDataApi();
      let jobList = result.data.jobList;
      let dataList = result.data.dataList;

      this.initJobChart(jobList, dataList);
    },
    //获取性别统计报表
    loadGenderChart: async function () {
      let result = await queryEmpGenderDataApi();
      this.initGenderChart(result.data);
    },
    initJobChart: function (jobList, dataList) {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("container1"));
      // 绘制图表
      myChart.setOption({
        title: {
          text: "员工职位统计",
          subText: "",
          textStyle: {
            fontSize: 20,
          },
          left: "center",
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        tooltip: {},
        xAxis: {
          data: jobList,
        },
        yAxis: {},
        series: [
          {
            name: "人数",
            type: "bar",
            data: dataList,
            itemStyle: {
              // 设置柱状渐变色
              color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                {
                  offset: 0,
                  color: "#ffbf61",
                },
                {
                  offset: 1,
                  color: "#dd5f85",
                },
              ]),
            },
          },
        ],
      });
    },
    initGenderChart: function (genderDataList) {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("container2"));
      let option = {
        title: {
          text: "员工性别统计",
          subText: "",
          textStyle: {
            fontSize: 20,
          },
          left: "center",
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          top: "10%",
          left: "center",
        },
        series: [
          {
            name: "性别",
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            top: "5%",
            itemStyle: {
              borderRadius: 5,
              borderColor: "#fff",
              borderWidth: 2,
            },
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 20,
                fontWeight: "bold",
              },
            },
            data: genderDataList,
          },
        ],
      };
      // 绘制图表
      myChart.setOption(option);
    },
  },
  //钩子函数 - 加载报表
  mounted() {
    this.loadJobChart(); //加载职位统计报表
    this.loadGenderChart() //加载性别统计报表
  },
};
</script>

<template>
  <div>
    <div class="title"><h1>员工信息统计</h1></div>

    <div class="content">
        <div class="report_container" id="container1" style="width: 600px; height: 400px"  ></div>

        <div class="report_container" id="container2" style="width: 600px; height: 400px" ></div>
    </div>
  </div>
</template>

<style>

.title{
  margin-bottom: 100px;
}

.content{
  display: flex;
}

#container1 {
  border: 1px dashed #ccc;
  width: 600px;
  height: 400px;
  float: left;
  margin-left: 100px;
}

#container2 {
  border: 1px dashed #ccc;
  width: 600px;
  height: 400px;
  float: left;
  margin-left: 100px;
}
</style>