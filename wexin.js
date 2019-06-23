'use strict'

exports.reply = function* (next) {
    var message = this.weixin
    if (message.MsgType === 'event') {
        if (message.Event === 'subscribe') {
            if (message.EventKey) {
                console.log('扫二维码进来：' + message.EventKey + ' ' + message.ticket)
            }
            this.body = '哈哈，您订阅了飞鸿的公众号\r\n' + '消息ID:' + message.MsgId
        } else if (message.Event === 'unsubscribe') {
            console.log('不要我了吗')
            this.body = ''
        }
    } else {

    }
    yield next
}