from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import requests

import os

# 获取当前文件的目录
basedir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))

# 创建 Flask 应用，指定模板和静态文件目录
app = Flask(__name__,
           template_folder=os.path.join(basedir, 'templates'),
           static_folder=os.path.join(basedir, 'static'))
CORS(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/proxy', methods=['GET', 'POST', 'PUT', 'DELETE', 'PATCH'])
def proxy():
    try:
        # 获取目标URL和请求数据
        target_url = request.args.get('url')
        if not target_url:
            return jsonify({'error': 'URL is required'}), 400
            
        # URL已经由用户提供，直接使用

        # 构建请求参数
        method = request.method
        headers = {}
        
        # 只转发必要的请求头
        if 'Content-Type' in request.headers:
            headers['Content-Type'] = request.headers['Content-Type']
        
        # 获取请求体
        data = None
        if request.get_data():
            try:
                # 直接获取原始数据
                data = request.get_data()
                print(f'Forwarding request data: {data}')
            except Exception as e:
                print(f'Error getting request data: {str(e)}')
                return jsonify({'error': f'获取请求数据错误: {str(e)}'}), 400

        # 发送请求
        response = requests.request(
            method=method,
            url=target_url,
            headers=headers,
            data=data,
            timeout=30
        )

        # 获取响应内容
        content_type = response.headers.get('Content-Type', '')
        
        # 如果有编码信息，使用指定编码；否则默认使用 utf-8
        if 'charset=' in content_type.lower():
            response.encoding = content_type.lower().split('charset=')[-1].strip()
        else:
            response.encoding = 'utf-8'

        # 返回响应
        return jsonify({
            'status': response.status_code,
            'headers': dict(response.headers),
            'data': response.text,
            'time': response.elapsed.total_seconds() * 1000  # 转换为毫秒
        })

    except Exception as e:
        app.logger.error(f'Proxy error: {str(e)}')
        return jsonify({
            'error': f'Proxy error: {str(e)}',
            'status': 500
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
