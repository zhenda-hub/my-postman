document.addEventListener('DOMContentLoaded', function() {
    // 格式化JSON函数
    function formatJson() {
        const requestBody = document.getElementById('requestBody');
        const preview = document.getElementById('requestBodyPreview');
        const body = requestBody.value.trim();
        
        if (!body) {
            preview.parentElement.classList.add('d-none');
            return;
        }
        
        try {
            // 解析JSON并格式化预览
            const parsedBody = JSON.parse(body);
            const formatted = JSON.stringify(parsedBody, null, 2);
            
            // 更新预览区域
            preview.textContent = formatted;
            hljs.highlightElement(preview);
            
            // 显示预览区域
            preview.parentElement.classList.remove('d-none');
        } catch (e) {
            alert(`JSON格式错误: ${e.message}`);
            preview.parentElement.classList.add('d-none');
        }
    }
    
    // 绑定格式化按钮事件
    document.getElementById('formatJson').addEventListener('click', formatJson);

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
            if (body && !['GET', 'HEAD'].includes(method.toUpperCase())) {
                try {
                    // 解析和格式化JSON
                    const parsedBody = JSON.parse(body);
                    requestBody = JSON.stringify(parsedBody);
                    // 美化显示
                    requestBodyTextarea.value = JSON.stringify(parsedBody, null, 2);
                } catch (e) {
                    throw new Error(`JSON格式错误: ${e.message}`);
                }
            } else if (body && ['GET', 'HEAD'].includes(method.toUpperCase())) {
                console.warn('警告: GET/HEAD请求不应该包含请求体，已忽略请求体');
                // 清空请求体输入框
                // document.getElementById('requestBody').value = '';
            }

            // 发送代理请求
            console.log('headers', headers)
            const response = await fetch(`/proxy?url=${encodeURIComponent(url)}`, {
                method: method,
                headers: {
                    ...headers,
                },
                body: requestBody
            });

            const result = await response.json();

            // 更新响应状态
            const responseTime = result.time ? ` - ${result.time.toFixed(0)}ms` : '';
            statusElement.textContent = `${result.status}${responseTime}`;
            statusElement.className = result.status >= 200 && result.status < 300 ? 'success' : 'error';

            // 格式化并显示响应数据
            let displayContent;
            if (typeof result.data === 'object') {
                // 如果是对象，格式化为JSON字符串
                displayContent = JSON.stringify(result.data, null, 2);
            } else {
                // 如果是字符串，尝试解析并格式化JSON
                try {
                    const jsonData = JSON.parse(result.data);
                    displayContent = JSON.stringify(jsonData, null, 2);
                } catch {
                    // 如果不是JSON，直接显示原始内容
                    displayContent = result.data;
                }
            }
            responseElement.value = displayContent;

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
