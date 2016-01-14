//定义构造函数
function Watcher(watchDir, processedDir) {
	this.watchDir = watchDir
	this.processedDir = processedDir
}

var events = require('events')
var util = require('util')

//继承event.EventEmitter
util.inherits(Watcher, events.EventEmitter)

var fs = require('fs')
var watchDir = './watch'
var processedDir = './done'

//自定义watch与start方法
Watcher.prototype.watch = function() {
	var watcher = this
	fs.readdir(this.watchDir, function(err, files) {
		if (err) throw err
	    for (index in files) {
	    	watcher.emit('process', files[index])
	    }
	})
}

Watcher.prototype.start = function() {
	var watcher = this
	fs.watchFile(watchDir, function() {
		watcher.watch()
	})
}

//new一个watcher对象
var watcher = new Watcher(watchDir, processedDir)

//因为watcher继承自event.EventEmitter,故可以通过添加on方法来实现监听
watcher.on('process', function process(file) {
	var watchFile = this.watchDir + '/' + file
	var processedFile = this.processedDir + '/' + file.toLowerCase()

    fs.rename(watchFile,processedFile, function(err) {
    	if (err) throw err
    })

})

watcher.start()
