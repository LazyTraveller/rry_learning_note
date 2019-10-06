1.如何判断两个对象相等
+0 与 -0
// 表现1
console.log(+0 === -0); // true

// 表现2
(-0).toString() // '0'
(+0).toString() // '0'

// 表现3
-0 < +0 // false
+0 < -0 // false

1 / +0 // Infinity
1 / -0 // -Infinity

1 / +0 === 1 / -0 // false

这是因为 JavaScript 采用了IEEE_754 浮点数表示法(几乎所有现代编程语言所采用)，这是一种二进制表示法，按照这个标准，最高位是符号位(0 代表正，1 代表负)，剩下的用于表示大小。而对于零这个边界值 ，1000(-0) 和 0000(0)都是表示 0 ，这才有了正负零的区别。

也许你会好奇什么时候会产生 -0 呢？

Math.round(-0.1) // -0
那么我们又该如何在 === 结果为 true 的时候，区别 0 和 -0 得出正确的结果呢？我们可以这样做：

function eq(a, b){
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    return false;
}

console.log(eq(0, 0)) // true
console.log(eq(0, -0)) // false

NaN
console.log(NaN === NaN); // false


eq function
// eq 第一版
// 用来过滤掉简单的类型比较，复杂的对象使用 deepEq 函数进行处理
function eq(a, b) {

    // === 结果为 true 的区别出 +0 和 -0
    if (a === b) return a !== 0 || 1 / a === 1 / b;

    // typeof null 的结果为 object ，这里做判断，是为了让有 null 的情况尽早退出函数
    if (a == null || b == null) return false;

    // 判断 NaN
    if (a !== a) return b !== b;

    // 判断参数 a 类型，如果是基本类型，在这里可以直接返回 false
    var type = typeof a;
    if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;

    // 更复杂的对象使用 deepEq 函数进行深度比较
    return deepEq(a, b);
};

String 对象
console.log(typeof 'Curly'); // string
console.log(typeof new String('Curly')); // object

var toString = Object.prototype.toString;
toString.call('Curly'); // "[object String]"
toString.call(new String('Curly')); // "[object String]"
那我们利用隐式类型转换呢？

console.log('Curly' + '' === new String('Curly') + ''); // true
看来我们已经有了思路：如果 a 和 b 的 Object.prototype.toString的结果一致，并且都是"[object String]"，那我们就使用 '' + a === '' + b 进行判断。

可是不止有 String 对象呐，Boolean、Number、RegExp、Date呢？
更多对象
跟 String 同样的思路，利用隐式类型转换。

Boolean

var a = true;
var b = new Boolean(true);

console.log(+a === +b) // true
Date

var a = new Date(2009, 9, 25);
var b = new Date(2009, 9, 25);

console.log(+a === +b) // true
RegExp

var a = /a/i;
var b = new RegExp(/a/i);

console.log('' + a === '' + b) // true
Number

var a = 1;
var b = new Number(1);

console.log(+a === +b) // true


构造函数实例
我们看个例子：

function Person() {
    this.name = name;
}

function Animal() {
    this.name = name
}

var person = new Person('Kevin');
var animal = new Animal('Kevin');

eq(person, animal) // ???
虽然 person 和 animal 都是 {name: 'Kevin'}，但是 person 和 animal 属于不同构造函数的实例，为了做出区分，我们认为是不同的对象。

var attrs = Object.create(null);
attrs.name = "Bob";
eq(attrs, {name: "Bob"}); // ???
尽管 attrs 没有原型，{name: "Bob"} 的构造函数是 Object，但是在实际应用中，只要他们有着相同的键值对，我们依然认为是相等。


最终的 eq 函数
var toString = Object.prototype.toString;

function isFunction(obj) {
    return toString.call(obj) === '[object Function]'
}

function eq(a, b, aStack, bStack) {

    // === 结果为 true 的区别出 +0 和 -0
    if (a === b) return a !== 0 || 1 / a === 1 / b;

    // typeof null 的结果为 object ，这里做判断，是为了让有 null 的情况尽早退出函数
    if (a == null || b == null) return false;

    // 判断 NaN
    if (a !== a) return b !== b;

    // 判断参数 a 类型，如果是基本类型，在这里可以直接返回 false
    var type = typeof a;
    if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;

    // 更复杂的对象使用 deepEq 函数进行深度比较
    return deepEq(a, b, aStack, bStack);
};

