var connect = require('connect')
var cookieParser = require('cookie-parser')
var app = connect()

app.use(cookieParser('liang is a joke'))
app.use(function(req, res) {
	console.log(req.cookies)
	console.log(req.singedCookies)
	res.end('hello\n')
})

app.listen(3000)
