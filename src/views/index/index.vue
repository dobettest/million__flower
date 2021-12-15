<template>
  <div class="page__index">
    <div v-if="ready">
      <div class="topic__creator" v-if="fortunate">
        <div class="topic__content">
          <input
            type="text"
            maxlength="10"
            placeholder="请输入话题,字符限制(1~20)"
            v-model.trim="topic"
            class="topic__box"
          />
          <wx-button type="primary" class="topic__add__btn" @click="addTopic"
            ><i class="iconfont icon-bianxie btn__icon"></i>发布话题</wx-button
          >
        </div>
      </div>
      <div v-else>
        <h3 class="title">今日话题：{{ model["tname"] }}</h3>
        <div class="echart__container">
          <canvas ref="canvas" type="2d" class="echart__content"> </canvas>
        </div>
        <div>
          <span>评论列表(点击查看评论详情):</span>
        </div>
        <div class="comment__container">
          <div class="comment__empty" v-if="Msg">
            <p class="empty__content">
              <span>{{ Msg }}</span>
            </p>
          </div>
          <ul class="comment__list">
            <li
              class="comment__item"
              v-for="(item, idx) in commentList"
              :key="idx"
            >
              <div class="comment__content">
                <h3
                  class="comment__text"
                  :class="{ positive: item['sentiment'] === 'positive' }"
                >
                  {{ item["comment"] }}
                </h3>
                <p class="comment__detail">
                  <span>{{ item["sentiment"] }}</span>
                </p>
              </div>
              <div class="more__btn" @click="detail(item)">
                <span>详情</span>
                <i class="iconfont icon-youjiantou"></i>
              </div>
            </li>
            <li class="comment__btn__group">
              <span class="btn__pre" @click="changePage('pre')">上一页</span>
              <span class="btn__next" @click="changePage('next')">下一页</span>
            </li>
          </ul>
        </div>
        <div class="flex flex__middle">
          <label for="" class="comment__label">
            <input
              class="comment__box"
              placeholder="请输入评论内容"
              v-model.trim="comment"
          /></label>
          <wx-button
            type="primary"
            class="comment__btn--primary"
            @click="addComment"
          >
            <i class="iconfont icon-bianxie"></i>写评论</wx-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import echart from "echart";
