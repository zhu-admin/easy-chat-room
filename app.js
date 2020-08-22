const ws = require('nodejs-websocket')

const TYPE_ENTER = 0;//加入聊天
const TYPE_LEAVE = 1;//离开聊天
const TYPE_MSG = 2;//正常聊天

//记录当前连接的总的数量
let count = 0;

const server = ws.createServer(conn => {
  console.log('新的连接');
  count++;

  //自定义用户名
  conn.username = `用户${count}`;
  //1.告诉所有用户，有人加入聊天室
  /**
   * type: 0 表示进入 1 表示离开 2 正常聊天
   * msg: 数据
   * time: 时间 
   * toLocaleTimeString(): 时间格式
   */
  broadcast({
    type: TYPE_ENTER,
    msg: `${conn.username}进入聊天室`,
    time: new Date().toLocaleTimeString(),
  })

  //接收到浏览器数据
  conn.on('text', data => {
    //2.聊天的消息
    broadcast({
      type: TYPE_MSG,
      msg: data,
      time: new Date().toLocaleTimeString(),
    })
  })
  //断开连接
  conn.on('close', () => {
    console.log('关闭连接');
    count--;

    //3.告诉所有用户，有人离开聊天室
    broadcast({
      type: TYPE_LEAVE,
      msg: `${conn.username}离开聊天室`,
      time: new Date().toLocaleTimeString(),
    })
  })
  //处理异常
  conn.on('error', () => {
    console.log('发生异常');
  })
})

//广播，给所有用户发送消息
function broadcast(msg) {
  //server.connections：表示所有用户
  server.connections.forEach(item => {
    item.send(JSON.stringify(msg))
  })
}

//监听3000端口
server.listen(3000, () => {
  console.log('监听3000端口');
})