## 系统接口文档

使用接口文档，您可以了解如何使用接口进行数据交互。

**请先前往** [API接口](/web/interface) **中进行接口开放与设置**

### 0. 准备工作 

> 重要！！

下列功能中的 `请求URL` 中会有 `"接口地址"`该内容，请将该内容替换为 [API接口](/web/interface) 中的 **接口地址**！！！

如图所示：

![image](https://image.baidu.com/search/down?url=https://tvax1.sinaimg.cn/large/006yj1INly1hzy7pspefxj336e14kdtk.jpg)

> 请按照对应功能填入对应接口地址！

例如：

- 注册功能：https://api.easyverify.mian-ju.cn/api/v1/74362DE4D1D14969
- 账号登陆功能：https://api.easyverify.mian-ju.cn/api/v1/076EE397D3C14088

### 1. 注册功能

**接口描述**
该接口用于用户注册。

**请求方法**
`POST`

**请求URL**
`https://api.easyverify.mian-ju.cn/api/v1/接口地址`

**请求参数**

| 参数名   | 类型   | 是否必填 | 描述   |
| -------- | ------ | -------- | ------ |
| username | string | 是       | 用户名 |
| password | string | 是       | 密码   |
| code     | string | 否       | 注册码 |

> 软件如果为 `账号+密码` 登录方式则无需填写注册码

**请求示例**

```json
{
  "username": "user",
  "password": "password",
  "code": "185E125BDF7C496C9CAFEBBB"
}
```

### 2. 账号登录

**接口描述**
该接口用于用户登录。

**请求方法**
`POST`

**请求URL**
`https://api.easyverify.mian-ju.cn/api/v1/接口地址`

**请求参数**

| 参数名   | 类型   | 是否必填 | 描述   |
| -------- | ------ | -------- | ------ |
| username | string | 是       | 用户名 |
| password | string | 是       | 密码   |

**请求示例**

```json
{
  "username": "user",
  "password": "password"
}
```

### 3. 激活码登录

**接口描述**

该接口用于通过激活码和机器码登录。

**请求方法**
`POST`

**请求URL**
`https://api.easyverify.mian-ju.cn/api/v1/接口地址`

**请求参数**

| 参数名 | 类型   | 是否必填 | 描述   |
| ------ | ------ | -------- | ------ |
| code   | string | 是       | 激活码 |
| mac    | string | 是       | 机器码 |

**请求示例**

```json
{
  "code": "92A0225A0B1444F7B1FB8B6A",
  "mac": "123"
}
```

### 4. 获取版本

**接口描述**
该接口用于获取当前软件的版本信息。

**请求方法**
`GET`

**请求URL**
`https://api.easyverify.mian-ju.cn/api/v1/接口地址`

**请求参数**
无

**请求示例**
无

**响应参数**

| 参数名  | 类型   | 描述                     |
| ------- | ------ | ------------------------ |
| code    | int    | 状态码                   |
| message | string | 返回信息                 |
| data    | object | 返回数据（包含版本信息） |

**响应示例**

```json
{
  "id": 194048914452779008,
  "code": 200,
  "data": "123",
  "total": null,
  "message": "请求成功"
}
```

### 5. 获取公告

**接口描述**
该接口用于获取系统的最新公告信息。

**请求方法**
`GET`

**请求URL**
`https://api.easyverify.mian-ju.cn/api/v1/接口地址`

**请求参数**
无

**请求示例**
无

**响应参数**

| 参数名  | 类型   | 描述                     |
| ------- | ------ | ------------------------ |
| code    | int    | 状态码                   |
| message | string | 返回信息                 |
| data    | object | 返回数据（包含公告信息） |

**响应示例**

```json
{
  "id": 194050586289770496,
  "code": 200,
  "data": "这是一条公告",
  "total": null,
  "message": "请求成功"
}
```

### 6. 获取指定用户到期时间

**接口描述**
该接口用于获取指定用户的到期时间。可以通过用户名或激活码查询。

**请求方法**
`GET`

**请求URL**
`https://api.easyverify.mian-ju.cn/api/v1/接口地址`

**请求参数**

| 参数名   | 类型   | 是否必填 | 描述   |
| -------- | ------ | -------- | ------ |
| username | string | 否       | 用户名 |
| code     | string | 否       | 激活码 |

> 注意：`username` 和 `code` 至少需要填写一个。

**请求示例**

```json
{
  "username": "user"
}
```

```json
{
  "code": "185E125BDF7C496C9CAFEBBB"
}
```



### 7. 是否为当前最新版本

**接口描述**
该接口用于检查传入的版本号是否为系统的最新版本。

**请求方法**
`POST`

**请求URL**
`https://api.easyverify.mian-ju.cn/api/v1/接口地址`

**请求参数**

| 参数名  | 类型   | 是否必填 | 描述   |
| ------- | ------ | -------- | ------ |
| version | string | 是       | 版本号 |

请求示例

```json
{
  "version": "1.0.0"
}
```

### 8. 修改用户密码

**接口描述**
> 注意！该操作属于敏感操作，需要用户身份码进行权限验证！

该接口用于修改指定用户的密码。

**请求方法**
`POST`

**请求URL**
`https://api.easyverify.mian-ju.cn/api/v1/接口地址`

**请求参数**

| 参数名   | 类型   | 是否必填 | 描述   |
| -------- | ------ | -------- | ------ |
| username | string | 是       | 用户名 |
| password | string | 是       | 新密码 |
| idCode | string | 是       | 身份码（登陆时返回） |

**请求示例**

```json
{
  "username": "user",
  "password": "newpassword",
  "idCode": "CB02EF1F75CE472BA09A5C404E470ED9"
}
```
