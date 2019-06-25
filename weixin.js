'use strict'
var config = require('./config')
var Wechat = require('./middlewares/wechat')

var wechatApi = new Wechat(config.wechat)
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
            reply = [{
                title: '我的博客',
                description: '我的心路历程',
                picUrl: 'https://user-gold-cdn.xitu.io/2019/3/19/16995c12657064e9?imageView2/1/w/180/h/180/q/85/format/webp/interlace/1',
                url: 'http://www.qiufeihong.top/'
            }]
        } else if (content === '2') {
            reply = [{
                title: '我的github',
                description: '欢迎来到飞鸿的github',
                picUrl: 'https://avatars1.githubusercontent.com/u/36500514?s=460&v=4',
                url: 'https://github.com/qiufeihong2018'
            }]
        } else if (content === '3') {
            reply = [{
                title: '我的掘金',
                description: '欢迎来到飞鸿的掘金',
                picUrl: 'https://user-gold-cdn.xitu.io/2019/3/19/16995c12657064e9?imageView2/1/w/180/h/180/q/85/format/webp/interlace/1',
                url: 'https://juejin.im/user/5bf4d63cf265da61561ee241/posts'
            }]
        } else if (content === '4') {
            var data = yield wechatApi.uploadMaterial('image', `${__dirname}/7.jpg`)
            reply = {
                type: 'image',
                mediaId: data.media_id
            }
        } else if (content === '5') {
            var data = yield wechatApi.uploadMaterial('video', `${__dirname}/8.mp4`)
            reply = {
                type: 'video',
                title: '视频',
                description: '例子',
                mediaId: data.media_id
            }
        } else if (content === '6') {
        } else if (content === '7') {
        } else if (content === '8') {
        } else if (content === '9') {
        } else if (content === '10') {
        } else if (content === '11') {
        } else if (content === '12') {
        } else if (content === '13') {
        } else if (content === '14') {
        }
        this.body = reply

    }

    yield next
}