# 停车场管理系统API文档


**简介**:停车场管理系统API文档


**HOST**:127.0.0.1:8080


**联系人**:管理员


**Version**:1.0


**接口路径**:/v2/api-docs


[TOC]






# 学生管理


## 添加学生


**接口地址**:`/student`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>创建新的学生</p>



**请求示例**:


```javascript
{
  "id": 1,
  "identityDocumentType": 0,
  "identityDocumentNumber": 110101199001011234,
  "name": "张三",
  "email": "zhangsan@example.com",
  "phone": 13800138000,
  "password": "password123"
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|studentVO|用于前后端交互的学生数据|body|true|学生视图对象|学生视图对象|
|&emsp;&emsp;id|学生ID||false|integer(int64)||
|&emsp;&emsp;identityDocumentType|证件类型,可用值:0,1||false|integer(int32)||
|&emsp;&emsp;identityDocumentNumber|证件号码||true|string||
|&emsp;&emsp;name|姓名||true|string||
|&emsp;&emsp;email|邮箱||false|string||
|&emsp;&emsp;phone|手机号||false|string||
|&emsp;&emsp;password|密码||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|操作成功|Result|
|201|Created||
|400|参数错误||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||
|500|服务器内部错误||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||object||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {},
	"message": ""
}
```


## 更新学生


**接口地址**:`/student`


**请求方式**:`PUT`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>修改现有学生信息</p>



**请求示例**:


```javascript
{
  "id": 1,
  "identityDocumentType": 0,
  "identityDocumentNumber": 110101199001011234,
  "name": "张三",
  "email": "zhangsan@example.com",
  "phone": 13800138000,
  "password": "password123"
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|studentVO|用于前后端交互的学生数据|body|true|学生视图对象|学生视图对象|
|&emsp;&emsp;id|学生ID||false|integer(int64)||
|&emsp;&emsp;identityDocumentType|证件类型,可用值:0,1||false|integer(int32)||
|&emsp;&emsp;identityDocumentNumber|证件号码||true|string||
|&emsp;&emsp;name|姓名||true|string||
|&emsp;&emsp;email|邮箱||false|string||
|&emsp;&emsp;phone|手机号||false|string||
|&emsp;&emsp;password|密码||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|操作成功|Result|
|201|Created||
|400|参数错误||
|401|Unauthorized||
|403|Forbidden||
|404|学生不存在||
|500|服务器内部错误||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||object||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {},
	"message": ""
}
```


## 获取学生列表


**接口地址**:`/student/list`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>分页获取学生列表，可根据姓名和证件号筛选</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|current|页码|query|false|integer(int32)||
|identityDocumentNumber|证件号|query|false|string||
|name|姓名|query|false|string||
|size|每页条数|query|false|integer(int32)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|操作成功|Result|
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||
|500|服务器内部错误||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||object||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {},
	"message": ""
}
```


## 根据ID获取学生


**接口地址**:`/student/{id}`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>通过学生ID获取学生详细信息</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|学生ID|path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|操作成功|Result|
|401|Unauthorized||
|403|Forbidden||
|404|学生不存在||
|500|服务器内部错误||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||object||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {},
	"message": ""
}
```


## 删除学生


**接口地址**:`/student/{id}`


**请求方式**:`DELETE`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>通过学生ID删除学生</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|学生ID|path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|操作成功|Result|
|204|No Content||
|401|Unauthorized||
|403|Forbidden||
|404|学生不存在||
|500|服务器内部错误||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||object||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {},
	"message": ""
}
```


# 考场管理


## 添加考场


**接口地址**:`/exam-room`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>创建新的考场</p>



**请求示例**:


```javascript
{
  "id": 1,
  "examSiteId": 1,
  "roomNumber": "A101"
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|examRoomVO|用于前后端交互的考场数据|body|true|考场视图对象|考场视图对象|
|&emsp;&emsp;id|考场ID||false|integer(int64)||
|&emsp;&emsp;examSiteId|所属考点ID||true|integer(int64)||
|&emsp;&emsp;roomNumber|考场号||true|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|操作成功|Result|
|201|Created||
|400|参数错误||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||
|500|服务器内部错误||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||object||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {},
	"message": ""
}
```


## 更新考场


**接口地址**:`/exam-room`


**请求方式**:`PUT`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>修改现有考场信息</p>



**请求示例**:


```javascript
{
  "id": 1,
  "examSiteId": 1,
  "roomNumber": "A101"
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|examRoomVO|用于前后端交互的考场数据|body|true|考场视图对象|考场视图对象|
|&emsp;&emsp;id|考场ID||false|integer(int64)||
|&emsp;&emsp;examSiteId|所属考点ID||true|integer(int64)||
|&emsp;&emsp;roomNumber|考场号||true|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|操作成功|Result|
|201|Created||
|400|参数错误||
|401|Unauthorized||
|403|Forbidden||
|404|考场不存在||
|500|服务器内部错误||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||object||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {},
	"message": ""
}
```


## 获取考场列表


**接口地址**:`/exam-room/list`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>分页获取考场列表，可根据考场号和考点ID筛选</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|current|页码|query|false|integer(int32)||
|examSiteId|考点ID|query|false|integer(int64)||
|roomNumber|考场号|query|false|string||
|size|每页条数|query|false|integer(int32)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|操作成功|Result|
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||
|500|服务器内部错误||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||object||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {},
	"message": ""
}
```


