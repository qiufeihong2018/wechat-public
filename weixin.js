'use strict'

// 中间件中处理回复
exports.reply = function* (next) {
    var message = this.weixin

    if (message.MsgType === 'event') {
        this.body = '欢迎您来到飞鸿的公众号'
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
        }
    } else {

    }

    yield next
}