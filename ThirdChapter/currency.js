var canadinaDollar = 0.91;

function roundTwoDecimals(amount) {
	return Math.round(amount * 100) / 100;
}

exports.canadianToUS = function(canadian){
	return roundTwoDecimals(canadian * canadinaDollar);
}

exports.USToCanadian = function(us){
	return roundTwoDecimals(us / canadinaDollar);
}
