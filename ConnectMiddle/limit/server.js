var connect = require('connect')
var app = connect()
var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended: false}))

app.listen(3000)
