
//加法函数
function accAdd(arg1, arg2) {
    var r1, r2, m;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    return (arg1 * m + arg2 * m) / m;
} 
//给Number类型增加一个add方法，，使用时直接用 .add 即可完成计算。 
Number.prototype.add = function (arg) {
    return accAdd(arg, this);
};


//减法函数
function Subtr(arg1, arg2) {
    var r1, r2, m, n;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
     //last modify by deeka
     //动态控制精度长度
    n = (r1 >= r2) ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);
}

//给Number类型增加一个add方法，，使用时直接用 .sub 即可完成计算。 
Number.prototype.sub = function (arg) {
    return Subtr(this, arg);
};


//乘法函数
function accMul(arg1, arg2) {
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length;
    }
    catch (e) {
    }
    try {
        m += s2.split(".")[1].length;
    }
    catch (e) {
    }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
} 
//给Number类型增加一个mul方法，使用时直接用 .mul 即可完成计算。 
Number.prototype.mul = function (arg) {
    return accMul(arg, this);
}; 


//除法函数
function accDiv(arg1, arg2) {
    var t1 = 0, t2 = 0, r1, r2;
    try {
        t1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
    }
    try {
        t2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
    }
    with (Math) {
        r1 = Number(arg1.toString().replace(".", ""));
        r2 = Number(arg2.toString().replace(".", ""));
        return (r1 / r2) * pow(10, t2 - t1);
    }
} 
//给Number类型增加一个div方法，，使用时直接用 .div 即可完成计算。 
Number.prototype.div = function (arg) {
    return accDiv(this, arg);
};
// 平均数
function average(list){
	var num=0
	for(var i=0;i<list.length;i++){
		// console.log(num,item)
		num=num.add(list[i]);
	}
	num=num.div(list.length);
	return num.toFixed(2);
}
// 中位数
function median(list){
	var listLen=list.length;
	list.sort(function(a,b){return a>b?1:-1});
	if (listLen%2==1){
		return list[(listLen-1)/2];
	}else{
		return average(list.slice(listLen/2-1,listLen/2+1));
	}
}
// 平均差
function meanDeviation(list){
	var ave=+average(list);
	var listLen=list.length;
	var num=0;
	var item;
	for(var i=0;i<listLen;i++){
		item=ave.sub(list[i]);
		item=Math.abs(item);
		num=num.add(item);
	}
	num=num.div(listLen);
	return num.toFixed(2);

}
// 标准差|方差
function SD(list){
var ave=+average(list);
	var listLen=list.length;
	var num=0;
	var item;
	for(var i=0;i<listLen;i++){
		item=ave.sub(list[i]);
		item=Math.pow(item,2);
		num=num.add(item);
	}
	num=num.div(listLen);
	num=Math.sqrt(num);
	return num.toFixed(2);
}
// 极差
function range(list){
	list.sort(function(a,b){return a>b?1:-1});
	var min=list[0];
	var max=list[list.length-1]
	var num=+max.sub(min);
	return num.toFixed(2);
}
// var a=range([1,1,3,3])
// console.log(a)