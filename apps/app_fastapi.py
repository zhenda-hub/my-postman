from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import httpx
import os

# 获取当前文件的目录
basedir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))

app = FastAPI()

# 挂载静态文件
app.mount("/static", StaticFiles(directory=os.path.join(basedir, "static")), name="static")

# 设置模板
templates = Jinja2Templates(directory=os.path.join(basedir, "templates"))

@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.api_route("/proxy", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def proxy(request: Request):
    try:
        # 获取目标URL
        target_url = request.query_params.get('url')
        if not target_url:
            return JSONResponse(
                content={'error': 'URL is required'},
                status_code=400
            )

        # 构建请求参数
        method = request.method
        headers = {}
        
        # 只转发必要的请求头
        if 'content-type' in request.headers:
            headers['content-type'] = request.headers['content-type']
        
        # 获取请求体
        body = None
        if method in ['POST', 'PUT', 'PATCH']:
            try:
                body = await request.body()
                if body:
                    print(f'Forwarding request data: {body}')
            except Exception as e:
                print(f'Error getting request data: {str(e)}')
                return JSONResponse(
                    content={'error': f'获取请求数据错误: {str(e)}'},
                    status_code=400
                )

        # 发送请求
        async with httpx.AsyncClient() as client:
            response = await client.request(
                method=method,
                url=target_url,
                headers=headers,
                content=body,
                timeout=30.0
            )

            # 返回与 Flask 版本一致的响应格式
            return JSONResponse({
                'status': response.status_code,
                'headers': dict(response.headers),
                'data': response.text,
                'time': response.elapsed.total_seconds() * 1000  # 转换为毫秒
            })

    except httpx.RequestError as e:
        return JSONResponse(
            content={
                'error': f'Proxy error: {str(e)}',
                'status': 500
            },
            status_code=500
        )
