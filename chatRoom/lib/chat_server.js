var socketio = require('socket.io')
var io
var guestNumber = 1
var nickNames = {}
var namesUsed = []
var currentRoom = {}

exports.listen =  function(server) {
	io = socketio.listen(server)

	io.set('log level', 1) //限定向控制台输出的日志的详细程度

    //定义每个用户连接的处理逻辑
	io.sockets.on('connection', function(socket) {
		//分配用户昵称
		guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed)

		//加入聊天室Lobby
		joinRoom(socket, 'Lobby')

		//处理用户消息
		handleMessageBroadcasting(socket, nickNames)

		//昵称变更请求
		handleNameChangeAttempts(socket, nickNames, namesUsed)

		//聊天室创建和变更
		handleRoomJoining(socket)

		//用户发出请求时 提供已经被占用的聊天室列表
		socket.on('rooms', function() {
			socket.emit('rooms', io.sockets.manager.rooms)
		})

		//用户断开连接后清除
		handleClientDisconnection(socket, nickNames, namesUsed)
	})
}

//分配昵称
function assignGuestName(socket, guestNumber, nickNames, namesUsed) {
	var name = 'Guest' + guestNumber
	nickNames[socket.id] = name
	socket.emit('nameResult', {
		success: true,
		name: name
	})

	namesUsed.push(name)
	return guestNumber + 1
}

//加入聊天室
function joinRoom(socket, room) {
	socket.join(room)  //socket的join方法可直接加入聊天室
	currentRoom[socket.id] = room
	socket.emit('joinResult', {room: room})
	socket.broadcast.to(room).emit('message', {
		text: nickNames[socket.id] + 'has joined' + room + '.'
	})

    //列出该房间的其他用户
	var usersInRoom = io.sockets.clients(room)

	if (usersInRoom.length > 1) {
		var usersInRoomSummary = 'Users currently in ' + room + ':'
		for (var index in usersInRoom) {
			var userSocketId = usersInRoom[index].id
			if (userSocketId != socket.id) {
				if (index > 0) {
					usersInRoomSummary +=','
				}
				usersInRoomSummary += nickNames[userSocketId]
			}
			usersInRoomSummary +='.'
			socket.emit('message', {text: usersInRoomSummary})
		}
	}
}

//昵称变更 （服务器监听客户端的昵称变更的命令）
function handleNameChangeAttempts(socket, nickNames, namesUsed) {
	socket.on('nameAttempt', function(name) {
		if (name.indexOf('Guest') == 0) { //不能以Guest开头
			socket.emit('nameResult', {
				success: false,
				message: 'Names cannot begin with "Guest".'
			})
		} else {
			if (namesUsed.indexOf(name) == -1) {
				var previousName = nickNames[socket.id]
				var previousNameIndex = namesUsed.indexOf(previousName)
				namesUsed.push(name)
				nickNames[socket.id] = name

				delete namesUsed[previousNameIndex]
				socket.emit('nameResult', {
					success: true,
					name: name
				})
			} else {
				socket.emit('nameResult', {
					success: false,
					message: 'That name is already in use'
				})
			}
		}
	})
}

//发送消息 （服务器监听客户端发送的消息）
function handleMessageBroadcasting(socket) {
	socket.on('message', function (message) {
		socket.broadcast.to(message.room).emit('message', {
			text: nickNames[socket.id] + ':' + message.text
 		})
	})
}

//创建房间 （服务器监听客户端的加入房间的命令）
function handleRoomJoining(socket) {
	socket.on('join', function(room) {
		socket.leave(currentRoom[socket.id]) //socket的leave方法，离开当前房间
		joinRoom(socket, room.newRoom)
	})
}

//用户断开连接 移除用户昵称
function handleClientDisconnection(socket) {
	socket.on('disconnect', function() {
		var nameIndex = namesUsed.indexOf(nickNames[socket.id])
		delete namesUsed[nameIndex]
		delete nickNames[socket.id]
	})
}
