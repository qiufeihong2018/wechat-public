'use strict'
var Promise = require('bluebird')
var _ = require('lodash')
var request = Promise.promisify(require('request'))
var util = require('./util')
var fs = require('fs')

var prefix = 'https://api.weixin.qq.com/cgi-bin/'
var api = {
    access_token: `${prefix}token?grant_type=client_credential`,
    temporary: {
        upload: `${prefix}media/upload?`,
        get: `${prefix}media/get?`
    },
    permanent: {
        // 新增其他类型永久素材
        upload: `${prefix}material/add_material?`,
        // 新增永久图文素材
        uploadNews: `${prefix}material/add_news?`,
        // 上传图文消息内的图片获取URL
        uploadNewsPic: `${prefix}media/uploadimg?`,
        get_material: `${prefix}material/get_material?`,
        del_material: `${prefix}material/del_material?`,
        update_news: `${prefix}material/update_news?`
    }
}

// 获得票据
function Wechat(opts) {
    var that = this
    this.appID = opts.appID
    this.appSecret = opts.appSecret
    this.getAccessToken = opts.getAccessToken
    this.saveAccessToken = opts.saveAccessToken
    this.fetchAccessToken()
}


// 票据的校验
Wechat.prototype.isValidAccessToken = function (data) {
    if (!data || !data.access_token || !data.expires_in) {
        return false
    }
    var access_token = data.access_token
    var expires_in = data.expires_in
    var now = (new Date().getTime())
    if (now < expires_in) {
        return true
    } else {
        return false
    }
}

// 票据的更新
Wechat.prototype.updateAccessToken = function () {
    var appID = this.appID
    var appSecret = this.appSecret
    // 请求微信access_token的url地址
    var url = api.access_token + '&appid=' + appID + '&secret=' + appSecret

    return new Promise(function (resolve, reject) {
        request({
            url: url,
            json: true
        }).then(function (res) {
            var data = res.body
            var now = (new Date().getTime())
            var expires_in = now + (data.expires_in - 20) * 1000
            data.expires_in = expires_in
            resolve(data)
        })
    })
}

Wechat.prototype.reply = function () {
    var content = this.body
    var message = this.weixin
    var xml = util.tpl(content, message)

    // 工具函数，获取xml，自动回复
    this.status = 200
    this.type = 'application/xml'
    this.body = xml
}

// 新增素材
Wechat.prototype.uploadMaterial = function (type, material, permanent) {
    var that = this
    var form = {}
    var uploadUrl = api.temporary.upload
    if (permanent) {
        uploadUrl = api.permanent.upload
        _.extend(form, permanent)
    }
    if (type === 'pic') {
        uploadUrl = api.permanent.uploadNewsPic
    }
    if (type === 'news') {
        //material是图文的时候，传入的是数组
        //如果是图片或视频，则是路径
        uploadUrl = api.permanent.uploadNews
        form = material
    } else {
        form.media = fs.createReadStream(material)
    }

    return new Promise(function (resolve, reject) {
        that.fetchAccessToken()
            .then(function (data) {
                var url = `${uploadUrl}access_token=${data.access_token}`
                if (!permanent) {
                    url += `&type${type}`
                } else {
                    form.access_token = data.access_token
                }
                //上传的参数，解析成json
                var options = {
                    method: 'POST',
                    url: url,
                    json: true
                }
                if (type === 'news') {
                    options.body = form
                } else {
                    options.formData = form
                }
                //上传结果显示

                request(options).then(function (res) {
                    console.log('res', res)
                    var _data = res.body
                    if (_data) {
                        resolve(_data)
                    } else {
                        throw new Error('upload material failure')
                    }
                }).catch(function (err) {
                    reject(err)
                })
            })
    })
}


// 获取素材
Wechat.prototype.getMaterial = function (mediaId, type, permanent) {
    var that = this
    var form = {}
    var getUrl = api.temporary.get
    if (permanent) {
        getUrl = api.permanent.get_material
    }

    return new Promise(function (resolve, reject) {
        that.fetchAccessToken()
            .then(function (data) {
                var url = `${getUrl}access_token=${data.access_token}&media_id=${media_id}`
                if (!permanent && type === 'video') {
                    url = url.replace('https://', 'http://')
                }
                resolve(url)
            })
    })
}

// 删除素材
Wechat.prototype.delMaterial = function (mediaId) {
    var that = this
    var form = {
        media_id: mediaId
    }
    return new Promise(function (resolve, reject) {
        that.fetchAccessToken()
            .then(function (data) {
                var url = `${api.permanent.del_material}access_token=${data.access_token}&media_id=${media_id}`
                //上传的参数，解析成json
                var options = {
                    method: 'POST',
                    url: url,
                    body: form,
                    json: true
                }
                request(options).then(function (res) {
                    console.log('res', res)
                    var _data = res.body
                    if (_data) {
                        resolve(_data)
                    } else {
                        throw new Error('upload material failure')
                    }
                }).catch(function (err) {
                    reject(err)
                })
            })
    })
}

// 修改素材
Wechat.prototype.updateMaterial = function (mediaId, news) {
    var that = this
    var form = {
        media_id: mediaId
    }
    _.extend(form, news)
    return new Promise(function (resolve, reject) {
        that.fetchAccessToken()
            .then(function (data) {
                var url = `${api.permanent.update_news}access_token=${data.access_token}&media_id=${media_id}`
                //上传的参数，解析成json
                var options = {
                    method: 'POST',
                    url: url,
                    body: form,
                    json: true
                }
                request(options).then(function (res) {
                    console.log('res', res)
                    var _data = res.body
                    if (_data) {
                        resolve(_data)
                    } else {
                        throw new Error('upload material failure')
                    }
                }).catch(function (err) {
                    reject(err)
                })
            })
    })
}

// 获取access_token
Wechat.prototype.fetchAccessToken = function () {
    var that = this
    if (this.access_token && this.expires_in) {
        if (this.isValidAccessToken(this)) {
            return Promise.resolve(this)
        }
    }
    this.getAccessToken()
        .then(function (data) {
            try {
                data = JSON.parse(data)
            } catch (e) {
                return that.updateAccessToken()
            }
            if (that.isValidAccessToken(data)) {
                return Promise.resolve(data)
            } else {
                return that.updateAccessToken()
            }
        }).then(function (data) {
            that.access_token = data.access_token
            that.expires_in = data.expires_in
            that.saveAccessToken(data)
            return Promise.resolve(data)
        })
}

module.exports = Wechat