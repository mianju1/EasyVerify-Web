## 系统接口文档

[TOC]



### 1. 注册功能

#### 接口描述
该接口用于用户注册。

#### 请求方法
`POST`

#### 请求URL
`/api/register`

#### 请求参数
| 参数名   | 类型   | 是否必填 | 描述   |
| -------- | ------ | -------- | ------ |
| username | string | 是       | 用户名 |
| password | string | 是       | 密码   |
| code     | string | 否       | 邀请码 |

#### 请求示例
```json
{
  "username": "testuser",
  "password": "testpassword",
  "code": "invite123"
}
```

### 2. 账号登录

#### 接口描述
该接口用于用户登录。

#### 请求方法
`POST`

#### 请求URL
`/api/login`

#### 请求参数
| 参数名   | 类型   | 是否必填 | 描述   |
| -------- | ------ | -------- | ------ |
| username | string | 是       | 用户名 |
| password | string | 是       | 密码   |

#### 请求示例
```json
{
  "username": "testuser",
  "password": "testpassword"
}
```

### 3. 激活码登录

#### 接口描述

该接口用于通过激活码和机器码登录。

#### 请求方法
`POST`

#### 请求URL
`/api/code-login`

#### 请求参数
| 参数名 | 类型   | 是否必填 | 描述   |
| ------ | ------ | -------- | ------ |
| code   | string | 是       | 激活码 |
| mac    | string | 是       | 机器码 |

#### 请求示例
```json
{
  "code": "ABCDE-12345-FGHIJ",
  "mac": "00:1A:2B:3C:4D:5E"
}
```

### 4. 获取版本

#### 接口描述
该接口用于获取当前系统的版本信息。

#### 请求方法
`GET`

#### 请求URL
`/api/version`

#### 请求参数
无

#### 请求示例
无

#### 响应参数
| 参数名  | 类型   | 描述                     |
| ------- | ------ | ------------------------ |
| code    | int    | 状态码                   |
| message | string | 返回信息                 |
| data    | object | 返回数据（包含版本信息） |

#### 响应示例
```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "version": "1.0.0",
    "releaseDate": "2023-10-01",
    "description": "初始版本"
  }
}
```

### 5. 获取公告

#### 接口描述
该接口用于获取系统的最新公告信息。

#### 请求方法
`GET`

#### 请求URL
`/api/announcement`

#### 请求参数
无

#### 请求示例
无

#### 响应参数
| 参数名  | 类型   | 描述                     |
| ------- | ------ | ------------------------ |
| code    | int    | 状态码                   |
| message | string | 返回信息                 |
| data    | object | 返回数据（包含公告信息） |

#### 响应示例
```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "title": "系统维护通知",
    "content": "系统将于2023-10-10 00:00至2023-10-10 06:00进行维护，请提前做好准备。",
    "publishDate": "2023-10-01"
  }
}
```

### 6. 获取指定用户到期时间

#### 接口描述
该接口用于获取指定用户的到期时间。可以通过用户名或激活码查询。

#### 请求方法
`GET`

#### 请求URL
`/api/user/expiration`

#### 请求参数
| 参数名   | 类型   | 是否必填 | 描述   |
| -------- | ------ | -------- | ------ |
| username | string | 否       | 用户名 |
| code     | string | 否       | 激活码 |

> 注意：`username` 和 `code` 至少需要填写一个。

#### 请求示例
```json
{
  "username": "testuser"
}
```

### 7. 是否为当前最新版本

#### 接口描述
该接口用于检查传入的版本号是否为系统的最新版本。

#### 请求方法
`POST`

#### 请求URL
`/api/version/check`

#### 请求参数
| 参数名  | 类型   | 是否必填 | 描述   |
| ------- | ------ | -------- | ------ |
| version | string | 是       | 版本号 |

#### 请求示例
```json
{
  "version": "1.0.0"
}
```

### 8. 修改用户密码

#### 接口描述
该接口用于修改指定用户的密码。

#### 请求方法
`POST`

#### 请求URL
`/api/user/change-password`

#### 请求参数
| 参数名   | 类型   | 是否必填 | 描述   |
| -------- | ------ | -------- | ------ |
| username | string | 是       | 用户名 |
| password | string | 是       | 新密码 |

#### 请求示例
```json
{
  "username": "testuser",
  "password": "newpassword123"
}
