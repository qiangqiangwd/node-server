
node-server 自写 node 服务器
====

## 项目启动
1、npm install  

2、node app.js 运行服务器  

## 项目结构
>+server             // 服务相关代码存放处<br>
>>+api                // 所有接口的存放地<br>
>>>+modules            // 存放所有接口模块<br>
>>>>+user               // 接口外部名<br>
>>>>login.js         // 最终的接口名，例： /user/login <br>
>>>index.js            // 获取所有接口模块并打包的外部文件<br>
>>+modules<br>
>>>requestHandlers.js  // 若外部请求为接口时的一些操作<br>
>>>router.js           // 对请求的文件进行查询判断并返回<br>
>>>server.js           // 服务初始地，可以设置https和端口等操作<br>
>>+public<br>
>+src            // 静态资源存放点<br>
>+utils          // 其他资源存放地<br>

### 注意：
    1. 在根目录创建 src 文件夹，这个文件夹用于存放静态html文件  
    2. server/api 该文件夹下为接口地址，暂不支持一些比较骚的操作  
    3. router.js 为路由文件，可以修改默认页面（当前为 index.html）  
    4. server.js 可以开启 https，但需要对应的证书