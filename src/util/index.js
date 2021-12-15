export const cloudFunction = function ({ name, url, data }) {
    return new Promise((resolve, reject) => {
        wx.cloud.callFunction({
            name,
            data: {
                $url: url,
                ...data
            },
            success: res => {
                console.log('res',res)
                resolve(res.result)
            },
            fail: err => {
                console.log('err',err)
                reject(err)
            }
        })
    })
}