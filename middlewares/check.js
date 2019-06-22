'use strict'
var sha1 = require('sha1')
var getRawBody = require('raw-body')
var Wechat = require('./wechat')
var util = require('./util')
module.exports = function (config) {
    // var wechat = new Wechat(config)

    return function* (next) {
        let token = config.token
        let timestamp = this.query.timestamp
        let nonce = this.query.nonce

        let signature = this.query.signature
        let echostr = this.query.echostr
        let str = [token, timestamp, nonce].sort().join('')
        let sha = sha1(str)

        if (this.method === 'GET') {
            if (sha === signature) {
                this.body = echostr + ''
            } else {
                this.body = 'check error'
            }
        } else if (this.method === 'POST') {
            if (sha !== signature) {
                this.body = 'wrong'
                return false
            }
            var data = yield getRawBody(this.req, {
                length: this.length,
                limit: '1mb',
                encoding: this.charset
            })
            var content = yield util.parseXMLAsync(data)

            var message=util.formatMessage(content.xml)

            console.log(message)
        }
    }
}