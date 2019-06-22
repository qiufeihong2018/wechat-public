'use strict'
var sha1 = require('sha1')
var Promise = require('bluebird')
var request = Promise.promisify(require('request'))
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
                Promise.resolve(data)
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

module.exports = function (config) {
    var wechat = new Wechat(config)
    return function* (next) {
        console.log(this.query)
        let token = config.token
        let timestamp = this.query.timestamp
        let nonce = this.query.nonce

        let signature = this.query.signature
        let echostr = this.query.echostr
        let str = [token, timestamp, nonce].sort().join('')
        let sha = sha1(str)
        console.log(sha)
        if (sha === signature) {
            this.body = echostr + ''
        } else {
            this.body = 'check error'
        }
    }

}