document.addEventListener('DOMContentLoaded', function() {
    const methodSelect = document.getElementById('method');
    const urlInput = document.getElementById('url');
    const sendButton = document.getElementById('send');
    const addHeaderButton = document.getElementById('addHeader');
    const headersContainer = document.getElementById('headers');
    const requestBodyTextarea = document.getElementById('requestBody');
    const responseElement = document.getElementById('response');
    const statusElement = document.getElementById('status');

    // 添加请求头行
    function addHeaderRow() {
        const headerRow = document.createElement('div');
        headerRow.className = 'header-row';
        headerRow.innerHTML = `
            <input type="text" class="form-control form-control-sm mb-2" placeholder="Key">
            <input type="text" class="form-control form-control-sm mb-2" placeholder="Value">
            <button class="btn btn-sm btn-outline-danger ms-2 mb-2" onclick="this.parentElement.remove()">删除</button>
        `;
        headersContainer.appendChild(headerRow);
    }

    // 获取所有请求头
    function getHeaders() {
        const headers = {};
        const headerRows = headersContainer.getElementsByClassName('header-row');
        for (const row of headerRows) {
            const inputs = row.getElementsByTagName('input');
            const key = inputs[0].value.trim();
            const value = inputs[1].value.trim();
            if (key && value) {
                headers[key] = value;
            }
        }
        return headers;
    }

    // 发送请求
    async function sendRequest() {
        try {
            const method = methodSelect.value;
            const url = urlInput.value.trim();
            
            if (!url) {
                alert('请输入URL');
                return;
            }

            // 准备请求参数
            const headers = getHeaders();
            const body = requestBodyTextarea.value.trim();
            
            // 更新UI状态
            sendButton.disabled = true;
            responseElement.textContent = '发送请求中...';
            statusElement.textContent = '';
            statusElement.className = '';

            // 准备请求体
            let requestBody = undefined;
            // 只在非GET/HEAD请求且有请求体时处理
            if (body && !['GET', 'HEAD'].includes(method.toUpperCase())) {
                try {
                    // 先解析JSON来验证格式
                    const parsedBody = JSON.parse(body);
                    // 然后再把对象转回字符串，确保是规范的JSON
                    requestBody = JSON.stringify(parsedBody);
                    console.log('请求体:', requestBody);
                } catch (e) {
                    console.error('解析JSON错误:', e);
                    console.error('原始请求体:', body);
                    throw new Error(`JSON格式错误: ${e.message}`);
                }
            } else if (body && ['GET', 'HEAD'].includes(method.toUpperCase())) {
                console.warn('警告: GET/HEAD请求不应该包含请求体，已忽略请求体');
                // 清空请求体输入框
                // document.getElementById('requestBody').value = '';
            }

            // 发送代理请求
            const response = await fetch(`/proxy?url=${encodeURIComponent(url)}`, {
                method: method,
                headers: {
                    ...headers,
                    'Content-Type': 'application/json'
                },
                body: requestBody
            });

            const result = await response.json();

            // 更新响应状态
            const responseTime = result.time ? ` - ${result.time.toFixed(0)}ms` : '';
            statusElement.textContent = `${result.status}${responseTime}`;
            statusElement.className = result.status >= 200 && result.status < 300 ? 'success' : 'error';

            // 格式化并显示响应
            let formattedResponse;
            try {
                // 尝试解析JSON
                const jsonData = JSON.parse(result.data);
                formattedResponse = JSON.stringify(jsonData, null, 2);
            } catch {
                // 如果不是JSON，直接显示
                formattedResponse = result.data;
            }

            responseElement.textContent = formattedResponse;
            // 检查hljs是否可用
            if (window.hljs) {
                hljs.highlightElement(responseElement);
            }

        } catch (error) {
            statusElement.textContent = '请求失败';
            statusElement.className = 'error';
            responseElement.textContent = error.message;
        } finally {
            sendButton.disabled = false;
        }
    }

    // 事件监听
    addHeaderButton.addEventListener('click', addHeaderRow);
    sendButton.addEventListener('click', sendRequest);

    // 添加两个常用的默认请求头行
    addHeaderRow(); // Content-Type
    const firstRow = headersContainer.firstElementChild;
    const firstInputs = firstRow.getElementsByTagName('input');
    firstInputs[0].value = 'Content-Type';
    firstInputs[1].value = 'application/json';
});
