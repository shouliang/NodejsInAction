function asyncFunction(callback) {
	setTimeout(function() {
		callback()
	},200)
}

var color = 'blue' ;
/*
asyncFunction(function() {
	console.log('The color is ' + color)
})
*/

//通过闭包立即调用函数 但是注意前面一个语句需要加上分号;
(function(color){
	asyncFunction(function() {
		console.log('The color is is is ' + color)
	})
})(color)

color = 'green'