## 根据ID获取考场


**接口地址**:`/exam-room/{id}`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>通过考场ID获取考场详细信息</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|考场ID|path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|操作成功|Result|
|401|Unauthorized||
|403|Forbidden||
|404|考场不存在||
|500|服务器内部错误||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||object||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {},
	"message": ""
}
```


## 删除考场


**接口地址**:`/exam-room/{id}`


**请求方式**:`DELETE`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>通过考场ID删除考场</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|考场ID|path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|操作成功|Result|
|204|No Content||
|401|Unauthorized||
|403|Forbidden||
|404|考场不存在||
|500|服务器内部错误||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||object||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {},
	"message": ""
}
```


# 考点管理


## 添加考点


**接口地址**:`/exam-site`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>创建新的考点</p>



**请求示例**:


```javascript
{
  "id": 1,
  "name": "北京大学考点",
  "address": "北京市海淀区颐和园路5号",
  "totalSeat": 1000,
  "usedSeat": 500
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|examSiteVO|用于前后端交互的考点数据|body|true|考点视图对象|考点视图对象|
|&emsp;&emsp;id|考点ID||false|integer(int64)||
|&emsp;&emsp;name|考点名称||true|string||
|&emsp;&emsp;address|考点地址||true|string||
|&emsp;&emsp;totalSeat|座位总数||false|integer(int32)||
|&emsp;&emsp;usedSeat|已用座位数||false|integer(int32)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|操作成功|Result|
|201|Created||
|400|参数错误||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||
|500|服务器内部错误||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||object||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {},
	"message": ""
}
```


## 更新考点


**接口地址**:`/exam-site`


**请求方式**:`PUT`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>修改现有考点信息</p>



**请求示例**:


```javascript
{
  "id": 1,
  "name": "北京大学考点",
  "address": "北京市海淀区颐和园路5号",
  "totalSeat": 1000,
  "usedSeat": 500
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|examSiteVO|用于前后端交互的考点数据|body|true|考点视图对象|考点视图对象|
|&emsp;&emsp;id|考点ID||false|integer(int64)||
|&emsp;&emsp;name|考点名称||true|string||
|&emsp;&emsp;address|考点地址||true|string||
|&emsp;&emsp;totalSeat|座位总数||false|integer(int32)||
|&emsp;&emsp;usedSeat|已用座位数||false|integer(int32)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|操作成功|Result|
|201|Created||
|400|参数错误||
|401|Unauthorized||
|403|Forbidden||
|404|考点不存在||
|500|服务器内部错误||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||object||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {},
	"message": ""
}
```


## 获取考点列表


**接口地址**:`/exam-site/list`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>分页获取考点列表，可根据考点名称进行筛选</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|current|页码|query|false|integer(int32)||
|name|考点名称|query|false|string||
|size|每页条数|query|false|integer(int32)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|操作成功|Result|
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||
|500|服务器内部错误||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||object||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {},
	"message": ""
}
```


## 根据ID获取考点


**接口地址**:`/exam-site/{id}`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>通过考点ID获取考点详细信息</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|考点ID|path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|操作成功|Result|
|401|Unauthorized||
|403|Forbidden||
|404|考点不存在||
|500|服务器内部错误||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||object||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {},
	"message": ""
}
```


## 删除考点


**接口地址**:`/exam-site/{id}`


