
GET 请求:

获取所有用户:
http://test_api:8000/api/users

获取单个用户: 
http://test_api:8000/api/users/1

POST 请求:
创建新用户: 
http://test_api:8000/api/users
```json
{
    "name": "王五",
    "email": "wangwu@example.com"
}
```

PUT 请求:
更新用户: 
http://test_api:8000/api/users/1
```json
{
    "name": "张三丰",
    "email": "zhangsanfeng@example.com"
}
```

PATCH 请求:
部分更新用户: 
http://test_api:8000/api/users/1
```json
{
    "name": "张三丰"
}
```

DELETE 请求:
删除用户: 
http://test_api:8000/api/users/1


https://baidu.com
