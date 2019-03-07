var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ModelTypes = require('./ModelTypes');

var profileSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    icon: {
        type: String
    },
    description: {
        type: String
    },
    gender: {
        type: String,
        enum: [
            ModelTypes.GENDER_TYPES.GENDER_DEFAULT,
            ModelTypes.GENDER_TYPES.GENDER_MALE,
            ModelTypes.GENDER_TYPES.GENDER_FEMALE
        ]
    },
    dob: {
        type: Date
    },
    email: {
        type: String
    },
    addr: {
        type: String
    },
    phone: {
        type: String
    },
    tel: {
        type: String
    },
    wechat: {
        type: String
    },
    qq: {
        type: String
    }
}, {
    timestamps: true
});

var Profiles = mongoose.model('Profile', profileSchema);

module.exports = Profiles;