function deepEq(a, b, aStack, bStack) {

    // a 和 b 的内部属性 [[class]] 相同时 返回 true
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;

    switch (className) {
        case '[object RegExp]':
        case '[object String]':
            return '' + a === '' + b;
        case '[object Number]':
            if (+a !== +a) return +b !== +b;
            return +a === 0 ? 1 / +a === 1 / b : +a === +b;
        case '[object Date]':
        case '[object Boolean]':
            return +a === +b;
    }

    var areArrays = className === '[object Array]';
    // 不是数组
    if (!areArrays) {
        // 过滤掉两个函数的情况
        if (typeof a != 'object' || typeof b != 'object') return false;

        var aCtor = a.constructor,
            bCtor = b.constructor;
        // aCtor 和 bCtor 必须都存在并且都不是 Object 构造函数的情况下，aCtor 不等于 bCtor， 那这两个对象就真的不相等啦
        if (aCtor == bCtor && !(isFunction(aCtor) && aCtor instanceof aCtor && isFunction(bCtor) && bCtor instanceof bCtor) && ('constructor' in a && 'constructor' in b)) {
            return false;
        }
    }


    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;

    // 检查是否有循环引用的部分
    while (length--) {
        if (aStack[length] === a) {
            return bStack[length] === b;
        }
    }

    aStack.push(a);
    bStack.push(b);

    // 数组判断
    if (areArrays) {

        length = a.length;
        if (length !== b.length) return false;

        while (length--) {
            if (!eq(a[length], b[length], aStack, bStack)) return false;
        }
    }
    // 对象判断
    else {

        var keys = Object.keys(a),
            key;
        length = keys.length;

        if (Object.keys(b).length !== length) return false;
        while (length--) {

            key = keys[length];
            if (!(b.hasOwnProperty(key) && eq(a[key], b[key], aStack, bStack))) return false;
        }
    }

    aStack.pop();
    bStack.pop();
    return true;

}

console.log(eq(0, 0)) // true
console.log(eq(0, -0)) // false

console.log(eq(NaN, NaN)); // true
console.log(eq(Number(NaN), Number(NaN))); // true

console.log(eq('Curly', new String('Curly'))); // true

console.log(eq([1], [1])); // true
console.log(eq({ value: 1 }, { value: 1 })); // true

var a, b;

a = { foo: { b: { foo: { c: { foo: null } } } } };
b = { foo: { b: { foo: { c: { foo: null } } } } };
a.foo.b.foo.c.foo = a;
b.foo.b.foo.c.foo = b;

console.log(eq(a, b)) // true

2.函数柯里化
在数学和计算机科学中，柯里化是一种将使用多个参数的一个函数转换成一系列使用一个参数的函数的技术。
function add(a, b) {
    return a + b;
}

// 执行 add 函数，一次传入两个参数即可
add(1, 2) // 3

// 假设有一个 curry 函数可以做到柯里化
var addCurry = curry(add);
addCurry(1)(2) // 3

用途
curry 的这种用途可以理解为：参数复用。本质上是降低通用性，提高适用性。
比如我们有这样一段数据：

var person = [{name: 'kevin'}, {name: 'daisy'}]
如果我们要获取所有的 name 值，我们可以这样做：

var name = person.map(function (item) {
    return item.name;
})

不过如果我们有 curry 函数：

var prop = curry(function (key, obj) {
    return obj[key]
});

var name = person.map(prop('name'))
person.map(prop('name')) 就好像直白的告诉你：person 对象遍历(map)获取(prop) name 属性。

编写这个 curry 函数
第一版
var curry = function(fn) {
    var args = [].slice.call(arguments, 1);
    return function() {
        var newArgs = args.concat([].slice.call(arguments));
        return fn.apply(this, newArgs);
    }
}
我们可以这样使用：

function add(a, b) {
    return a + b;
}

var addCurry = curry(add, 1, 2);
addCurry() // 3
//或者
var addCurry = curry(add, 1);
addCurry(2) // 3
//或者
var addCurry = curry(add);
addCurry(1, 2) // 3

