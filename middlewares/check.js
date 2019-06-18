'use strict'
var sha1 = require('sha1')
// 获取并验证可读流的原始主体
var getRawBody = require('raw-body')
var Wechat = require('./wechat')


// 校验
module.exports = function (config) {

    // var wechat = new Wechat(config)

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


        if (this.method === 'GET') {
            if (sha === signature) {
                this.body = echostr + ''
            } else {
                this.body = 'check error'
            }
        } 
        else if (this.method === 'POST') {
            if (sha !== signature) {
                this.body = 'check error'
                return false
            }
            var data = yield getRawBody(this.req, {
                length: this.length,
                limit: '1mb',
                encoding: this.charset
            })
            console.log('data', data.toString())
            var content = yield util.
        }
    }

}