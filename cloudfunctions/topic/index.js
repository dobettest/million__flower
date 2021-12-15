const Router = require('tcb-router');
// 云函数入口函数
const { update, access, test,add } = require('./handler')
exports.main = async (event, context) => {
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
    app.router("add",add)
    app.router("test", test)
    app.router("update",update)
    app.router("access", access)
    return app.serve()
}