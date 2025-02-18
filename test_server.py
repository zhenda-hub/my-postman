from flask import Flask, jsonify, request
from flask_cors import CORS
import time

app = Flask(__name__)
CORS(app)

# 模拟数据库
users = {
    1: {"id": 1, "name": "张三", "email": "zhangsan@example.com"},
    2: {"id": 2, "name": "李四", "email": "lisi@example.com"}
}

@app.route('/api/users', methods=['GET'])
def get_users():
    """获取所有用户"""
    return jsonify(list(users.values()))

@app.route('/api/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    """获取单个用户"""
    user = users.get(user_id)
    if user is None:
        return jsonify({"error": "用户不存在"}), 404
    return jsonify(user)

@app.route('/api/users', methods=['POST'])
def create_user():
    """创建新用户"""
    data = request.get_json()
    if not data or not data.get('name') or not data.get('email'):
        return jsonify({"error": "需要提供name和email"}), 400
    
    new_id = max(users.keys()) + 1 if users else 1
    new_user = {
        "id": new_id,
        "name": data['name'],
        "email": data['email']
    }
    users[new_id] = new_user
    return jsonify(new_user), 201

@app.route('/api/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    """更新用户信息"""
    if user_id not in users:
        return jsonify({"error": "用户不存在"}), 404
    
    data = request.get_json()
    if not data:
        return jsonify({"error": "没有提供更新数据"}), 400
    
    user = users[user_id]
    user['name'] = data.get('name', user['name'])
    user['email'] = data.get('email', user['email'])
    return jsonify(user)

@app.route('/api/users/<int:user_id>', methods=['PATCH'])
def patch_user(user_id):
    """部分更新用户信息"""
    if user_id not in users:
        return jsonify({"error": "用户不存在"}), 404
    
    data = request.get_json()
    if not data:
        return jsonify({"error": "没有提供更新数据"}), 400
    
    user = users[user_id]
    if 'name' in data:
        user['name'] = data['name']
    if 'email' in data:
        user['email'] = data['email']
    return jsonify(user)

@app.route('/api/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    """删除用户"""
    if user_id not in users:
        return jsonify({"error": "用户不存在"}), 404
    
    del users[user_id]
    return '', 204

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
