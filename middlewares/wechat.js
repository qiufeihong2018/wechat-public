'use strict'
var Promise = require('bluebird')
var request = Promise.promisify(require(request))

var prefix = 'https://api.weixin.qq.com/cgi-bin/token'
var api = {
    access_token: `${prefix}?grant_type=client_credential`
}
// 票据
function Wechat(config) {
    var that = this
    this.appID = config.appID
    this.appSecret = config.appSecret
    this.getAccessToken = config.getAccessToken
    this.saveAccessToken = config.saveAccessToken

    this.getAccessToken()
        .then(function (data) {
            try {
                data = JSON.parse(data)
            } catch (e) {
                return that.updateAccessToken(data)
            }
            if (that.isValidAccessToken(data)) {
                Promise.resolve(data)
            } else {
                return that.updateAccessToken()
            }
        })
        .then(function (data) {
            that.access_token = data.access_token
            that.expires_in = data.expires_in
            that.saveAccessToken(data)
        })

}

Wechat.prototype.isValidAccessToken = function (data) {
    if (!data || !data.access_token || !data.expires_in) {
        return false
    }
    var access_token = data.access_token
    var expires_in = data.expires_in
    var now = (new Date().getTime())

    if (now < expires_in) {
        return true
    } else {
        return false
    }

}
// 票据的更新
Wechat.prototype.updateAccessToken = function (data) {
    var appID = this.appID
    var appSecret = this.appSecret
    var url = `${api.access_token}&appid=${appID}&secret=${appSecret}`
    return new Promise(function (resolve, reject) {
        request({
            url: url,
            json: true
        }).then(function (res) {
            var data = res[1]
            var now = (new Date().getTime())
            // 票据提前20秒刷新
            var expires_in = now + (data.expires_in - 20) * 1000
            data.expires_in = expires_in
        })
        resolve()
    })

}

module.exports = Wechat