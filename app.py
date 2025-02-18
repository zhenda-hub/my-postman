from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
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

        # 构建请求参数
        method = request.method
        headers = dict(request.headers)
        # 移除不需要转发的头部
        headers.pop('Host', None)
        data = request.get_data()

        # 发送请求
        response = requests.request(
            method=method,
            url=target_url,
            headers=headers,
            data=data,
            timeout=30
        )

        # 返回响应
        return jsonify({
            'status': response.status_code,
            'headers': dict(response.headers),
            'data': response.text,
            'time': response.elapsed.total_seconds() * 1000  # 转换为毫秒
        })

    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
