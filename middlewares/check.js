'use strict'
var sha1 = require('sha1')
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

// 校验
module.exports = function (config) {
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