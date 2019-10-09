import { func } from "prop-types"

1.let 和 const

块级作用域的出现
通过 var 声明的变量存在变量提升的特性：


if (condition) {
    var value = 1;
}
console.log(value);
初学者可能会觉得只有 condition 为 true 的时候，才会创建 value，如果 condition 为 false，结果应该是报错，然而因为变量提升的原因，代码相当于：

var value;
if (condition) {
    value = 1;
}
console.log(value);
如果 condition 为 false，结果会是 undefined。

除此之外，在 for 循环中：

for (var i = 0; i < 10; i++) {
    ...
}
console.log(i); // 10

即便循环已经结束了，我们依然可以访问 i 的值。

为了加强对变量生命周期的控制，ECMAScript 6 引入了块级作用域。

块级作用域存在于：

函数内部
块中(字符 { 和 } 之间的区域)

let 和 const
块级声明用于声明在指定块的作用域之外无法访问的变量。

let 和 const 都是块级声明的一种。
1.不会被提升

if (false) {
    let value = 1;
}
console.log(value); // Uncaught ReferenceError: value is not defined
2.重复声明报错

var value = 1;
let value = 2; // Uncaught SyntaxError: Identifier 'value' has already been declared
3.不绑定全局作用域

当在全局作用域中使用 var 声明的时候，会创建一个新的全局变量作为全局对象的属性。

var value = 1;
console.log(window.value); // 1
然而 let 和 const 不会：

let value = 1;
console.log(window.value); // undefined
再来说下 let 和 const 的区别：

const 用于声明常量，其值一旦被设定不能再被修改，否则会报错。

值得一提的是：const 声明不允许修改绑定，但允许修改值。这意味着当用 const 声明对象时：

const data = {
    value: 1
}

// 没有问题
data.value = 2;
data.num = 3;

// 报错
data = {}; // Uncaught TypeError: Assignment to constant variable.

循环中的块级作用域
var funcs = [];
for (var i = 0; i < 3; i++) {
    funcs[i] = function() {
        console.log(i);
    }
}
funcs[0]()//3
解决方案：
for (var i = 0; i < 3; i++) {
    funcs[i] = (function() {
        return function() {
            console.warn(i)
        }
    }(i))
}
funcs[0]()//0

ES6 的 let 为这个问题提供了新的解决方法：
for (let i = 0; i < 3; i++) {
    funcs[i] = function() {
        console.log(i);
    }
}

func[0]();
设置循环变量的那部分是一个单独的作用域
简单的来说，就是在 for (let i = 0; i < 3; i++) 中，即圆括号之内建立一个隐藏的作用域
然后每次迭代循环时都创建一个新变量，并以之前迭代中同名变量的值将其初始化


说完了普通的 for 循环，我们还有 for in 循环呢~

那下面的结果是什么呢？

var funcs = [], object = {a: 1, b: 1, c: 1};
for (var key in object) {
    funcs.push(function(){
        console.log(key)
    });
}

funcs[0]()
结果是 'c';

那如果把 var 改成 let 或者 const 呢？

使用 let，结果自然会是 'a'，const 呢？ 报错还是 'a'?

结果是正确打印 'a'，这是因为在 for in 循环中，每次迭代不会修改已有的绑定，而是会创建一个新的绑定。

在我们开发的时候，可能认为应该默认使用 let 而不是 var ，这种情况下，对于需要写保护的变量要使用 const。
然而另一种做法日益普及：默认使用 const，只有当确实需要改变变量的值的时候才使用 let。这是因为大部分的变量
的值在初始化后不应再改变，而预料之外的变量之的改变是很多 bug 的源头。





2.模板字符串
基础用法
let message = `Hello World`;
console.log(message);
如果你碰巧要在字符串中使用反撇号，你可以使用反斜杠转义：

let message = `Hello \` World`;
console.log(message);
值得一提的是，在模板字符串中，空格、缩进、换行都会被保留：

let message = `
    <ul>
        <li>1</li>
        <li>2</li>
    </ul>
`;
console.log(message);
嵌入变量
模板字符串支持嵌入变量，只需要将变量名写在 ${} 之中，其实不止变量，任意的 JavaScript 表达式都是可以的：

let x = 1, y = 2;
let message = `<ul><li>${x}</li><li>${x + y}</li></ul>`;
console.log(message); // <ul><li>1</li><li>3</li></ul>
let arr = [{value: 1}, {value: 2}];
let message = `
    <ul>
        ${arr.map((item) => {
            return `
                <li>${item.value}</li>
            `
        })}
    </ul>
`;
console.log(message);