**请求方式**:`DELETE`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>通过考点ID删除考点</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|考点ID|path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|操作成功|Result|
|204|No Content||
|401|Unauthorized||
|403|Forbidden||
|404|考点不存在||
|500|服务器内部错误||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||object||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {},
	"message": ""
}
```


# 考试信息管理


## 添加考试信息


**接口地址**:`/exam-info`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>创建新的考试信息</p>



**请求示例**:


```javascript
{
  "id": 1,
  "studentId": 1,
  "examSeatId": 1,
  "examTime": {
    "date": 0,
    "hours": 0,
    "minutes": 0,
    "month": 0,
    "nanos": 0,
    "seconds": 0,
    "time": 0,
    "year": 0
  },
  "examType": "笔试",
  "examLevel": "四级"
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|examInfoVO|用于前后端交互的考试信息数据|body|true|考试信息视图对象_1|考试信息视图对象_1|
|&emsp;&emsp;id|考试信息ID||false|integer(int64)||
|&emsp;&emsp;studentId|学生ID||true|integer(int64)||
|&emsp;&emsp;examSeatId|座位ID||true|integer(int64)||
|&emsp;&emsp;examTime|考试时间||true|Timestamp_1|Timestamp_1|
|&emsp;&emsp;&emsp;&emsp;date|||false|integer||
|&emsp;&emsp;&emsp;&emsp;hours|||false|integer||
|&emsp;&emsp;&emsp;&emsp;minutes|||false|integer||
|&emsp;&emsp;&emsp;&emsp;month|||false|integer||
|&emsp;&emsp;&emsp;&emsp;nanos|||false|integer||
|&emsp;&emsp;&emsp;&emsp;seconds|||false|integer||
|&emsp;&emsp;&emsp;&emsp;time|||false|integer||
|&emsp;&emsp;&emsp;&emsp;year|||false|integer||
|&emsp;&emsp;examType|考试类型||true|string||
|&emsp;&emsp;examLevel|考试级别||true|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|操作成功|Result|
|201|Created||
|400|参数错误||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||
|500|服务器内部错误||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||object||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {},
	"message": ""
}
```


## 更新考试信息


**接口地址**:`/exam-info`


**请求方式**:`PUT`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>修改考试信息</p>



**请求示例**:


```javascript
{
  "id": 1,
  "studentId": 1,
  "examSeatId": 1,
  "examTime": {
    "date": 0,
    "hours": 0,
    "minutes": 0,
    "month": 0,
    "nanos": 0,
    "seconds": 0,
    "time": 0,
    "year": 0
  },
  "examType": "笔试",
  "examLevel": "四级"
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|examInfoVO|用于前后端交互的考试信息数据|body|true|考试信息视图对象_1|考试信息视图对象_1|
|&emsp;&emsp;id|考试信息ID||false|integer(int64)||
|&emsp;&emsp;studentId|学生ID||true|integer(int64)||
|&emsp;&emsp;examSeatId|座位ID||true|integer(int64)||
|&emsp;&emsp;examTime|考试时间||true|Timestamp_1|Timestamp_1|
|&emsp;&emsp;&emsp;&emsp;date|||false|integer||
|&emsp;&emsp;&emsp;&emsp;hours|||false|integer||
|&emsp;&emsp;&emsp;&emsp;minutes|||false|integer||
|&emsp;&emsp;&emsp;&emsp;month|||false|integer||
|&emsp;&emsp;&emsp;&emsp;nanos|||false|integer||
|&emsp;&emsp;&emsp;&emsp;seconds|||false|integer||
|&emsp;&emsp;&emsp;&emsp;time|||false|integer||
|&emsp;&emsp;&emsp;&emsp;year|||false|integer||
|&emsp;&emsp;examType|考试类型||true|string||
|&emsp;&emsp;examLevel|考试级别||true|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|操作成功|Result|
|201|Created||
|400|参数错误||
|401|Unauthorized||
|403|Forbidden||
|404|考试信息不存在||
|500|服务器内部错误||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||object||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {},
	"message": ""
}
```


## 获取考试信息列表


**接口地址**:`/exam-info/list`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>分页获取考试信息列表，可根据学生ID、座位ID、考试类型和级别筛选</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|current|页码|query|false|integer(int32)||
|examLevel|考试级别,可用值:四级,六级|query|false|string||
|examSeatId|座位ID|query|false|integer(int64)||
|examType|考试类型,可用值:笔试,口试|query|false|string||
|size|每页条数|query|false|integer(int32)||
|studentId|学生ID|query|false|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|操作成功|Result|
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||
|500|服务器内部错误||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||object||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {},
	"message": ""
}
```


## 根据ID获取考试信息


