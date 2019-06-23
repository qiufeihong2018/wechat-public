'use strict'

// 中间件中处理回复
exports.reply = function* (next) {
    var message = this.weixin

    if (message.MsgType === 'event') {
        if (message.Event === 'subscribe') {
            // 通过扫描二维码进来
            if (message.EventKey) {
                console.log('扫二维码进来：' + message.EventKey + ' ' + message.ticket)
            }
            console.log('订阅')
            this.body = '欢迎您来到飞鸿的公众号'
        } else if (message.Event === 'unsubscribe') {
            console.log('无情取关')
            this.body = ''
        } else if (message.Event === 'LOCATION') {
            this.body = `您上报的位置的经度是：${message.Longitude},纬度是:${message.Latitude}精度是:${message.Precision}`
        } else if (message.Event === 'CLICK') {
            this.body = `您点击了菜单：${message.EventKey}`
        } else if (message.Event === 'SCAN') {
            this.body = `您扫我了哦。事件KEY值是：${message.EventKey}二维码的ticket是：${message.ticket}`
        } else if (message.Event === 'VIEW') {
            this.body = `点击菜单跳转链接。跳转URL是：${message.EventKey}`
        }
    } else if (message.MsgType === 'text') {
        var content = message.Content
        var reply = `您说的${message.Content}太复杂了`
        if (content === '1') {
            reply = '一帆丰顺'
        } else if (content === '2') {
            reply = '好事成双'
        } else if (content === '3') {
            reply = '三星报喜'
        } else if (content === '4') {
            reply = '四季发财'
        } else if (content === '5') {
            reply = '五福临门'
        } else if (content === '6') {
            reply = '六六大顺'
        } else if (content === '7') {
            reply = '七星高照'
        } else if (content === '8') {
            reply = '八方来财'
        } else if (content === '9') {
            reply = '九九同心'
        } else if (content === '10') {
            reply = '十全十美'
        }
        this.body = reply

    }

    yield next
}