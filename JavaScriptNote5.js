1.跟着underscore学防抖
在前端开发中会遇到一些频繁的事件触发，比如：
window 的 resize、scroll
mousedown、mousemove
keyup、keydown
……
为了解决这个问题，一般有两种解决方案：
debounce 防抖
throttle 节流
防抖
防抖的原理就是：你尽管触发事件，但是我一定在事件触发 n 秒后才执行，如果你在一个事件触发的 n 秒内又触发了这个事件，
那我就以新的事件的时间为准，n 秒后才执行，总之，就是要等你触发完事件 n 秒内不再触发事件，我才执行，真是任性呐!
function debounce(func, wait, immediate) {
    var timeout,  result;
    return function () {
        var context = this;
        var args = arguments;
        if(timeout) clearTimeout(timeout);
        if (immediate) {
            var callNow = !timeout;
            timeout = setTimeout(function() {
                timeout = null;
            }, wait);
            if (callNow) result = func.apply(context, args)
        } else {
            timeout = setTimeout(function() {
                func.apply(context, args)
            }, wait);
        }
        return result;
    }
    
}

到此为止，我们修复了ji小问题：
this 指向
event 对象
立刻执行
返回值
underscore 和lodash函数工具库都要现成的debounce函数,理解函数原理最重要

2.节流
节流的原理很简单：

如果你持续触发事件，每隔一段时间，只执行一次事件。

根据首次是否执行以及结束后是否执行，效果有所不同，实现的方式也有所不同。
我们用 leading 代表首次是否执行，trailing 代表结束后是否再执行一次。

关于节流的实现，有两种主流的实现方式，一种是使用时间戳，一种是设置定时器。

使用时间戳
使用时间戳，当触发事件的时候，我们取出当前的时间戳，然后减去之前的时间戳(最一开始值设为 0 )，
如果大于设置的时间周期，就执行函数，然后更新时间戳为当前的时间戳，如果小于，就不执行。
function throttle(func,wait) {
    var context, args;
    var previous = 0;
    return function() {
        var now = +new Date();
        args = arguments;
        context = this;
        if (now - previous > wait) {
            func.apply(context, args);
            previous = now;
        }
    }
}
container.onmousemove = throttle(getUserAction, 1000);
当鼠标移入的时候，事件立刻执行，每过 1s 会执行一次，如果在 4.2s 停止触发，以后不会再执行事件。


使用定时器
接下来，我们讲讲第二种实现方式，使用定时器。

当触发事件的时候，我们设置一个定时器，再触发事件的时候，如果定时器存在，就不执行，直到定时器执行，然后执行函数，清空定时器，这样就可以设置下个定时器。
// 第二版
function throttle(func, wait) {
    var timeout;
    var previous = 0;

    return function() {
        context = this;
        args = arguments;
        if (!timeout) {
            timeout = setTimeout(function(){
                timeout = null;
                func.apply(context, args)
            }, wait)
        }

    }
}
所以比较两个方法：

第一种事件会立刻执行，第二种事件会在 n 秒后第一次执行

第一种事件停止触发后没有办法再执行事件，第二种事件停止触发后依然会再执行一次事件
这个 throttle 只有三种用法：

container.onmousemove = throttle(getUserAction, 1000);
container.onmousemove = throttle(getUserAction, 1000, {
    leading: false
});
container.onmousemove = throttle(getUserAction, 1000, {
    trailing: false
});
underscore and lodash 已有现成

3.数组去重
双层循环(最原始的方法)
var array = [1,1,'1', '1'];
function unque(array) {
    var res = [];
    for (var i = 0, arrayLen = array.length; i < arrayLen; i++) {
        for(var j = 0, resLen = res.length; j < resLen; j++) {
            if(array[i] === res[j]) {
                break;
            }
            
        }
        // 如果array[i]是唯一的，那么执行完循环，j等于resLen
        if(j === resLen) {
            res.push(array[i])
        }
    }
}
在这个方法中，我们使用循环嵌套，最外层循环 array，里面循环 res，如果 array[i] 的值跟 res[j] 的值相等，就跳出循环，如果都不等于，
说明元素是唯一的，这时候 j 的值就会等于 res 的长度，根据这个特点进行判断，将值添加进 res。
看起来很简单吧，之所以要讲一讲这个方法，是因为——————兼容性好！

