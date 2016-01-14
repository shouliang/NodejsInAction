//客户端的Chat对象
var Chat = function(socket) {
	this.socket = socket
}

//通过Socket发送消息到服务器
Chat.prototype.sendMessage = function(room, text) {
	var message = {
		room: room,
		text: text
	}
	this.socket.emit('message', message)
}

//客户端请求服务器端加入聊天室
Chat.prototype.changeRoom = function(room) {
	this.socket.emit('join', {
		newRoom: room
	})
}

//客户端处理命令
Chat.prototype.processCommand = function(command) {
  var words = command.split(' ');
  var command = words[0]
                .substring(1, words[0].length)
                .toLowerCase();
  var message = false;

  switch(command) {
    case 'join':
      words.shift(); //shift移除数组中的第一个元素
      var room = words.join(' '); //以空格连接数组中的元素
      this.changeRoom(room);
      break;
    case 'nick':
      words.shift();
      var name = words.join(' ');
      this.socket.emit('nameAttempt', name);
      break;
    default:
      message = 'Unrecognized command.';
      break;
  };

  return message;
};
