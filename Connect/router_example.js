var connect = require('connect')
var app = connect()
var router = require('./middleware/router')

var routes = {
	GET : {
		'/users': function(req, res) {
			res.end('tobi','loki','ferret')
		},
		'/user/:id' : function(req, res, id) {
			res.end('user ' + id)
		}
	},
	DELETE : {
		'user/:id' : function(req, res, id) {
			res.end('deleted user ' + id)
		}
	}
}

app.use(router(routes))
app.listen(3000)