第二版
function sub_curry(fn) {
    var args = [].slice.call(arguments, 1);
    return function() {
        return fn.apply(this, args.concat([].slice.call(arguments)));
    }
}

function curry(fn, length) {
    length = length || fn.length;
    var slice = Array.prototype.slice;
    return function() {
        if(arguments.length < length) {
            var combined = [fn].concat(slice.call(arguments));
            return curry(sub_curry.apply(this, combined), length -arguments.length);
            
        } else {
            return fn.apply(this, arguments);
        }
    }
}

我们验证下这个函数：

var fn = curry(function(a, b, c) {
    return [a, b, c];
});

fn("a", "b", "c") // ["a", "b", "c"]
fn("a", "b")("c") // ["a", "b", "c"]
fn("a")("b")("c") // ["a", "b", "c"]
fn("a")("b", "c") // ["a", "b", "c"]


为了让大家更好的理解这个 curry 函数，我给大家写个极简版的代码：
function sub_curry(fn){
    return function(){
        return fn()
    }
}

function curry(fn, length){
    length = length || 4;
    return function(){
        if (length > 1) {
            return curry(sub_curry(fn), --length)
        }
        else {
            return fn()
        }
    }
}

var fn0 = function(){
    console.log(1)
}

var fn1 = curry(fn0)

fn1()()()() // 1
sub_curry 的作用就是用函数包裹原函数，然后给原函数传入之前的参数，当执行 fn0(...)(...) 的时候，执行包裹函数，返回原函数，
然后再调用 sub_curry 再包裹原函数，然后将新的参数混合旧的参数再传入原函数，直到函数参数的数目达到要求为止。

更易懂的实现
function curry(fn, args) {
    length = fn.length;

    args = args || [];

    return function() {

        var _args = args.slice(0),

            arg, i;

        for (i = 0; i < arguments.length; i++) {

            arg = arguments[i];

            _args.push(arg);

        }
        if (_args.length < length) {
            return curry.call(this, fn, _args);
        }
        else {
            return fn.apply(this, _args);
        }
    }
}


var fn = curry(function(a, b, c) {
    console.log([a, b, c]);
});

fn("a", "b", "c") // ["a", "b", "c"]
fn("a", "b")("c") // ["a", "b", "c"]
fn("a")("b")("c") // ["a", "b", "c"]
fn("a")("b", "c") // ["a", "b", "c"]


3.偏函数
在计算机科学中，局部应用是指固定一个函数的一些参数，然后产生另一个更小元的函数。

什么是元？元是指函数参数的个数，比如一个带有两个参数的函数被称为二元函数。
function add(a, b) {
    return a + b;
}

// 执行 add 函数，一次传入两个参数即可
add(1, 2) // 3

// 假设有一个 partial 函数可以做到局部应用
var addOne = partial(add, 1);

addOne(2) // 3
柯里化是将一个多参数函数转换成多个单参数函数，也就是将一个 n 元函数转换成 n 个一元函数。

局部应用则是固定一个函数的一个或者多个参数，也就是将一个 n 元函数转换成一个 n - x 元函数。


partial

我们来写个 demo 验证下 this 的指向：

function add(a, b) {
    return a + b + this.value;
}

// var addOne = add.bind(null, 1);
var addOne = partial(add, 1);

var value = 1;
var obj = {
    value: 2,
    addOne: addOne
}
obj.addOne(2); // ???
// 使用 bind 时，结果为 4
// 使用 partial 时，结果为 5
第二版
然而正如 curry 函数可以使用占位符一样，我们希望 partial 函数也可以实现这个功能，我们再来写第二版：

// 第二版
var _ = {};

function partial(fn) {
    var args = [].slice.call(arguments, 1);
    return function() {
        var position = 0, len = args.length;
        for(var i = 0; i < len; i++) {
            args[i] = args[i] === _ ? arguments[position++] : args[i]
        }
        while(position < arguments.length) args.push(argumetns[position++]);
        return fn.apply(this, args);
    };
};
我们验证一下：

var subtract = function(a, b) { return b - a; };
subFrom20 = partial(subtract, _, 20);
subFrom20(5);
写在最后
值得注意的是：underscore 和 lodash 都提供了 partial 函数，但只有 lodash 提供了 curry 函数。