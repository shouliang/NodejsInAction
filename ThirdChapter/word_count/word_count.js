var fs = require('fs')
var completedTasks = 0
var tasks = []
var wordCounts = {} //注意此处wordCounts为一个对象
var filesDir = './text'

function checkIfComplete() {
	completedTasks++;
	if (completedTasks == tasks.length) {
		for(var index in wordCounts) {
			console.log(index + ": " + wordCounts[index]) // key : value
		}
	}

}

function countWordsInText(text) {
	var words = text
		.toString()
		.toLowerCase()
		.split(/\W+/) // \W匹配一个非单字字符 即匹配一个单词
		.sort()
	for(var index in words) {
		var word = words[index]
		if (word) {
			wordCounts[word] = (wordCounts[word]) ? wordCounts[word] + 1 : 1
			//此处 wordCounts[word]中的[]的用法，是将单词作为wordCounts对象的属性
		}
	}

}

fs.readdir(filesDir, function(err, files) {
	if (err) throw err
	for (var index in files) {
		var task = (function(file) {
			return function() {
				fs.readFile(file, function(err, text) {
					if (err) throw err
					countWordsInText(text)
				    checkIfComplete() //每次要坚持是否全部执行完毕
				})
			}
		})(filesDir + '/' + files[index])
		tasks.push(task)
	}

	for(var index in tasks) {
		tasks[index]()
	}
})

http://nodejs.org/dist/node-v0.4.6.tar.gz
