'use strict'

var Koa = require('koa')
var check = require('./middlewares/check')

var path = require('path')
var util = require('./lib/util')
var config = require('./config')
var weixin = require('./weixin')
var wechat_file = path.join(__dirname, './config/wechat.txt')

var app = new Koa()

app.use(check(config.wechat, weixin.reply))

app.listen(1414)
console.log('listening:1414')