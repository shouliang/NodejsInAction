var currency = require('./currency'); //用路径./表明模块跟程序脚本放在同一目录下

console.log("50 Canadian dollars equals this amount of US dollars:")

console.log(currency.canadianToUS(50));

console.log("30 US dollars equals this amount of Canadian dollars:");

console.log(currency.USToCanadian(30));
