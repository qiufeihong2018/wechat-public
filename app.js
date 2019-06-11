'use strict'

var Koa = require('koa')
var check = require('./middlewares/check')
var config = require('./config')
var app = new Koa()
app.use(check(config.wechat))

app.listen(1414)
console.log('listening:1414')