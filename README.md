# My Postman

一个轻量级的Web版HTTP请求测试工具，用于测试本地服务器的API接口。

## 功能特点

- 支持多种HTTP请求方法（GET、POST、PUT、DELETE、PATCH等）
- 支持自定义请求头（Headers）
- 支持不同格式的请求体（JSON、Form Data、Raw Text）
- 实时显示响应结果和状态码
- 美观的Web界面
- 最小化依赖，易于部署和使用

## 技术栈

### 后端
- Python 3.8+
- 核心依赖：
  - `Flask`: 轻量级Web框架
  - `requests`: HTTP请求库

### 前端
- 原生JavaScript（无需重型框架）
- 基础依赖：
  - `Bootstrap`: 基础样式
  - `highlight.js`: JSON格式化和语法高亮

## 项目结构

```
my-postman/
├── static/
│   ├── css/
│   │   └── style.css      # 自定义样式
│   └── js/
│       └── main.js        # 前端逻辑
├── templates/
│   └── index.html         # 主页面
├── app.py                 # Flask应用和后端API
├── requirements.txt
└── README.md
```

## 开发计划

1. 前端界面开发
   - 请求方法选择器
   - URL输入框
   - Headers编辑区
   - 请求体编辑器
   - 响应展示区域

2. 后端API实现
   - 代理HTTP请求
   - 错误处理
   - 响应格式化

3. 功能增强
   - 响应数据格式化和语法高亮
   - 请求历史记录（使用LocalStorage）
   - 简单的集合管理

## 界面预览

```
+----------------------------------------+
|  [GET v] http://localhost:8000/api     |
|----------------------------------------|
| Headers                          [+]   |
| Key         Value                      |
| Content-Type application/json          |
|----------------------------------------|
| Body                                   |
| {                                      |
|   "key": "value"                        |
| }                                      |
|----------------------------------------|
| Send                                   |
|----------------------------------------|
| Response                               |
| Status: 200 OK                         |
| Time: 100ms                            |
| {                                      |
|   "result": "success"                   |
| }                                      |
+----------------------------------------+
```

## URL 使用说明

### 本地开发环境

当你在本地运行服务时，直接使用 localhost 加端口号：

```
http://localhost:8000/api/users
http://localhost:8001/api/products
```

### Docker 环境

当使用 Docker Compose 运行时，使用服务名加端口号：

```
http://test_api:8000/api/users
http://other_service:8001/api/products
```

### 生产环境

在生产环境中，直接使用完整的 URL：

```
https://api.example.com/users
https://api2.example.com/products
```

## 使用方式

### 使用 Docker Compose（推荐）

```bash
# 构建并启动服务
docker compose up --build

# 后台运行
docker compose up -d

# 查看日志
docker compose logs -f

# 停止服务
docker compose down
```

### 本地开发（不推荐）

```bash
# 安装依赖
pip install -r requirements.txt

# 运行开发服务器
python app.py
```

服务启动后，在浏览器中访问 `http://localhost:5000` 即可使用。

### 开发说明

- 使用Docker Compose运行时，代码更改会自动重新加载
- 源代码通过volume挂载到容器中，无需重新构建镜像
- 所有依赖都在容器中管理，避免污染本地环境

## 待实现功能

- [ ] 环境变量支持
- [ ] 请求历史保存
- [ ] 请求集合导入/导出
- [ ] 响应数据下载
- [ ] 暗色主题支持