indexOf
var array = [1,1,'1'];
function unique(array) {
    var res = [];
    for (var i = 0, len = array.length; i < len; i++) {
        var current = array[i];
        if(res.indexOf(current) === -1) {
            res.push(current);
        }
    }
    return res;
}

排序后去重
试想我们先将要去重的数组使用 sort 方法排序后，相同的值就会被排在一起，然后我们就可以只判断当前元素与上一个元素是否相同，相同就说明重复，不相同就添加进 res，让我们写个 demo：
var array = [1,1,'1'];
function unique(array) {
    var res = [];
    var sortedArray = array.concat().sort();
    var seen;
        
    for(var i = 0, len = sortedArray.length; i < len; i++) {
        if(!i || seen !== sortedArray[i]) {
            res.push(sortedArray[i])
        }
        seen = sortedArray[i]
    }
    return res;
}
如果我们对一个已经排好序的数组去重，这种方法效率肯定高于使用 indexOf。

unique API 
知道了这两种方法后，我们可以去尝试写一个名为 unique 的工具函数，我们根据一个参数 isSorted 判断传入的数组是否是已排序的，
如果为 true，我们就判断相邻元素是否相同，如果为 false，我们就使用 indexOf 进行判断
var array1 = [1, 2, '1', 2, 1];
var array2 = [1, 1, '1', 2, 2];
 function unique(array, isSorted) {
     var res = [];
     var seen = [];
     for(var i = 0, len = array.length; i < len; i++) {
         var value = array[i];
         if(isSorted) {
             if (!i || seen !== value) {
                 res.push(value)
             }
             seen = value
         } else if (res.indexOf(value) === -1)(
         res.push(value);
         )
     }
     return res;
 }
 
 filter 方式
 var array = [1, 2, 1, 1, '1'];
 function unique(array) {
     var res = array.filter(function(item, index, array) {
         return array.indexOf(item) === index;
     });
     return res;
 }
 
 Object键值对
 es6
 function unique(array) {
     return Array.from(new Set(array));
 }
 or 
 function unique(array) {
     return [...new Set(array)];
 }
 or 
 var unique = (a) => [...new Set(a)]
 使用Map
 function unique(arr) {
     const seen = new Map();
     return arr.filter((a) => !seen.has(a) && seen.set(a, 1));
 }
 
 4.类型判断(上)
 typeof  typeof 是一元操作符，放在其单个操作数的前面，操作数可以是任意类型。返回值为表示操作数类型的一个字符串。
 avaScript 共六种数据类型，分别是：
 
 Undefined、Null、Boolean、Number、String、Object
 我们使用 typeof 对这些数据类型的值进行操作的时候，返回的结果却不是一一对应，分别是：
 
 undefined、object、boolean、number、string、object
 
 注意以上都是小写的字符串。Null 和 Object 类型都返回了 object 字符串。
 但是 typeof 却能检测出函数类型：
 
 function a() {}
 
 console.log(typeof a); // function
 所以 typeof 能检测出六种类型的值
 
除此之外 Object 下还有很多细分的类型呐，如 Array、Function、Date、RegExp、Error 等。

如果用 typeof 去检测这些类型，举个例子：

var date = new Date();
var error = new Error();
console.log(typeof date); // object
console.log(typeof error); // object
返回的都是 object 呐，这可怎么区分~ 所以有没有更好的方法呢？


Obejct.prototype.toString
当 toString 方法被调用的时候，下面的步骤会被执行：

如果 this 值是 undefined，就返回 [object Undefined]

如果 this 的值是 null，就返回 [object Null]

让 O 成为 ToObject(this) 的结果

让 class 成为 O 的内部属性 [[Class]] 的值

最后返回由 "[object " 和 class 和 "]" 三个部分组成的字符串

