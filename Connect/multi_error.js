var connect = require('connect')
var app = connect()

var db = {
	users:[
		 { name : 'tobi'},
		 { name : 'loki'},
		 { name : 'jane'}
	]
}

function hello(req, res, next) {
	if (req.url.match(/^\/hello/)) {
		res.end('Hello World\n')
	} else {
		next()
	}
}

function users(req, res, next) {
	var match = req.url.match(/^\/user\/(.+)/)
	console.log("match:" + match)
	if (match) {
		var user
		for (var i = 0; i < db.users.length ; i ++) {
			console.log("db.users[i].name: " + db.users[i].name)
			if (db.users[i].name == match[1]) {
				user = db.users[i].name
				break;
			}

		}
		console.log('user:' + user)
		if (user) {
			res.setHeader('Content-Type','application/json')
			res.end(JSON.stringify(user))
		} else {
			var err = new Error('User not found')
			err.notFound = true
			next(err)
		}
	} else {
		next()
	}
}

function pets(req, res, next) {
	if (req.url.match(/^\/pet\/(.+)/)) {
		foo() //未定义foo函数，会抛出错误
	} else {
		next()
	}
}

function errorHandler(err, req, res, next) {
	console.log(err.stack)
	res.setHeader('Content-Type','application/json')
	if (err.notFound) {
		res.statusCode = 404
		res.end(JSON.stringify({ error : err.message}))
	} else {
		res.statusCode = 500
		res.end(JSON.stringify( { error : 'Internal Server Error'} ))
	}
}

app.use(users)
   .use(pets)
   .use(errorHandler)
   .use(hello)
   .listen(3000)

