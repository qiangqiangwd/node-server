/**
 * === socket.io 实现实时聊天的地方
 */
const ws = require('socket.io');
const fs = require('fs');

// 当前公共参数部分
let count = 0; // 当前连接人数
let totalCount = 0; // 总连接人数

function startSocket(server) {
    // 基于当前web服务开启 socket 实例
    const io = ws(server);

    io.on('connection', function (socket) {
        count++;
        totalCount++;
        console.log('有用户连接，当前连接数：' + count);

        let name = ''; // 用户名

        // 加入群聊
        socket.on('join', function (message) {
            console.log(message);
            name = message.name;
            writeInTxt(name + '加入了群聊，当前在线人数：' + count);

            // 给公众发消息
            socket.broadcast.emit('joinNoticeOther', {
                name: name,
                action: '加入了群聊',
                count: count
            });

            // 给自己发消息
            socket.emit('joinNoticeSelf', {
                count: count,
                id: totalCount
            });
        });

        // 接收客户端发送的信息
        socket.on('message', function (data) {
            writeInTxt(`${data.name}：${data.msg}`);
            // 向所有客户端广播发布的消息
            io.emit('message', data);
        });

        // 监听到连接断开
        socket.on('disconnect', function () {
            count--;
            writeInTxt(name + '离开了群聊，当前在线人数：' + count);
            io.emit('disconnect', {
                count: count,
                name: name,
                action: '退出了群聊',
            });
        });
    });
}

// 将记录写入记事本 data 写入内容
function writeInTxt(data) {
    data = '\r\n' + data; // 前面添加换行
    // writeFile：flag：对写入文件的操作默认为w，encoding：编码，mode：权限
    // writeFile 会覆盖前内容
    // appendFile 追加文件
    fs.appendFile(__dirname + '/chartroomHistory.txt', data, function (err) {
        if (err) {
            console.log('写入失败', err);
            return
        }
        // console.log('写入成功', err);
    });
}

exports.startSocket = startSocket