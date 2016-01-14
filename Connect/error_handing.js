var connect = require('connect')
var app = connect()

function badMiddleware(req,res,next) {
	next(new Error('Bad middleware makes error'))
}

function hello(req, res) {
	res.end('Hello world')
}

function errorHandler(){
	var env = process.env.NODE_ENV || 'development'
	return function(err, req, res, next) { //错误处理函数有四个参数，第一个为err
		res.statusCode = 500
		switch(env) {
			case 'development' :
				res.setHeader('Content-Type','application/json')
				res.end(JSON.stringify(err))
				break
			default :
				res.end('Server error')
		}
	}
}

app.use(badMiddleware)
app.use(hello) //badMiddleware发生错误，会跳过执行hello,直接跳到错误处理程序errorHandler
app.use(errorHandler)
app.listen(3000)


