var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var videoSchema = require('./videos').videoSchema;
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new Schema({
    // 用户名密码由Passport Local生成
    // 用户类型
    // 0 - 普通用户; 1 - 会员用户(可上传直播、视频); 7 - 管理员
    userType: {
        type: Number,
        default: 0
    },
    // 用户昵称
    nickname: {
        type: String,
        required: true,
        unique: true
    },
    // 收藏视频
    collections: [videoSchema],
    // 上传视频
    channels: [videoSchema],
    options: {
        // 头像
        icon: {
            type: String
        },
        // 个人简介
        description: {
            type: String,
            default: '暂无信息'
        },
        // 性别
        // 0 - 未知; 1 - 男; 2 - 女
        gender: {
            type: Number,
            default: 0
        },
        // 出生日期 date of birth
        dob: {
            type: Date
        },
        email: {
            type: String,
            unique: true
        },
        // 地址
        addr: {
            type: String
        },
        phone: {
            type: String
        },
        tel: {
            type: String,
        },
        wechat: {
            type: String
        },
        qq: {
            type: String
        }
    }
}, {
    timestamps: true
});

// 将从body的json中获取username和password进行验证
userSchema.plugin(passportLocalMongoose)

var Users = mongoose.model('User', userSchema);

module.exports = Users;