# 	全景直播平台系统产品需求文档
## 目录

[TOC]

## 需求分析

1. 用户可在客户端观看不同用户上传的直播和录播
2. 每一个视频页面有评论及其他视频推荐
3. 普通用户需要升级成高级用户才能上传直播
4. 平台首页、联系方式页面

## 功能设计

1. 注册、登录、修改密码、注销
2. 查看个人信息
   1. 设定可见范围
   2. 用户描述
   3. 上传视频列表
   4. 历史记录
   5. 评论记录
3. 查看用户信息
   1. 用户描述
   2. 上传视频列表
4. 上传直播、录播
  5. 所有视频列表
  6. 特定用户的上传视频列表
  7. 查看、删除历史记录
  8. 收藏视频、删除收藏视频
9. 评论、回复评论、删除评论
10. 升级用户、封停用户

## 服务器接口

### 1. 用户相关

------

#### 1. /users/signup

**POST - 注册**
**Request**

```json
// options内容不存在则不写
{
    "username": "账号",
    "password": "密码",
    "nickname": "用户昵称",
    "userType": "(此处不接受用户输入，强制为0，即普通用户)",
    "options": {
        "gender": "gender",
        "dob": "1990/07/01",
        "email": "xxx@xxx.xxx",
        "addr": "地址",
        "phone": "+86 xxxxxx",
        "tel": "固话号码",
        "wechat": "微信号",
        "qq": "qq号"
    }
}
```

**Response**

```json
// 注册成功
{
    "success": true,
    "statusCode": 0,
    "msg": "返回信息"
}

// 用户名已存在
{
    "success": false,
    "statusCode": "1",
    "msg": "返回信息"
}

// 用户昵称已存在 "statusCode": 2
// 邮箱已被使用 "statusCode": 3
// 未知错误 "statusCode": 4
```

#### 2. /users/login

**POST - 登录**
**Request**

```json
{
    "username": "账号",
    "password": "密码"
}
```

**Response**
```json
// 登录成功
{
    "success": true,
    "statusCode": 0,
    "msg": "返回信息",
    "content": {
        "userId": "自动生成的_id",
        "nickname": "用户昵称",
        "userType": "用户类型"
    }
}

// 密码错误
{
    "success": false,
    "statusCode": 1,
    "msg": "返回信息"
}

// 用户名不存在 "statusCode": 2
// 未知错误 "statusCode": 3
```

#### 3. /users/logout
**GET - 注销**
**Response**

```json
// 注销成功
{
    "success": true,
    "statusCode": 0,
    "msg": "返回信息"
}

// 用户尚未登录
{
    "success": false,
    "statusCode": 1,
    "msg": "返回信息"
}

// 未知错误 "statusCode": 2
```

#### 4. /users/password_reset
**POST - 重设密码**
**Request**

```json
{
    "username": "账号",
    "password": "密码",
    "newPassword": "新密码"
}
```
**Response**

```json
// 重设密码成功
{	
    "success": true,
    "statusCode": 0,
    "msg": "返回信息"
}

// 密码不正确
{	
    "success": false,
    "statusCode": 1,
    "msg": "返回信息"
}

// 未知错误
{
    "success": false,
    "statusCode": 2,
    "msg": "返回信息"
}
```

#### 5. /users/:userId
**GET - 获取用户信息**
**Response**

```json
// 用户信息获取成功 content内容不存在则不写
{
    "success": true,
    "statusCode": 0,
    "msg": "返回信息",
    "content": {
        "nickname": "nickname",
        "gender": "gender",
        "collections": "收藏视频",
        "channels": "上传视频",
        "icon": "头像",
        "description": "个人简介",
        "dob": "1990/07/01",
        "email": "xxx@xxx.xxx",
        "addr": "地址",
        "userType": "用户类型",
        "phone": "+86 xxxxxx",
        "tel": "固话号码",
        "wechat": "微信号",
        "qq": "qq号"
	}
}

// 用户信息获取失败
{
    "success": false,
    "statusCode": 0,
    "msg": "返回信息"
}

// 未知错误 "statusCode": 1
```

**PUT - 更新个人信息**

**Request**

```json
{
    "nickname": "用户昵称",
    "gender": "gender",
    "collections": "收藏视频",
    "channels": "上传视频",
    "icon": "头像",
    "description": "个人简介",
    "dob": "1990/07/01",
    "email": "xxx@xxx.xxx",
    "addr": "地址",
    "phone": "+86 xxxxxx",
    "tel": "固话号码",
    "wechat": "微信号",
    "qq": "qq号"
}
```

**Response**

```json
// 更新个人信息成功
{
    "success": true,
    "statusCode": 0,
    "msg": "返回信息"
}

// 更新个人信息失败
{
    "success": false,
    "statusCode": 1,
    "msg": "返回信息"
}
```



#### 6. /users/:userId/videos

**GET - 获取用户上传视频列表**

**Response**

