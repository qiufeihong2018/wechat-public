'use strict'

var Koa = require('koa')
var sha1 = require('sha1')
var config = {
    wechat: {
        appID: 'wx8933c10f9e79a2ac',
        appSecret: '018dfccdb771b4a0ffb1d349d4040379',
        token: 'imoocisareallyamzingplacetolearn'
    }
}
var app = new Koa()
app.use(function *(next) {
    console.log(this.query)
})

app.listen(1414)
console.log('listening:1414')