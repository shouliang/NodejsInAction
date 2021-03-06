var http = require('http')
var fs = require('fs')
var path = require('path')
var mime = require('mime')
var cache = {}

function send404(response) {
	response.writeHead(404, {'Content-Type': 'text/plain'})
	response.write('Error 404: resource not found')
	response.end()
}

function sendFile(response, filepath, fileContents) {
	response.writeHead(
		200,
		{"content-type": mime.lookup(path.basename(filepath))}
	)
	response.end(fileContents)
}

function serveStatic(response, cache, absPath) {
	if (cache[absPath]) {
		sendFile(response, absPath, cache[absPath])
	} else {
		fs.exists(absPath, function(exists) {
			if (exists) {
				fs.readFile(absPath, function(err, data) {
					if (err) {
						console.log('readFile error:' + err)
						send404(response)
					} else {
						cache[absPath] = data
						sendFile(response, absPath, data)
					}
				})
			} else {
				console.log('file not exists')
				send404(response)
			}
		})
	}
}

var server = http.createServer(function(request, response) {
	var filepath = false

	if (request.url == '/') {
		filepath = 'public/index.html'
	} else{
		filepath = 'public' + request.url
	}

	var absPath = './' + filepath

	serveStatic(response, cache, absPath)
})

server.listen(3000, function(){
	console.log('Server listening on port 3000')
})

//启动Socket.IO服务器
var chatServer = require('./lib/chat_server')
chatServer.listen(server)