标签模板
模板标签是一个非常重要的能力，模板字符串可以紧跟在一个函数名后面，该函数将被调用来处理这个模板字符串，举个例子：

let x = 'Hi', y = 'Kevin';
var res = message`${x}, I am ${y}`;
console.log(res);
我们可以自定义 message 函数来处理返回的字符串:

// literals 文字
// 注意在这个例子中 literals 的第一个元素和最后一个元素都是空字符串
function message(literals, value1, value2) {
    console.log(literals); // [ "", ", I am ", "" ]
    console.log(value1); // Hi
    console.log(value2); // Kevin
}
我们利用这些参数将其拼合回去：

function message(literals, ...values) {
    let result = '';

    for (let i = 0; i < values.length; i++) {
        result += literals[i];
        result += values[i];
    }

    result += literals[literals.length - 1];

    return result;
}
你也可以这样写：

function message(literals, ...values) {
    let result = literals.reduce((prev, next, i) => {
        let value = values[i - 1];
        return prev + value + next;
    });

    return result;
}
学着拼合回去是一件非常重要的事情，因为我们经过各种处理，最终都还是要拼回去的……

result = result.replace(/\n[^\S\n]*/g, '\n');
\S 表示匹配一个非空白字符

[^\S\n] 表示匹配非空白字符和换行符之外的字符，其实也就是空白字符去除换行符

\n[^\S\n]* 表示匹配换行符以及换行符后的多个不包含换行符的空白字符

replace(/\n[^\S\n]*/g, '\n') 表示将一个换行符以及换行符后的多个不包含换行符的空白字符替换成一个换行符，其实也就是将换行符后面的空白字符消掉的意思



4.箭头函数
ES6 增加了箭头函数：

let func = value => value;
相当于：

let func = function (value) {
    return value;
};
如果需要给函数传入多个参数：

let func = (value, num) => value * num;
如果函数的代码块需要多条语句：

let func = (value, num) => {
    return value * num
};
如果需要直接返回一个对象：

let func = (value, num) => ({total: value * num});
与变量解构结合：

let func = ({value, num}) => ({total: value * num})

// 使用
var result = func({
    value: 10,
    num: 10
})

console.log(result); // {total: 100}
很多时候，你可能想不到要这样用，所以再来举个例子，比如在 React 与 Immutable 的技术选型中，我们处理一个事件会这样做：

handleEvent = () => {
    this.setState({
        data: this.state.data.set('key', 'value')
    })
}

handleEvent = () => {
    this.setState(({data}) => ({
        data: data.set('key', 'data')
    }))
}

比较
本篇我们重点比较一下箭头函数与普通函数。

主要区别包括：

1.没有 this
箭头函数没有 this，所以需要通过查找作用域链来确定 this 的值。

这就意味着如果箭头函数被非箭头函数包含，this 绑定的就是最近一层非箭头函数的 this。

利用 ES5，我们一般会这样做：

Button.prototype.bindEvent = function() {
    this.element.addEventListener("click", this.setBgColor.bind(this), false);
};
为避免 addEventListener 的影响，使用 bind 强制绑定 setBgColor() 的 this 为实例对象

使用 ES6，我们可以更好的解决这个问题：

Button.prototype.bindEvent = function() {
    this.element.addEventListener("click", event => this.setBgColor(event), false);
};
由于箭头函数没有 this，所以会向外层查找 this 的值，即 bindEvent 中的 this，此时 this 指向实例对象，所以可以正确的调用 this.setBgColor 方法， 而 this.setBgColor 中的 this 也会正确指向实例对象。
因为箭头函数没有 this，所以也不能用 call()、apply()、bind() 这些方法改变 this 的指向，可以看一个例子：

2. 没有 arguments
箭头函数没有自己的 arguments 对象，这不一定是件坏事，因为箭头函数可以访问外围函数的 arguments 对象：

function constant() {
    return () => arguments[0]
}

var result = constant(1);
console.log(result()); // 1
那如果我们就是要访问箭头函数的参数呢？

你可以通过命名参数或者 rest 参数的形式访问参数:

let nums = (...nums) => nums;

3. 不能通过 new 关键字调用
JavaScript 函数有两个内部方法：[[Call]] 和 [[Construct]]。

当通过 new 调用函数时，执行 [[Construct]] 方法，创建一个实例对象，然后再执行函数体，将 this 绑定到实例上。

