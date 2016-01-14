var fs = require('fs')
var path = require('path')
var args = process.argv.splice(2)
var command = args.shift()
var taskDescription = args.join(' ')
var file = path.join(process.cwd(), './tasks')

switch(command) {
	case 'list' :
		listTasks(file)
		break

	case 'add' :
		addTask(file, taskDescription)
		break

	default:
		console.log('Usage: ' + process.argv[0]
			+ '  list|add [taskDescription]')
}

//从文件中读取内容到tasks中，并回调
function loadOrInitializeTaskArray(file,cb) {
	fs.exists(file, function(exists) {
		var tasks = []
		if (exists) {
			fs.readFile(file,'utf8', function(err, data) {
				if (err) throw err
			    var data = data.toString()
			    var tasks = JSON.parse(data || '[]')
			    cb(tasks)
			})
		} else {
			cb([])
		}
	})
}

//列出文件中的task
function listTasks(file) {
	loadOrInitializeTaskArray(file, function(tasks) {
		for (var i in tasks) {
			console.log(tasks[i])
		}
	})
}

//添加task
function addTask(file, taskDescription) {
	loadOrInitializeTaskArray(file,function(tasks) {
		tasks.push(taskDescription)
		storeTasks(file, tasks)
	})
}

//保存task到文件
function storeTasks(file, tasks) {
	fs.writeFile(file, JSON.stringify(tasks),'utf8', function(err) {
		if (err) throw err
		console.log('Saved.')
	})
}