```json
// 获取用户上传视频列表成功
{
    "success": true,
    "statusCode": 0,
    "msg": "返回信息",
    "content": [
        {
            "videoId": "videoId",
            "videoName": "视频名称",
            "videoType": "视频类型",
            "res": "视频流来源",
            "thumbnail": "缩略图地址",
            "author": "上传者",
            "description": "视频描述",
            "comments": []
        },
        {
            "videoId": "videoId",
            "videoName": "视频名称",
            "videoType": "视频类型",
            "res": "视频流来源",
            "thumbnail": "缩略图地址",
            "author": "上传者",
            "description": "视频描述",
            "comments": []
        }
    ]
}

// 获取用户上传视频列表失败
{
    "success": false,
    "statusCode": 1,
    "msg": "返回信息",
}

// 未知错误 "statusCode": 2
```

**POST - 上传视频**

**Request**

```json
{
    "videoName": "视频名称",
    "videoType": "视频类型",
    "res": "视频流来源",
    "thumbnail": "缩略图地址",
    "author": "上传者",
    "description": "视频描述"
}
```

**Response**

```json
// 上传成功
{
    "success": true,
    "statusCode": 0,
    "msg": "返回信息"
}

// 非VIP用户，无上传视频资格
{
    "success": false,
    "statusCode": 1,
    "msg": "返回信息"
}

// 未知错误 "statusCode": 2
```

#### 7. /users/:userId/videos/:videoId

**GET - 获取视频信息**

**Response**

```json
{
    "videoName": "视频名称",
    "videoType": "视频类型",
    "res": "视频流来源",
    "thumbnail": "缩略图地址",
    "description": "视频描述"
}
```

**PUT - 更新视频信息**

**Request**

```json
{
    "videoName": "视频名称",
    "videoType": "视频类型",
    "res": "视频流来源",
    "thumbnail": "缩略图地址",
    "description": "视频描述"
}
```

**Response**

```json
// 更新视频成功
{
    "success": true,
    "statusCode": 0,
    "msg": "返回信息"
}

// 登录用户不匹配
{
    "success": false,
    "statusCode": 1,
    "msg": "返回信息"
}

// 视频不存在 "statusCode": 2
// 未知错误 "statusCode": 3
```

**DELETE - 删除视频**

**Response**

```json
// 删除视频成功
{
    "success": true,
    "statusCode": 0,
    "msg": "返回信息"
}

// 登录用户不匹配
{
    "success": false,
    "statusCode": 1,
    "msg": "返回信息"
}

// 视频不存在 "statusCode": 2
// 未知错误 "statusCode": 3
```

#### 8. /users/:userId/playlist

**GET - 获取收藏视频列表**

**Response**

```json
// 获取收藏视频列表成功
{
    "success": true,
    "statusCode": 0,
    "msg": "返回信息",
    "content": [
        {
            "videoId": "videoId",
            "videoName": "videoName",
            "img": "图片地址",
            "createdTime": "createdTime"
        },
        {
            "videoId": "videoId",
            "videoName": "videoName",
            "img": "图片地址",
            "createdTime": "createdTime"
        }
    ]
}
```

#### 9. /users/:userId/history

**GET - 获取用户播放记录**

**Response**

```json
// 获取用户播放记录成功
{
    "success": true,
    "statusCode": 0,
    "msg": "返回信息",
    "content": [
        {
            "videoId": "videoId",
            "videoName": "videoName",
            "author": "author",
            "thumbnail": "缩略图地址"
        }
        ...
    ]
}

// 用户不匹配
{
    "success": false,
    "statusCode": 1,
    "msg": "返回信息"
}

// 未知错误 "statusCode": 2
```

**DELETE - 删除用户播放记录**

**Request**

```json
{
    "videoId": "videoId"
}
```

**Response**

```json
// 删除用户播放记录成功
{
    "success": true,
    "statusCode": 0,
    "msg": "返回信息"
}

// 用户不匹配
{
    "success": false,
    "statusCode": 1,
    "msg": "返回信息"
}

// 未知错误 "statusCode": 2
```

#### 10. /users/:userId/settings - 更新个人设置

#### 11. /users/:userId/comments

**GET - 获取个人评论**

**Response**

```json
// 获取个人评论记录成功
```



#### 12. /users/:userId/history - 获取播放历史记录

### 2. 视频相关

------

#### 1. /recommendations - 获取推荐视频
#### 2. /recommendations?v=[videoId] - 获取播放页面推荐视频
#### 3. /watch?v=[videoId] - 视频页面
#### 4. /watch?v=[videoId]&q=comments- 获取评论信息
#### 5. /watch/comments?v=[videoId]
#### 6. /watch/:videoId/comments - 评论、删除评论
#### 7. /watch/:videoId/comments/:commentId - 回复分支评论、删除分支评论

### 3. 权限设置

------

#### 1. /service/upgrade - 升级用户
#### 2. /service/closure - 封停用户







## 数据表结构

### User

```javascript
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
```

### Video

```javascript
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
```



