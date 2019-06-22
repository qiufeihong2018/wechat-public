'use strict'

var xml2js = require('xml2js')
var Promise = require('bluebird')
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