通过规范，我们至少知道了调用 Object.prototype.toString 会返回一个由 "[object " 和 class 和 "]" 组成的字符串，
而 class 是要判断的对象的内部属性。
// 以下是11种：
var number = 1;          // [object Number]
var string = '123';      // [object String]
var boolean = true;      // [object Boolean]
var und = undefined;     // [object Undefined]
var nul = null;          // [object Null]
var obj = {a: 1}         // [object Object]
var array = [1, 2, 3];   // [object Array]
var date = new Date();   // [object Date]
var error = new Error(); // [object Error]
var reg = /a/g;          // [object RegExp]
var func = function a(){}; // [object Function]

function checkType() {
    for (var i = 0; i < arguments.length; i++) {
        console.log(Object.prototype.toString.call(arguments[i]))
    }
}

checkType(number, string, boolean, und, nul, obj, array, date, error, reg, func)
除了以上 11 种之外，还有：

console.log(Object.prototype.toString.call(Math)); // [object Math]
console.log(Object.prototype.toString.call(JSON)); // [object JSON]
除了以上 13 种之外，还有：

function a() {
    console.log(Object.prototype.toString.call(arguments)); // [object Arguments]
}
a();



type API
写一个 type 函数能检测各种类型的值，如果是基本类型，就使用 typeof，引用类型就使用 toString。此外鉴于 typeof 的结果是小写，我也希望所有的结果都是小写。

考虑到实际情况下并不会检测 Math 和 JSON，所以去掉这两个类型的检测。
var class2Type = {};
//生成映射
"Boolean Number String Function Array Date RegExp Object Error Null Undefined".split(" ").map(function(item, index) {
    class2Type["[object" + item + ']'] = item.toLowerCase();
})
function type(obj) {
    return typeof obj === 'object' || typeof obj === 'function' ? class2Type[Object.prototype.toString.call(obj)] || 'object' : ty
typeof obj;
}

// 第二版
var class2type = {};

// 生成class2type映射
"Boolean Number String Function Array Date RegExp Object Error".split(" ").map(function(item, index) {
    class2type["[object " + item + "]"] = item.toLowerCase();
})

function type(obj) {
    // 一箭双雕
    if (obj == null) {
        return obj + "";
    }
    return typeof obj === "object" || typeof obj === "function" ?
        class2type[Object.prototype.toString.call(obj)] || "object" :
        typeof obj;
}

5.类型判断(下)
这一篇我们介绍了 jQuery 的 isPlainObject、isEmptyObject、isWindow、isArrayLike、以及 underscore 的 isElement 实现。


6.深浅拷贝
数组的浅拷贝
如果是数组，我们可以利用数组的一些方法比如：slice、concat 返回一个新数组的特性来实现拷贝。
var arr = ['old', 1, true, null, undefined];

var new_arr = arr.concat();
new_arr[0] = 'new';

console.log(arr) // ["old", 1, true, null, undefined]
console.log(new_arr) // ["new", 1, true, null, undefined]
var new_arr = arr.slice();

但是如果数组嵌套了对象或者数组的话，比如：
var arr = [{old: 'old'}, ['old']];

var new_arr = arr.concat();

arr[0].old = 'new';
arr[1][0] = 'new';

console.log(arr) // [{old: 'new'}, ['new']]
console.log(new_arr) // [{old: 'new'}, ['new']]
我们会发现，无论是新数组还是旧数组都发生了变化，也就是说使用 concat 方法，克隆的并不彻底。

如果数组元素是基本类型，就会拷贝一份，互不影响，而如果是对象或者数组，就会只拷贝对象和数组的引用，这样我们无论在新旧数组进行了修改，两者都会发生变化。

我们把这种复制引用的拷贝方法称之为浅拷贝，与之对应的就是深拷贝，深拷贝就是指完全的拷贝一个对象，即使嵌套了对象，两者也相互分离，修改一个对象的属性，也不会影响另一个。

所以我们可以看出使用 concat 和 slice 是一种浅拷贝。

数组的深拷贝
那如何深拷贝一个数组呢？这里介绍一个技巧，不仅适用于数组还适用于对象
var arr = ['old', 1, true, ['old1', 'old2'], {old: 1}],
var new_arr = JSON.parse(JSON.stringify(arr));
console.warn(new_arr);
是一个简单粗暴的好方法，就是有一个问题，不能拷贝函数，我们做个试验：


