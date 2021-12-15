// 云函数入口文件
const cloud = require('wx-server-sdk');
// 导入tencentcloud-sdk-nodejs模块
cloud.init()
const db = cloud.database()
const _ = db.command;
const now = new Date()
const today = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join("")
async function access(ctx, next) {
    ctx.body = await db.collection("userTopics").where({
        pdate: today
    }).limit(1).get()
}
async function update(ctx, next) {
    let { condition, Sentiment } = ctx.data;
    let newVal = Sentiment === "negative" ? {
        Negative: _.inc(1)
    } : {
        Positive: _.inc(1)
    }
    console.log(condition, newVal, Sentiment)
    ctx.body = await db.collection("userTopics").where(condition).update({ data: newVal });
}
async function add(ctx, next) {
    let { tname } = ctx.data;
    ctx.body = await db.collection("userTopics").add({
        data: {
            Negative: 0,
            Positive: 0,
            tname,
            pdate: today
        }
    })
}
async function test(ctx, next) {
    ctx.body = ctx.data
    await next()
}
module.exports = {
    update,
    access,
    test,
    add
}