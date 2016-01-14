var parse = require('url').parse

module.exports = function route(obj) {
	return function(req, res, next) {
		if (!obj[req.method]){
			next()
			return
		}
		var routes = obj[req.method]
		console.log("routes:" + routes)
		var url = parse(req.url)
		var paths = Object.keys(routes)
		console.log("paths:" + paths)

		for (var i = 0; i < paths.length; i++) {
			var path = paths[i]
			console.log("path:" + path)
			var fn = routes[path]
			path = path
				.replace(/\//g,'\\/')
				.replace(/:(\w+)/g, '([^\\/]+)')
			console.log('replace path:' + path)
			var re = new RegExp('^' + path + '$')
			console.log('url.pathname:' + url.pathname )
			var captures = url.pathname.match(re)
			console.log('captures:' + captures)
			if (captures) {
				var args = [req, res].concat(captures.slice(1))
				fn.apply(null,args)
				return
			}
		}
		next()
	}
}
