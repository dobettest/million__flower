// 云函数入口文件
const cloud = require('wx-server-sdk')
// 导入tencentcloud-sdk-nodejs模块
const tencentcloud = require("tencentcloud-sdk-nodejs")
cloud.init()
const db = cloud.database()
// 创建获取情感分析结果的请求函数
async function getResult(comment) {
    const NlpClient = tencentcloud.nlp.v20190408.Client;
    const clientConfig = {
        credential: {
            secretId: "AKIDaz81dy2pLaYEfpkPownMfgQt4zcy3rOe",
            secretKey: "1mFRM0OVKsABvOaV9zZtvgANJxKRGp66",
        },
        region: "ap-guangzhou",
        profile: {
            httpProfile: {
                endpoint: "nlp.tencentcloudapi.com",
            },
        },
    };
    const client = new NlpClient(clientConfig);
    // Depends on tencentcloud-sdk-nodejs version 4.0.3 or higher
    const params = {
        "Text": comment
    };
    return await client.SentimentAnalysis(params);
}
//添加评论
async function add(ctx, next) {
    let { comment, tname } = ctx.data;
    let result = await getResult(comment)
    let res = await db.collection('userComments').add({
        data: {
            tname,
            comment,
            negative: result.Negative,
            positive: result.Positive,
            sentiment: result.Sentiment
        }
    })
    ctx.body = result
}
async function list(ctx, next) {
    let { skip, tname } = ctx.data
    ctx.body = await db.collection("userComments").where({
        tname
    }).limit(4).skip(skip).get()
}
async function update(ctx, next) {
    let { condition, newVal } = ctx.data;
    ctx.body = await db.collection("userComments").where(condition).update(newVal);
}
async function remove(ctx, next) {
    let { condition } = ctx.data;
    ctx.body = await db.collection("userComments").where(condition).remove()
}
async function test(ctx, next) {
    ctx.body = ctx.data
    await next()
}
module.exports = {
    add,
    list,
    test
}