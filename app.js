'use strict'

var Koa = require('koa')
var sha1 = require('sha1')
var config = {
    wechat: {
        appID: 'wx8933c10f9e79a2ac',
        appSecret: '018dfccdb771b4a0ffb1d349d4040379',
        token: 'myfristpublicwechat'
    }
}
var app = new Koa()
app.use(function* (next) {
    console.log(this.query)
    var token = config.wechat.token
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
})

app.listen(1414)
console.log('listening:1414')