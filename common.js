/*
 * DOM选取
 */
//获取
//通过id获取元素节点;
function getId(id) {
	return document.getElementById(id);
}
//通过类名获取类数组:
function getClass(className) {
	return document.getElementsByClassName(className);
}
//通过tagName获取类数组:
function getTagName(parent, tagName) {
	return parent.getElementsByTagName(tagName);
}
//创建DOM节点:
function crtDom(tagName) {
	return document.createElement(tagName);
}

//封装随机颜色
function randomColr() {
	var str = '0123456789abcdef';
	var color = "#";
	for (var i = 0; i < 6; i++) {
		var idx = parseInt(Math.random() * str.length);
		color += str[idx];
	}
	return color;
}

/*
 *事件绑定函数
 *兼容IE浏览器
//bind(元素,事件名,事件处理函数,捕获)
//bind(box,'click',function({}))
 *@bind(捆绑): 函数名
 *@ele: 绑定事件的元素
 *@type: 事件类型(事件名)
 *@handler: 事件处理函数
 *@capture: 是否捕获
*/

function bind(ele, type, handler, capture) {
	//标准
	if (ele.addEventListener) {
		ele.addEventListener(type, handler, capture);
	} else if (ele.attachEvent) {
		//ie8-
		ele.attachEvent('on' + type, handler);
	} else {
		ele['on' + type] = handler;
	}

}

/*
 * 封装cookie的操作方法:
 *1.设置 : setCookie(name,val,expires,path)
 *2.设置 : getCookie(name)
 *3.设置 : removeCookie(name)
 * 
 */
function setCookie(name, val, expires, path) {
	var cookie = name + '=' + val;
	//如果有有效期
	if (expires) {
		cookie += ';expires=' + expires;
	}
	//如果有路径
	if (path) {
		cookie += ';path=' + path;
	}
	document.cookie = cookie;
}
//getCookie('carlist');
function getCookie(name) {
	var cookies = document.cookie.split('; ');
	var res = '';
	for (var i = 0; i < cookies.length; i++) {
		var arr = cookies[i].split('=');
		if (arr[0] === name) {
			res = arr[1];
			break;
		}
	}
	return res;
}
// removeCookie('carlist')
function removeCookie(name) {
	var now = new Date();
	now.setDate(now.getDate() - 7);
	setCookie(name, 'xx', now);
}

/*
 * 常用正则表达式
 * 
 * 用户名	/^[a-z0-9_-]{3,16}$/
 * 
 * 密码	/^[a-z0-9_-]{6,18}$/
 * 
 * 十六进制值	/^#?([a-f0-9]{6}|[a-f0-9]{3})$/
 * 身份证		/^(\d{14}|\d{17})[\dx]$/	
 * 生日		/^\d{4}([\/\-]?)\d{1,2}\1\d{1,2}$/
 * 电子邮箱	/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/
			/^[a-z\d]+(\.[a-z\d]+)*@([\da-z](-[\da-z])?)+(\.{1,2}[a-z]+)+$/
 *			/^[\w\.\-]+@[a-zA-Z0-9\-]+(\.[a-zA-Z]+){1,2}$/
 * 
 * URL	/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
 * 
 * IP 地址	/((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)/
/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
 * 
 * 
 * HTML 标签	/^<([a-z]+)([^<]+)*(?:>(.*)<\/\1>|\s+\/>)$/
 * 
 * 删除代码\\注释	(?<!http:|\S)//.*$
 * 
 * Unicode编码中的汉字范围	/^[\u2E80-\u9FFF]+$/
 * 
 */

/*
 * 获取样式方法
 * 标准:getComputedStyle();
 * IE8-:ele.currentStyle;
 * 当对象的属性是一个变量,需要调用该属性时.应该用obj[var];
 * 
 */
function getStyle(ele, attr) {
	//标准浏览器判断
	if (window.getComputedStyle) {
		return getComputedStyle(ele)[attr]
	}
	//IE8-
	else if (ele.currentStyle) {
		return ele.currentStyle[attr];
	}
	//都不符合条件
	else {
		return ele.style[attr];
	}
}

/*
 * 动画效果函数
 * @你妹
 * 无法进行运算的结果为NaN
 * 
 */
/*function animate(ele, attr, target) {
	clearInterval(ele[attr + 'timer']);
	ele[attr + 'timer'] = setInterval(function() {

		var current = parseFloat(getStyle(ele, attr));

		console.log(current);
		//计算速度
		var speed = (target - current) / 10;
		//单位
		var unit = '';
		if (attr === 'opacity') {
			speed = speed.toFixed(2) * 1;
		} else {
			speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
			unit = 'px';
		}
		//达到目标值
		if (current === target || speed == 0) {
			clearInterval(ele[attr + 'timer']);
			current = target - speed;
		}
		ele.style[attr] = current + speed + unit;
	}, 50)
}*/

/*
 * [animate descrition]
 * @ele [执行动画的元素]
 * @opt [动画改变的属性]
 * @callback [回调函数]
 */

function animate(ele, opt, callback) {
	//给ele添加timerLen属性,用于记录定时器的个数
	ele.timerLen = 0;

	//遍历属性,为每一个属性创建一个定时器
	for (var attr in opt) {
		createTimer(attr);
	}

	//创建定时器函数
	function createTimer(attr) {
		//定时器的名字(标识)
		var timerName = attr + 'timer';

		ele.timerLen++;
		//目标值
		var target = opt[attr];

		clearInterval(ele[timerName]);
		ele[timerName] = setInterval(function() {
			var current = getStyle(ele, attr);

			//单位
			var unit = current.match(/[a-z]*$/i)[0];
			current = parseFloat(current);

			//计算速度
			var speed = (target - current) / 10;
			if (attr === 'opacity') {
				speed = speed.toFixed(2) * 1;
			} else {
				speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
				unit = 'px';
			}

			//达到目标值
			if (current === target || speed == 0) {
				clearInterval(ele[timerName]);
				current = target - speed;

				//清除一个定时器就减一次
				ele.timerLen--;

				//所有定时器执行完成后
				if (ele.timerLen === 0 && typeof callback === 'function') {
					callback();
					console.log(ele.timerLen);
				}
			}
			ele.style[attr] = current + speed + unit;
		}, 50)
	}
}

/*
 * @opt:
 * 
 * 
 */
console.log('123')
function ajax(opt) {
	var xhr;
	try {
		xhr = new XMLHttpRequest();
	} catch (error) {
		console.log(error);
		try {
			xhr = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (error) {
			try {
				xhr = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (error) {
				alert('你的世界我不懂~');
			}
		}
	}
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4 && xhr.status === 200) {
			//对象调用方法
			
			opt.callback(xhr.responseText);
		}
	}
	xhr.open(opt.type, opt.URL, opt.async);
	xhr.send();

}