当直接调用的时候，执行 [[Call]] 方法，直接执行函数体。

箭头函数并没有 [[Construct]] 方法，不能被用作构造函数，如果通过 new 的方式调用，会报错。

var Foo = () => {};
var foo = new Foo(); // TypeError: Foo is not a constructor
4. 没有 new.target
因为不能使用 new 调用，所以也没有 new.target 值。


5. 没有原型
由于不能使用 new 调用箭头函数，所以也没有构建原型的需求，于是箭头函数也不存在 prototype 这个属性。

var Foo = () => {};
console.log(Foo.prototype); // undefined
6. 没有 super
连原型都没有，自然也不能通过 super 来访问原型的属性，所以箭头函数也是没有 super 的，不过跟 this、arguments、new.target 一样，这些值由外围最近一层非箭头函数决定。





4.模拟实现 Symbol 类型
1. Symbol 值通过 Symbol 函数生成，使用 typeof，结果为 "symbol"

var s = Symbol();
console.log(typeof s); // "symbol"
2. Symbol 函数前不能使用 new 命令，否则会报错。这是因为生成的 Symbol 是一个原始类型的值，不是对象。

3. instanceof 的结果为 false

var s = Symbol('foo');
console.log(s instanceof Symbol); // false
4. Symbol 函数可以接受一个字符串作为参数，表示对 Symbol 实例的描述，主要是为了在控制台显示，或者转为字符串时，比较容易区分。

var s1 = Symbol('foo');
console.log(s1); // Symbol(foo)
5. 如果 Symbol 的参数是一个对象，就会调用该对象的 toString 方法，将其转为字符串，然后才生成一个 Symbol 值。
const obj = {
    toString() {
      return 'abc';
    }
  };
  const sym = Symbol(obj);
  console.log(sym); // Symbol(abc)
  6. Symbol 函数的参数只是表示对当前 Symbol 值的描述，相同参数的 Symbol 函数的返回值是不相等的。
  
  // 没有参数的情况
  var s1 = Symbol();
  var s2 = Symbol();
  
  console.log(s1 === s2); // false
  
  // 有参数的情况
  var s1 = Symbol('foo');
  var s2 = Symbol('foo');
  
  console.log(s1 === s2); // false
  7. Symbol 值不能与其他类型的值进行运算，会报错。
  
  var sym = Symbol('My symbol');
  
  console.log("your symbol is " + sym); // TypeError: can't convert symbol to string
  8. Symbol 值可以显式转为字符串。
  
  var sym = Symbol('My symbol');
  
  console.log(String(sym)); // 'Symbol(My symbol)'
  console.log(sym.toString()); // 'Symbol(My symbol)'
  Symbol 值可以作为标识符，用于对象的属性名，可以保证不会出现同名的属性。

var mySymbol = Symbol();

// 第一种写法
var a = {};
a[mySymbol] = 'Hello!';

// 第二种写法
var a = {
  [mySymbol]: 'Hello!'
};

// 第三种写法
var a = {};
Object.defineProperty(a, mySymbol, { value: 'Hello!' });

// 以上写法都得到同样结果
console.log(a[mySymbol]); // "Hello!"
10. Symbol 作为属性名，该属性不会出现在 for...in、for...of 循环中，也不会被 Object.keys()、Object.getOwnPropertyNames()、JSON.stringify() 返回。但是，它也不是私有属性，有一个 Object.getOwnPropertySymbols 方法，可以获取指定对象的所有 Symbol 属性名。

var obj = {};
var a = Symbol('a');
var b = Symbol('b');

obj[a] = 'Hello';
obj[b] = 'World';

var objectSymbols = Object.getOwnPropertySymbols(obj);

console.log(objectSymbols);
// [Symbol(a), Symbol(b)]
11. 如果我们希望使用同一个 Symbol 值，可以使用 Symbol.for。它接受一个字符串作为参数，然后搜索有没有以该参数作为名称的 Symbol 值。如果有，就返回这个 Symbol 值，否则就新建并返回一个以该字符串为名称的 Symbol 值。

var s1 = Symbol.for('foo');
var s2 = Symbol.for('foo');

console.log(s1 === s2); // true
12. Symbol.keyFor 方法返回一个已登记的 Symbol 类型值的 key。

var s1 = Symbol.for("foo");
console.log(Symbol.keyFor(s1)); // "foo"

var s2 = Symbol("foo");
console.log(Symbol.keyFor(s2) ); // undefined


