'use strict'
var Promise = require('bluebird')
var request = Promise.promisify(require('request'))
var util = require('./util')

var prefix = 'https://api.weixin.qq.com/cgi-bin/'
var api = {
    access_token: prefix + 'token?grant_type=client_credential'
}

// 获得票据
function Wechat(opts) {
    var that = this
    this.appID = opts.appID
    this.appSecret = opts.appSecret
    this.getAccessToken = opts.getAccessToken
    this.saveAccessToken = opts.saveAccessToken

    this.getAccessToken()
        .then(function (data) {
            try {
                data = JSON.parse(data)
            } catch (e) {
                return that.updateAccessToken()
            }
            if (that.isValidAccessToken(data)) {
                return Promise.resolve(data)
            } else {
                return that.updateAccessToken()
            }
        }).then(function (data) {
            that.access_token = data.access_token
            that.expires_in = data.expires_in
            that.saveAccessToken(data)
        })
}

// 票据的校验
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
Wechat.prototype.updateAccessToken = function () {
    var appID = this.appID
    var appSecret = this.appSecret
    // 请求微信access_token的url地址
    var url = api.access_token + '&appid=' + appID + '&secret=' + appSecret

    return new Promise(function (resolve, reject) {
        request({
            url: url,
            json: true
        }).then(function (res) {
            var data = res.body
            var now = (new Date().getTime())
            var expires_in = now + (data.expires_in - 20) * 1000
            data.expires_in = expires_in
            resolve(data)
        })
    })
}

Wechat.prototype.reply = function () {
    var content = this.body
    var message = this.weixin
    var xml = util.tpl(content, message)

    // 工具函数，获取xml，自动回复
    this.status = 200
    this.type = 'application/xml'
    this.body = xml
}
module.exports = Wechat