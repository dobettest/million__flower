const Router = require('tcb-router');
// 云函数入口函数
const { add, list, test } = require('./handler')
exports.main = async (event, context) => {
    // 调用getResult返回情感分析结果
    const app = new Router({ event });
    app.use(async function (ctx, next) {
        let data = {};
        for (var i in event) {
            if (i === '$url') {
                continue;
            }
            data[i] = event[i]
        }
        ctx.data = data
        await next()
    })
    app.router("test", test)
    app.router("add", add)
    app.router("list", list)
    return app.serve()
}