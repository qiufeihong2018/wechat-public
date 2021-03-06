'use strict'

var path = require('path')
var util = require('./lib/util')
var wechat_file = path.join(__dirname, './config/wechat.txt')

// 微信的配置
const config = {
    wechat: {
        appID: 'wx8933c10f9e79a2ac',
        appSecret: '018dfccdb771b4a0ffb1d349d4040379',
        token: 'myfristpublicwechat',
        getAccessToken: function () {
            return util.readFileAsync(wechat_file)
        },
        saveAccessToken: function (data) {
            data = JSON.stringify(data)
            return util.writeFileAsync(wechat_file, data)
        }
    }
}


module.exports = config