**接口地址**:`/exam-info/{id}`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>通过考试信息ID获取详细信息</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|考试信息ID|path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|操作成功|Result|
|401|Unauthorized||
|403|Forbidden||
|404|考试信息不存在||
|500|服务器内部错误||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||object||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {},
	"message": ""
}
```


## 删除考试信息


**接口地址**:`/exam-info/{id}`


**请求方式**:`DELETE`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>通过考试信息ID删除记录</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|考试信息ID|path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|操作成功|Result|
|204|No Content||
|401|Unauthorized||
|403|Forbidden||
|404|考试信息不存在||
|500|服务器内部错误||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||object||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {},
	"message": ""
}
```


# 考试座位管理


## 添加考试座位


**接口地址**:`/exam-seat`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>创建新的考试座位</p>



**请求示例**:


```javascript
{
  "id": 1,
  "examRoomId": 1,
  "status": 0,
  "seatNumber": "A-25"
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|examSeatVO|用于前后端交互的考试座位数据|body|true|考试座位视图对象|考试座位视图对象|
|&emsp;&emsp;id|考试座位ID||false|integer(int64)||
|&emsp;&emsp;examRoomId|所属考场ID||true|integer(int64)||
|&emsp;&emsp;status|考试座位状态,可用值:0,1||false|integer(int32)||
|&emsp;&emsp;seatNumber|座位号||true|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|操作成功|Result|
|201|Created||
|400|参数错误||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||
|500|服务器内部错误||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||object||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {},
	"message": ""
}
```


## 更新考试座位


**接口地址**:`/exam-seat`


**请求方式**:`PUT`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>修改现有考试座位信息</p>



**请求示例**:


```javascript
{
  "id": 1,
  "examRoomId": 1,
  "status": 0,
  "seatNumber": "A-25"
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|examSeatVO|用于前后端交互的考试座位数据|body|true|考试座位视图对象|考试座位视图对象|
|&emsp;&emsp;id|考试座位ID||false|integer(int64)||
|&emsp;&emsp;examRoomId|所属考场ID||true|integer(int64)||
|&emsp;&emsp;status|考试座位状态,可用值:0,1||false|integer(int32)||
|&emsp;&emsp;seatNumber|座位号||true|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|操作成功|Result|
|201|Created||
|400|参数错误||
|401|Unauthorized||
|403|Forbidden||
|404|考试座位不存在||
|500|服务器内部错误||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||object||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {},
	"message": ""
}
```


## 获取考试座位列表


**接口地址**:`/exam-seat/list`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>分页获取考试座位列表，可根据座位号、状态和考场ID筛选</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|current|页码|query|false|integer(int32)||
|examRoomId|考场ID|query|false|integer(int64)||
|seatNumber|座位号|query|false|string||
|size|每页条数|query|false|integer(int32)||
|status|状态(0-未占用，1-占用),可用值:0,1|query|false|integer(int32)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|操作成功|Result|
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||
|500|服务器内部错误||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||object||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {},
	"message": ""
}
```


## 根据ID获取考试座位


**接口地址**:`/exam-seat/{id}`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>通过考试座位ID获取详细信息</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|考试座位ID|path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|操作成功|Result|
|401|Unauthorized||
|403|Forbidden||
|404|考试座位不存在||
|500|服务器内部错误||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||object||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {},
	"message": ""
}
```


## 删除考试座位


**接口地址**:`/exam-seat/{id}`


**请求方式**:`DELETE`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>通过考试座位ID删除</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|考试座位ID|path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|操作成功|Result|
|204|No Content||
|401|Unauthorized||
|403|Forbidden||
|404|考试座位不存在||
|500|服务器内部错误||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||object||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {},
	"message": ""
}
```


# 认证管理


## 学生登录


**接口地址**:`/auth/login`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>通过邮箱或证件号码和密码进行登录认证，返回Token</p>



**请求示例**:


```javascript
{
  "username": "example@school.edu.cn",
  "password": 123456
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|loginVO|用于前后端交互的登录数据|body|true|登录视图对象|登录视图对象|
|&emsp;&emsp;username|邮箱或证件号||true|string||
|&emsp;&emsp;password|密码||true|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|登录成功|Result|
|201|Created||
|400|邮箱/证件号或密码不正确||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||
|500|服务器内部错误||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||object||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {},
	"message": ""
}
```


## 学生登出


**接口地址**:`/auth/logout`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>退出当前登录状态(无状态认证下客户端只需丢弃token)</p>



**请求参数**:


暂无


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|登出成功|Result|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||
|500|服务器内部错误||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||object||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {},
	"message": ""
}
```