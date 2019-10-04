//1.class
class shape {
    constructor(width, heigth) {
        this._width = width;
        this._heigth = heigth;
    }

    get area() {
        return this._heigth * this._width;
    }
}

const square = new shape(10,10);
console.warn(shape.area);//100
console.warn(shape._width);//10

//2.agruments转数组
const sortNumbers = (...number) => number.sort();
//调用参数
Math.max(...[14,3,77]);
//构建对象
let [a, b, ...arr] = [1,2,3,4,5];
const { a, b, ...others} = { a: 1, b: 2, c: 3, d: 4, e: 5}

//3.双冒号运算符
//foo::bar 
//等同于 bar.bind(foo);
//foo::bar(...arguments); 等同于  bar.apply(foo, arguments);

//includes
function test(fruit) {
    const redFruits = ['a', 'b', 'c', 'd','e'];
    if (redFruits.includes(fruit)) {
        console.warn('red');
    }
}

//find
var inverort = [
    {name: 'apple', quantity: 2},
    {name: 'bananb', quantity: 0},
    {name: 'cherries', quantity: 5},
]
const a = includes.find(function(fruit) {
    return fruit.name === "cherries";
})
console.warn(a);


//4.私有变量
//约定
class Example {
    constructor() {
        this._private = 'private';
    }
    getName() {
        return this._private
    }
}

var ex = new Example();
console.warn(ex._private);//private
console.warn(ex.getName());//private

//.闭包
class Example1() {
    constructor() {
        var _private = '';
        _private = 'private';
        this.getName = function() { return _private}
    }
}

var ex2= new Example1();
console.warn(ex.getName());//private
console.warn(ex._private);//undefined

//symbol
const Example2 = (function() {
    var _private = Symbol('private');
    class Example2 {
        constructor() {
            this[_private] = 'private';
        }
        getName() {
            return this[_private];
        }
    }
    return Example2;
})();

var ex3 = new Example2();
console.warn(ex.getName());//private
console.warn(ex.name)//undefined

//WeakMap
const _private = new WeakMap();
class Example3 {
    constructor() {
        _private.set(this, 'private');
    }
    getName() {
        return _private.get(this);
    }
}

var ex = new Example3();
console.warn(ex.getName());//private
console.warn(ex.name);//undefined


//5.装饰器
//装饰器主要用于:
// 装饰类
// 装饰方法或属性


//6.模块加载方案
// AMD
// CMD
// CommonJS
// ES6 模块

// AMD 是 RequireJS 在推广过程中对模块定义的规范化产出。
// 你去看 AMD 规范) 的内容，其主要内容就是定义了 define 函数该如何书写，只要你按照这个规范书写模块和依赖，require.js 就能正确的进行解析


// 与 AMD 一样，CMD 其实就是 SeaJS 在推广过程中对模块定义的规范化产出。
// 你去看 CMD 规范的内容，主要内容就是描述该如何定义模块，如何引入模块，如何导出模块，只要你按照这个规范书写代码，sea.js 就能正确的进行解析。

// AMD 与 CMD 的区别
// 从 sea.js 和 require.js 的例子可以看出：

// 1.CMD 推崇依赖就近，AMD 推崇依赖前置。看两个项目中的 main.js：

// require.js 例子中的 main.js
// 依赖必须一开始就写好
require(['./add', './square'], function(addModule, squareModule) {
    console.log(addModule.add(1, 1))
    console.log(squareModule.square(3))
});
// sea.js 例子中的 main.js
define(function(require, exports, module) {
    var addModule = require('./add');
    console.log(addModule.add(1, 1))

    // 依赖可以就近书写
    var squareModule = require('./square');
    console.log(squareModule.square(3))
});
// 2.对于依赖的模块，AMD 是提前执行，CMD 是延迟执行。看两个项目中的打印顺序：

// // require.js
// 加载了 add 模块
// 加载了 multiply 模块
// 加载了 square 模块
// 2
// 9
// // sea.js
// 加载了 add 模块
// 2
// 加载了 square 模块
// 加载了 multiply 模块
// 9
// AMD 是将需要使用的模块先加载完再执行代码，而 CMD 是在 require 的时候才去加载模块文件，加载完再接着执行。

// AMD 和 CMD 都是用于浏览器端的模块规范，而在服务器端比如 node，采用的则是 CommonJS 规范。
// 导出模块的方式：

var add = function(x, y) {　
    return x + y;
};

// module.exports.add = add;
// 引入模块的方式：

var add = require('./add.js');
console.log(add.add(1, 1));

// 跟 sea.js 的执行结果一致，也是在 require 的时候才去加载模块文件，加载完再接着执行。

// CommonJS 规范加载模块是同步的，也就是说，只有加载完成，才能执行后面的操作。
// AMD规范则是非同步加载模块，允许指定回调函数。
// 由于 Node.js 主要用于服务器编程，模块文件一般都已经存在于本地硬盘，所以加载起来比较快，不用考虑非同步加载的方式，所以 CommonJS 规范比较适用。
// 但是，如果是浏览器环境，要从服务器端加载模块，这时就必须采用非同步模式，因此浏览器端一般采用 AMD 规范。

// main.js
var add = require('./add.js');
console.log(add.add(1, 1))

var square = require('./square.js');
console.log(square.square(3));
// add.js
console.log('加载了 add 模块')

var add = function(x, y) {　
    return x + y;
};

module.exports.add = add;
// multiply.js
console.log('加载了 multiply 模块')

var multiply = function(x, y) {　
    return x * y;
};

module.exports.multiply = multiply;
// square.js
console.log('加载了 square 模块')

var multiply = require('./multiply.js');

var square = function(num) {　
    return multiply.multiply(num, num);
};

module.exports.square = square;

// ECMAScript2015 规定了新的模块加载方案。
// main.js
import {add} from './add.js';
console.log(add(1, 1))

import {square} from './square.js';
console.log(square(3));
// add.js
console.log('加载了 add 模块')

var add = function(x, y) {
    return x + y;
};

export {add}
// multiply.js
console.log('加载了 multiply 模块')

var multiply = function(x, y) {　
    return x * y;
};

export {multiply}
// square.js
console.log('加载了 square 模块')

import {multiply} from './multiply.js';

var square = function(num) {　
    return multiply(num, num);
};

export {square}

// 它们有两个重大差异。
// CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
// CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。
// 因为 CommonJS 加载的是一个对象（即module.exports属性），该对象只有在脚本运行完才会生成。
// 而 ES6 模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成。

// counter.js
export let counter = 3;
export function incCounter() {
  counter++;
}

// main.js
import { counter, incCounter } from './counter';
console.log(counter); // 3
incCounter();
console.log(counter); // 4
// 这是因为

// ES6 模块的运行机制与 CommonJS 不一样。JS 引擎对脚本静态分析的时候，遇到模块加载命令 import，就会生成一个只读引用。
// 等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值。换句话说，ES6 的 import 有点像 Unix 系统的“符号连接”，
// 原始值变了，import 加载的值也会跟着变。因此，ES6 模块是动态引用，并且不会缓存值，模块里面的变量绑定其所在的模块。

