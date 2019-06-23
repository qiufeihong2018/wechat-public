'use strict'

var xml2js = require('xml2js')
var Promise = require('bluebird')
var tpl = require('./tpl')
// xml转化数组对象
exports.parseXMLAsync = function (xml) {
    return new Promise(function (resolve, reject) {
        xml2js.parseString(xml, {
            trim: true
        }, function (err, content) {
            if (err) reject(err)
            else resolve(content)
        })
    })
}

// 数组扁平化-扁平的对象字面量
function formatMessage(result) {
    var message = {}
    if (typeof result === 'object') {
        var keys = Object.keys(result)
        for (var i = 0; i < keys.length; i++) {
            var item = result[keys[i]]
            var key = keys[i]
            if (!(item instanceof Array) || item.length === 0) {
                continue
            }
            if (item.length === 1) {
                var val = item[0]
                if (typeof val === 'object') {
                    message[key] = formatMessage(val)
                } else {
                    message[key] = (val || '').trim()
                }
            } else {
                message[key] = []
                for (var j = 0, k = item.length; j < k; j++) {
                    message[key].push(formatMessage(item[j]))
                }
            }
        }
    }
    return message
}
exports.formatMessage = formatMessage


exports.tpl = function(content, message) {
    //对「var tpl = require('./tpl')」进行一步的封装
    //明确content和message的内容
  
    var info = {} //字典
    var type = 'text'
    //message里拿到User
    var fromUserName = message.FromUserName
    var toUserName = message.ToUserName
  
    if (Array.isArray(content)) {
      type = 'news'
    }
  
    if (!content) {
      content = 'Empty news'
    }
    //判断消息的类型「content.type」，默认是「text」
    type = content.type || type
    info.content = content
    info.createTime = new Date().getTime()
    info.msgType = type
    info.toUserName = fromUserName
    info.fromUserName = toUserName
    //将所有输入放入info中，进入「var tpl = require('./tpl')」的compiled方法中，进行编译。
    return tpl.compiled(info)
  }
  
  
  
  