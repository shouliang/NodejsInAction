//on为监听 emit才能触发on监听的事件 emit事件的参数对应传递到on监听的函数的参数上
var events = require('events')
var net = require('net')

var channel = new events.EventEmitter()
channel.clients = {}
channel.subscriptions = {}

channel.on('join', function(id, client) {
	console.log('client id:' + id +'  has join the chat.\n')
	this.clients[id] = client
	this.subscriptions[id] = function(senderId,message){
		if (id != senderId) {
			this.clients[id].write(message)
		}
	}
	this.on('broadcast', this.subscriptions[id])
})


channel.on('leave', function(id) {
	channel.removeListener('broadcast',this.subscriptions[id])
    channel.emit('broadcast',id,id + " has left the chat.\n")
})

channel.on('shutdown', function() {
	channel.emit('broadcast','',"Chat has shut down.\n")
	channel.removeAllListeners('broadcast') //移除所有的事件监听者
})

var server = net.createServer(function (client) {
	var id = client.remoteAddress + ':' + client.remotePort

	channel.emit('join',id, client)

	client.on('data', function(data) {
		data = data.toString()
		if (data == "shutdown\r\n") {
			channel.emit('shutdown')
		}
		channel.emit('broadcast',id, data)
	})

	client.on('close', function() {
		channel.emit('leave', id)
	})

})

server.listen(8888, function() {
	console.log('server listen at port 8888')
})