import { getChart } from "@/charts.js";
import { cloudFunction } from "@/util";
const systemInfo = wx.getSystemInfoSync();
export default Vue.extend({
  name: "Index",
  data() {
    return {
      comment: "",
      errorMsg: "",
      commentList: [],
      page: 0,
      empty: false,
      fortunate: false,
      topic: "",
      ready: false,
      chartData: [],
      model: {},
      myChart: null,
      Msg: "",
    };
  },

  created() {
    window.addEventListener("wxload", (query) =>
      console.log("page1 wxload", query)
    );
    window.addEventListener("wxshow", () => console.log("page1 wxshow"));
    window.addEventListener("wxready", () => console.log("page1 wxready"));
    window.addEventListener("wxhide", () => console.log("page1 wxhide"));
    window.addEventListener("wxunload", () => console.log("page1 wxunload"));

    if (process.env.isMiniprogram) {
      console.log("I am in miniprogram");
    } else {
      console.log("I am in Web");
    }
  },
  mounted() {
    this.init();
  },
  destroyed() {
    if (this.myChart) {
      this.myChart.dispose();
    }
  },
  methods: {
    changePage(condition) {
      switch (condition) {
        case "pre":
          this.page = this.page > 0 ? --this.page : 0;
          this.getList();
          break;
        case "next":
          let total = this.model["Negative"] + this.model["Positive"];
          let max = Math.ceil(total / 4);
          this.page = this.page < max ? ++this.page : max;
          this.getList();
        default:
          break;
      }
    },
    async init() {
      await this.getTopic();
      switch (this.chartData.length > 0) {
        case false:
          this.fortunate = true;
          break;

        default:
          this.getList();
          break;
      }
    },
    // 调用云函数addComment，传递用户提交的内容，并返回执行结果
    async addComment() {
      console.log("addComment", this.comment);
      if (this.comment !== "") {
        // 执行函数：添加评论到云开发数据库
        let data = await cloudFunction({
          name: "comment",
          data: {
            $url: "add",
            tname: this.model["tname"],
            comment: this.comment,
          },
        });
        this.comment = "";
        console.log("addComment", data);
        //更新图表
        this.update(data);
      }
    },
    async addTopic() {
      if (this.topic !== "") {
        // 执行函数：添加评论到云开发数据库
        console.log("topic", this.topic);
        await cloudFunction({
          name: "topic",
          data: {
            $url: "add",
            tname: this.topic,
          },
        });
        this.topic = "";
        this.init();
      }
    },
    async getList() {
      let { data } = await cloudFunction({
        name: "comment",
        data: {
          $url: "list",
          tname: this.model["tname"],
          skip: this.page * 4,
        },
      });
      this.commentList = data;
      if (data.length === 0) {
        if (this.page === 0) {
          this.Msg = "暂无评论，快来发表你的观点吧!";
        } else {
          this.Msg = "没有更多评论了！";
        }
      }
    },
    async update(data) {
      console.log(data, this.model);
      await cloudFunction({
        name: "topic",
        data: {
          $url: "update",
          condition: {
            tname: this.model["tname"],
          },
          Sentiment: data["Sentiment"],
        },
      });
      await this.getTopic();
      await this.getList();
    },
    async detail(item = {}) {
      await this.$store.dispatch("setModel", item);
      this.$router.push("/detail");
    },
    async getTopic() {
      try {
        this.fortunate = false;
        this.ready = false;
        let { data } = await cloudFunction({
          name: "topic",
          data: {
            $url: "access",
          },
        });
        if (data.length > 0) {
          this.model = data[0];
          this.chartData = [
            { name: "消极", value: data[0].Negative },
            { name: "积极", value: data[0].Positive },
          ];
        }
        this.ready = true;
      } catch (error) {
        console.log("error", error);
      }
    },
    initEchart() {
      this.$nextTick(async () => {
        const myChart = await getChart(this.$refs.canvas, echart, {
          width: 300,
          height: 150,
          devicePixelRatio: systemInfo.devicePixelRatio,
        });
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
              data: this.chartData,
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
        myChart.setOption(option);
        this.myChart = myChart;
      });
    },
  },
  watch: {
    chartData: {
      handler(nl, ol) {
        if (nl) {
          this.initEchart();
        }
      },
      deep: true,
    },
  },
});
</script>

<style lang="less">
.page__index {
  padding: 20px 8px;
  .btn__icon {
    font-size: 20px;
    padding: 0 4px;
  }
  .topic__creator {
    height: 480px;
    position: relative;
    .topic__content {
      box-sizing: border-box;
      width: 300px;
      height: 80px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      .topic__box {
        box-sizing: border-box;
        width: 100%;
        height: 36px;
        margin: 8px 0;
        padding: 0 4px;
        background-color: #fff;
      }
      .topic__add__btn {
        height: 32px;
        line-height: 32px;
        text-align: center;
        width: 120px;
        margin: 0 auto;
      }
    }
  }
  .echart__container {
    height: 180px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .echart__content {
    }
  }
  .comment__container {
    .comment__empty {
      height: 60px;
      text-align: center;
      line-height: 60px;
      background-color: #fff;
      margin: 8px 0;
      .empty__content {
        margin: 0;
      }
    }
    .comment__list {
      list-style: none;
      margin: 0;
      padding: 0;
      .comment__item {
        position: relative;
        display: flex;
        align-items: center;
        height: 42%;
        background-color: #fff;
        border-bottom: 1px solid #777;
        .comment__content {
          flex-grow: 1;
          .comment__text {
            color: blue;
          }
          .comment__text,
          .comment__detail {
            margin: 0;
          }
          .positive {
            color: #1aad19;
          }
        }
        .more__btn {
          color: #ccc;
        }
      }
      .comment__btn__group {
        text-align: center;
        height: 32px;
        line-height: 32px;
        .btn__pre,
        .btn__next {
          display: inline-block;
          width: 60px;
          padding: 0 8px;
        }
      }
    }
  }
  .title {
    margin-top: 0;
  }
  .comment__label {
    background-color: #fff;
    height: 32px;
    display: flex;
    align-items: center;
    flex-grow: 1;
    .comment__box {
      height: 100%;
      padding-left: 8px;
    }
  }
  .comment__btn--primary {
    width: 120px;
    background-color: #1aad19;
    text-align: center;
    height: 32px;
    line-height: 32px;
    color: #fff;
  }
}
</style>
