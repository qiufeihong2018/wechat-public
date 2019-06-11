'use strict'

var Koa = require('koa')
var sha1 = require('sha1')
var check=require('./middlewares/check')
var config = {
    wechat: {
        appID: 'wx8933c10f9e79a2ac',
        appSecret: '018dfccdb771b4a0ffb1d349d4040379',
        token: 'myfristpublicwechat'
    }
}
var app = new Koa()
app.use(check(config.wechat))

app.listen(1414)
console.log('listening:1414')