var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var childCommentSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestampes: true
});

// 评论
var commentSchema = new Schema({
    // 评论内容
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    // 子评论
    comments: [childCommentSchema]
}, {
    timestamps: true
})

var videoSchema = new Schema({
    // 视频名称
    videoName: {
        type: String,
        required: true,
        unique: true
    },
    // 视频类型
    // 0 - 录播; 1 - 直播
    videoType: {
        type: Number,
        required: true
    },
    // 视频流来源
    res: {
        type: String
    },
    // 缩略图地址
    thumbnail: {
        type: String
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    description: {
        type: String,
        default: '暂无信息'
    },
    comments: [commentSchema]
}, {
    timestamps: true
});

var Videos = mongoose.model('Video', videoSchema);

module.exports = Videos;
exports.videoSchema = videoSchema;