浅拷贝的实现
以上三个方法 concat、slice、JSON.stringify 都算是技巧类，可以根据实际项目情况选择使用，接下来我们思考下如何实现一个对象或者数组的浅拷贝。

想一想，好像很简单，遍历对象，然后把属性和属性值都放在一个新的对象不就好了~
var shallowCopy = function(obj) {
    //only clone Obejct
    if (typeof obj !== 'object') return;
    var newObj = obj instanceof Array ? [] : {};
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            newObj[key] = obj[key];
        }
    }
    return newObj;
}

深拷贝的实现
在拷贝的时候判断一下属性值的类型，如果是对象，我们递归调用深拷贝函数不就好了~
var deepCopy = function(obj) {
    if (typeof obj !=== 'object') return;
    var newObj = obj instanceof Array ? [] : {};
    for (var key in obj) {
        if(obj.hasOwnProperty(key)) {
            newObj[key] = typeof obj[key] === 'object' ? deepCopy(obj[key]) : obj[key]
        }
    }
    return newObj;
}

function clone(target) {
    let cloneTarget = {};
    for (const ket in targte) {
        cloneTarget[key] = target[key];
    }
    return cloneTarget;
}

//深度拷贝和考虑到数组
//one way
JSON.parse(JSON.stringify())
//other way
function clone1(target) {
    if (typeof target === 'object') {
        const clonearr = Array.isArray(target) ? [] : {};
        for (const key in target) {
            clonearr[key] = clone(target[key]);
        }
        return clonearr;
    } else {
        return target
    }
}


