var connect = require('connect')
var bodyParser = require('body-parser')
var app = connect()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false}))

// parse application/json
app.use(bodyParser.json())

app.use(function(req, res) {
	res.end('Registered new user: ' + req.body.username)

})

app.listen(3000)
