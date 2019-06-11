'use strict'
var sha1 = require('sha1')

module.exports = function (config) {
    return function* (next) {
        console.log(this.query)
        var token = config.token
        var timestamp = this.query.timestamp
        var nonce = this.query.nonce

        var signature = this.query.signature
        var echostr = this.query.echostr
        var str = [token, timestamp, nonce].sort().join('')
        var sha = sha1(str)
        console.log(sha)
        if (sha === signature) {
            this.body = echostr + ''
        } else {
            this.body = 'wrong'
        }
    }

}