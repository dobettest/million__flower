<template>
  <div class="page__detail">
    <div><b>评论内容:</b></div>
    <p>{{ model["comment"] }}</p>
    <div class="echart__container">
      <canvas ref="canvas" type="2d" class="echart__content"> </canvas>
    </div>
    <router-link to="/" class="back__btn">返回列表</router-link>
  </div>
</template>

<script>
import echart from "echart";
import { getChart } from "@/charts.js";

const systemInfo = wx.getSystemInfoSync();
export default {
  name: "Detail",
  data() {
    return {
      myChart: null,
    };
  },
  computed: {
    model() {
      return this.$store.state.model;
    },
  },
  created() {
    window.addEventListener("wxload", (query) =>
      console.log("page2 wxload", query)
    );
    window.addEventListener("wxshow", () => console.log("page2 wxshow"));
    window.addEventListener("wxready", () => console.log("page2 wxready"));
    window.addEventListener("wxhide", () => console.log("page2 wxhide"));
    window.addEventListener("wxunload", () => console.log("page2 wxunload"));
  },
  mounted() {
    this.initEchart();
  },
  methods: {
    initEchart() {
      this.$nextTick(async () => {
        const data = [
          { value: 548, name: "消极" },
          { value: 1046, name: "积极" },
        ];
        const option = {
          tooltip: {
            trigger: "item",
          },
          legend: {
            orient: "vertical",
            left: "left",
          },
          series: [
            {
              name: "观点",
              type: "pie",
              radius: "50%",
              data,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)",
                },
              },
            },
          ],
        };
        const myChart = await getChart(this.$refs.canvas, echart, {
          devicePixelRatio: systemInfo.devicePixelRatio,
        });
        myChart.setOption(option);
        this.myChart = myChart;
      });
    },
  },
  destroyed() {
    if (this.myChart) {
      this.myChart.dispose();
    }
  },
};
</script>

<style lang="less">
.page__detail {
  padding: 8px;
  .echart__container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    .echart__content {
      width: 100%;
      height: 360px;
    }
  }
  .back__btn {
    height: 32px;
    display: flex;
    width: 120px;
    justify-content: center;
    align-items: center;
    background-color: #1aad19;
    color: #fff;
    margin: 0 auto;
  }
}
</style>