7.如何求数组的最大值和最小值
			Math.max
			值得注意的是：
			
			如果有任一参数不能被转换为数值，则结果为 NaN。
			
			max 是 Math 的静态方法，所以应该像这样使用：Math.max()，而不是作为 Math 实例的方法 (简单的来说，就是不使用 new )
			
			如果没有参数，则结果为 -Infinity (注意是负无穷大)

			而我们需要分析的是：
			
			1.如果任一参数不能被转换为数值，这就意味着如果参数可以被转换成数字，就是可以进行比较的，比如：
			
			Math.max(true, 0) // 1
			Math.max(true, '2', null) // 2
			Math.max(1, undefined) // NaN
			Math.max(1, {}) // NaN
			2.如果没有参数，则结果为 -Infinity，对应的，Math.min 函数，如果没有参数，则结果为 Infinity，所以：
			
			var min = Math.min();
			var max = Math.max();
			console.log(min > max);
			
			原始方法
			ar arr = [6, 4, 1, 8, 2, 11, 23];
			var result = arr[0];
			for( var i = 1; i < arr.length; i++) {
				result = Math.max(result,arr[i]);
			}
			
			reduce
			function max(pre, next) {
				return Math.max(pre, next);
			}
			console.warn(arr.reduce(max))
			
			sort
			如果我们先对数组进行一次排序，那么最大值就是最后一个值：
			arr.sort(function(a, b) { return a -b});
			console.warn(arr[arr.length - 1])
			
			eval
			var arr = [6, 4, 1, 8, 2, 11, 23];
			
			var max = eval("Math.max(" + arr + ")");
			console.log(max)
			
			apply 
			console.warn(Math.max.apply(null, arr));
			
			ES6 ...
			console.warn(Math.max(...arr));
			
			
			8.数组扁平化
			数组的扁平化，就是将一个嵌套多层的数组 array (嵌套可以是任何层数)转换为只有一层的数组。
			
			举个例子，假设有个名为 flatten 的函数可以做到数组扁平化，效果就会如下：
			
			var arr = [1, [2, [3, 4]]];
			console.log(flatten(arr)) // [1, 2, 3, 4]
			递归
			我们最一开始能想到的莫过于循环数组元素，如果还是一个数组，就递归调用该方法：
			var arr = [1, [2, [3, 4]]];
				
			function flatten(arr) {
				var result = [];
				for(var i = 0, len = arr.length; i < len; i++) {
					if(Array.isArray(arr[i])) {
						result = result.concat(flatten(arr[i]))
					} else {
						result.push(arr[i]);
					}
				}
				return result;
			}
			
			re:
			function flatten(arr) {
				var result = [];
				for(var i ,len = arr.length; i < len; i++) {
					if(Array.isArray(arr[i])) {
						result = result.concat(flatten(arr[i]))
					} else {
						result.push(array[i])
					}
				}
				return result;
			}
			
			toString
			如果数组的元素都是数字，那么我们可以考虑使用 toString 方法，因为：
			
			[1, [2, [3, 4]]].toString() // "1,2,3,4"
			调用 toString 方法，返回了一个逗号分隔的扁平的字符串，这时候我们再 split，然后转成数字不就可以实现扁平化了吗？
			function flatten(arr) {
				return arr.toString().split(',').map(function(item) {
					return item;
				});
			}
			而这种方法使用的场景却非常有限，如果数组是 [1, '1', 2, '2'] 的话，这种方法就会产生错误的结果。
			
			reduce
			// 方法3
			var arr = [1, [2, [3, 4]]];
			
			function flatten(arr) {
			    return arr.reduce(function(prev, next){
			        return prev.concat(Array.isArray(next) ? flatten(next) : next)
			    }, [])
			}
			
			console.log(flatten(arr))
			
			ES6...
			ES6 增加了扩展运算符，用于取出参数对象的所有可遍历属性，拷贝到当前对象之中：
			var arr = [1, [2, [3, 4]]];
			console.log([].concat(...arr)); // [1, 2, [3, 4]]
			我们用这种方法只可以扁平一层，但是顺着这个方法一直思考，我们可以写出这样的方法：
			function flatten(arr) {
				while(arr.some(item => Array.isArray(item))) {
					arr = [].concat(...arr);
				}
				return arr;
			}
			
			undercore
			/**
			 * 数组扁平化
			 * @param  {Array} input   要处理的数组
			 * @param  {boolean} shallow 是否只扁平一层
			 * @param  {boolean} strict  是否严格处理元素，下面有解释
			 * @param  {Array} output  这是为了方便递归而传递的参数
			 * 源码地址：https://github.com/jashkenas/underscore/blob/master/underscore.js#L528
			 */
			function flatten(input, shallow, strict, output) {
			
			    // 递归使用的时候会用到output
			    output = output || [];
			    var idx = output.length;
			
			    for (var i = 0, len = input.length; i < len; i++) {
			
			        var value = input[i];
			        // 如果是数组，就进行处理
			        if (Array.isArray(value)) {
			            // 如果是只扁平一层，遍历该数组，依此填入 output
			            if (shallow) {
			                var j = 0, len = value.length;
			                while (j < len) output[idx++] = value[j++];
			            }
			            // 如果是全部扁平就递归，传入已经处理的 output，递归中接着处理 output
			            else {
			                flatten(value, shallow, strict, output);
			                idx = output.length;
			            }
			        }
			        // 不是数组，根据 strict 的值判断是跳过不处理还是放入 output
			        else if (!strict){
			            output[idx++] = value;
			        }
			    }
			
			    return output;
			
			}
			我们看看 underscore 中哪些方法调用了 flatten 这个基本函数：
			_.flatten
			_.union
			_.difference
			
			es6 again :x
			function flatten(arr) {
				while(arr.some(item => Array.isArray(item))) {
					arr = [].concat(...arr);
				}
				return arr;
            }
            
            9.学underscore在数组中查找指定元素
			findIndex
			ES6 对数组新增了 findIndex 方法，它会返回数组中满足提供的函数的第一个元素的索引，否则返回 -1。
			function isBigEnough(element) {
			  return element >= 15;
			}
			
			[12, 5, 8, 130, 44].findIndex(isBigEnough);  // 3
			findIndex 会找出第一个大于 15 的元素的下标，所以最后返回 3。
			
			
			function findIndex(array, predicate, context) {
			    for (var i = 0; i < array.length; i++) {
			        if (predicate.call(context, array[i], i, array)) return i;
			    }
			    return -1;
			}
			
			console.log(findIndex([1, 2, 3, 4], function(item, i, array){
			    if (item == 3) return true;
			})) // 2
			