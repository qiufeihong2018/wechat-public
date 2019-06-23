'use strict'

// 自动回复
exports.reply = function* (next) {
    var message = this.weixin

    if (message.MsgType === 'event') {
        if (message.Event === 'subscribe') {
            if (message.EventKey) {
                console.log('扫二维码进来：' + message.EventKey + ' ' + message.ticket)
            }
            console.log('订阅')
            this.body = '哈哈，您订阅了飞鸿的公众号'
        } else if (message.Event === 'unsubscribe') {
            console.log('无情取关')
            this.body = ''
        }
    } else {

    }
    yield next
}