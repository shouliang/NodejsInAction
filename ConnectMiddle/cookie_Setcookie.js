var connect = require('connect')
var cookieParser = require('cookie-parser')
var app = connect()

app.use(function(req, res) {
	res.setHeader('Set-Cookie','foo=bar')
	res.setHeader('Set-Cookie','tobi=ferret;Expires=Tue, 08 2022 10:18:19 GMT')
	res.end()
})

app.listen(3000)
