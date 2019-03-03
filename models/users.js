var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var ModelTypes = require('./ModelTypes');

var userSchema = new Schema({
    userType: {
        type: String,
        enum: [
            ModelTypes.USER_TYPES.USER_GENERAL,
            ModelTypes.USER_TYPES.USER_AUTHOR,
            ModelTypes.USER_TYPES.USER_ADMIN
        ],
        default: ModelTypes.USER_TYPES.USER_GENERAL
    },
    nickname: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true
});

userSchema.plugin(passportLocalMongoose)

var Users = mongoose.model('User', userSchema);

module.exports = Users;