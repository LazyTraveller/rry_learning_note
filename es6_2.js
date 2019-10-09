1.defineProperty 与 proxy
数据绑定 监听数据变化
Object.defineProperty(obj, prop,descriptor);
obj: 要在其上定义属性的对象。

prop:  要定义或修改的属性的名称。

descriptor: 将被定义或修改的属性的描述符。

var obj= {}
Object.defineProperty(obj, 'num', {
    value: 1,
    writable: true,
    enumerable: true,
    configurable: true,
})
//对象obj拥有属性num的值为1
函数的第三个参数 descriptor 所表示的属性描述符有两种形式：数据描述符和存取描述符。

两者均具有以下两种键值：

configurable

当且仅当该属性的 configurable 为 true 时，该属性描述符才能够被改变，也能够被删除。默认为 false。
enumerable

当且仅当该属性的 enumerable 为 true 时，该属性才能够出现在对象的枚举属性中。默认为 false。
数据描述符同时具有以下可选键值：

value

该属性对应的值。可以是任何有效的 JavaScript 值（数值，对象，函数等）。默认为 undefined。
writable

当且仅当该属性的 writable 为 true 时，该属性才能被赋值运算符改变。默认为 false。
存取描述符同时具有以下可选键值：

get

一个给属性提供 getter 的方法，如果没有 getter 则为 undefined。该方法返回值被用作属性值。默认为 undefined。
set

一个给属性提供 setter 的方法，如果没有 setter 则为 undefined。该方法将接受唯一参数，并将该参数的新值分配给该属性。默认为 undefined。
值得注意的是：

属性描述符必须是数据描述符或者存取描述符两种形式之一，不能同时是两者。这就意味着你可以：

Object.defineProperty({}, "num", {
    value: 1,
    writable: true,
    enumerable: true,
    configurable: true
});
也可以：

var value = 1;
Object.defineProperty({}, "num", {
    get : function(){
      return value;
    },
    set : function(newValue){
      value = newValue;
    },
    enumerable : true,
    configurable : true
});
但是不可以：

// 报错
Object.defineProperty({}, "num", {
    value: 1,
    get: function() {
        return 1;
    }
});


Setters 和 Getters
使用存取描述符中的 get 和 set，这两个方法又被称为 getter 和 setter。由 getter 和 setter 定义的属性称做”存取器属性“。
var obj = {}, value = null;
Object.defineProperty(obj, "num", {
    get: function(){
        console.log('执行了 get 操作')
        return value;
    },
    set: function(newValue) {
        console.log('执行了 set 操作')
        value = newValue;
    }
})

obj.value = 1 // 执行了 set 操作

console.log(obj.value); // 执行了 get 操作 // 1

这不就是我们要的监控数据改变的方法吗？我们再来封装一下：
function Archiver() {
    var value = null;
    var archive = [];
    Object.defineProperty(this, 'num', {
        get: function() {
            console.warn('执行了get');
            return value;
        },
        set: function(value) {
            console.warn("执行了set")
            value = value;
            archive.push({ val: value });
        }
    });
    this.getArchive = function() {
        return archive;
    }
}

var arc = new Archiver();
arc.num
arc.num = 11;

watch API
既然可以监控数据的改变，那我可以这样设想，即当数据改变的时候，自动进行渲染工作。举个例子：

HTML 中有个 span 标签和 button 标签

<span id="container">1</span>
<button id="button">点击加 1</button>
当点击按钮的时候，span 标签里的值加 1。

传统的做法是：

document.getElementById('button').addEventListener("click", function(){
    var container = document.getElementById("container");
    container.innerHTML = Number(container.innerHTML) + 1;
});
如果使用了 defineProperty：
var obj = {
    value: 1
}

// 储存 obj.value 的值
var value = 1;

Object.defineProperty(obj, "value", {
    get: function() {
        return value;
    },
    set: function(newValue) {
        value = newValue;
        document.getElementById('container').innerHTML = newValue;
    }
});

document.getElementById('button').addEventListener("click", function() {
    obj.value += 1;
});


proxy
使用 defineProperty 只能重定义属性的读取（get）和设置（set）行为，到了 ES6，提供了 Proxy，
可以重定义更多的行为，比如 in、delete、函数调用等更多行为。
var proxy = new Proxy(target, handler);
proxy 对象的所有用法，都是上面这种形式，不同的只是handler参数的写法。其中，new Proxy()表示生成一个Proxy实例，
target参数表示所要拦截的目标对象，handler参数也是一个对象，用来定制拦截行为。

var proxy = new Proxy({}, {
    get: function(obj,prop) {
        return obj[prop]
    },
    set: function(obj, prop, value) {
        obj[prop] = value
    }
})
proxy.time = 35;
proxy.time
除了 get 和 set 之外，proxy 可以拦截多达 13 种操作，比如 has(target, propKey)，可以拦截 propKey in proxy 的操作，返回一个布尔值。


使用 defineProperty 和 proxy 的区别，当使用 defineProperty，我们修改原来的 obj 对象就可以触发拦截，而使用 proxy，就必须修改代理对象，即 Proxy 的实例才可以触发拦截。




2.Babel 是如何编译 Class 的(上)

constructor
es6 
class Person() {
    constructor(name) {
        this.name = name;
    }
    sayHello() {
        return 'hello , i am' + this.name;
    }
}

var kevin = new Person('kevin');
kevin.sayHello();

// es5    the same as js
function Person(name) {
    this.name = name;
}

Person.prototype.sayHello = function() {
    return 'hello , i am '+ this.name;
}

var kevin = new Person('kevin');
kevin.sayHello();
ES5 的构造函数 Person，对应 ES6 的 Person 类的 constructor 方法。
类的内部所有定义的方法，都是不可枚举的（non-enumerable）

实例属性
以前，我们定义实例属性，只能写在类的 constructor 方法里面。比如：
class Person {
    constructor(){
        this.state = {
            count: 0
        }

    }
}
然而现在有一个提案，对实例属性和静态属性都规定了新的写法，而且 Babel 已经支持。现在我们可以写成：
class Person {
    state = {
        count: 0
    }
}

对应es5:
function Person() {
    this.state = {
        count: 0
    }
}

静态方法
所有在类中定义的方法，都会被实例继承。如果在一个方法前，加上 static 关键字，
就表示该方法不会被实例继承，而是直接通过类来调用，这就称为“静态方法”。

ES6:
class Person {
    static sayHello() {
        return 'hello'
    }
}

Person.sayHello();// 'hello'

var kevin = new Person();
kevin.sayHello();   //TypeError: kevin.sayHello is not a function

for es5:
function Person() {}

Person.sayHello = function() {
    return 'hello';
};

Person.sayHello(); // 'hello'

var kevin = new Person();
kevin.sayHello(); // TypeError: kevin.sayHello is not a function

静态属性
静态属性指的是 Class 本身的属性，即 Class.propName，而不是定义在实例对象（this）上的属性。以前，我们添加静态属性只可以这样：

class Person {}

Person.name = 'kevin';
因为上面提到的提案，现在可以写成：

class Person {
  static name = 'kevin';
}
对应到 ES5 都是：

function Person() {};

Person.name = 'kevin';
new 调用
值得注意的是：类必须使用 new 调用，否则会报错。这是它跟普通构造函数的一个主要区别，后者不用 new 也可以执行。

class Person {}

Person(); // TypeError: Class constructor Foo cannot be invoked without 'new'

getter 和 setter
与 ES5 一样，在“类”的内部可以使用 get 和 set 关键字，对某个属性设置存值函数和取值函数，拦截该属性的存取行为
class Person {
    get name() {
        return 'kevin';
    }
    set name(newName) {
        console.log('new name'+newName);
    }
}

let person = new Person();
person.name = 'daisy';// new name 为：daisy
console.log(person.name);
// kevin

对应到 ES5 中：
function Person(name) {}

Person.prototype = {
    get name() {
        return 'kevin';
    },
    set name(newName) {
        console.log('new name 为：' + newName)
    }
}

let person = new Person();

person.name = 'daisy';
// new name 为：daisy

console.log(person.name);
// kevin

Babel 编译


Babel 是如何编译 Class 的(下)
function Parent (name) {
    this.name = name;
}

Parent.prototype.getName = function () {
    console.log(this.name)
}

function Child (name, age) {
    Parent.call(this, name);
    this.age = age;
}

Child.prototype = Object.create(Parent.prototype);

var child1 = new Child('kevin', '18');

console.log(child1);


ES6 extend
Class 通过 extends 关键字实现继承，这比 ES5 的通过修改原型链实现继承，要清晰和方便很多。
class Parent {
    constructor(name) {
        this.name = name;
    }
}

class Child extends Parent {
    constructor(name, age) {
        super(name); // 调用父类的 constructor(name)
        this.age = age;
    }
}

var child1 = new Child('kevin', '18');

console.log(child1);
super 关键字表示父类的构造函数，相当于 ES5 的 Parent.call(this)。

子类必须在 constructor 方法中调用 super 方法，否则新建实例时会报错。这是因为子类没有自己的 this 对象，
而是继承父类的 this 对象，然后对其进行加工。如果不调用 super 方法，子类就得不到 this 对象。
也正是因为这个原因，在子类的构造函数中，只有调用 super 之后，才可以使用 this 关键字，否则会报错。


子类的 __proto__
在 ES6 中，父类的静态方法，可以被子类继承。举个例子： 但是不能被实例继承
class Foo {
    static classMethod() {
      return 'hello';
    }
  }
  
  class Bar extends Foo {
  }
  
  Bar.classMethod(); // 'hello'

  这是因为 Class 作为构造函数的语法糖，同时有 prototype 属性和 __proto__ 属性，因此同时存在两条继承链。

（1）子类的 __proto__ 属性，表示构造函数的继承，总是指向父类。

（2）子类 prototype 属性的 __proto__ 属性，表示方法的继承，总是指向父类的 prototype 属性

class Parent {
}

class Child extends Parent {
}

console.log(Child.__proto__ === Parent); // true
console.log(Child.prototype.__proto__ === Parent.prototype); // true

继承目标
extends 关键字后面可以跟多种类型的值。

class B extends A {
}
上面代码的 A，只要是一个有 prototype 属性的函数，就能被 B 继承。由于函数都有 prototype 属性（除了 Function.prototype 函数），因此 A 可以是任意函数。

除了函数之外，A 的值还可以是 null，当 extend null 的时候：

class A extends null {
}

console.log(A.__proto__ === Function.prototype); // true
console.log(A.prototype.__proto__ === undefined); // true



3.Babel 将 Generator 编译成了什么样子
Generator
function* helloWorldGenerator() {
  yield 'hello';
  yield 'world';
  return 'ending';
}
我们打印下执行的结果：

var hw = helloWorldGenerator();

console.log(hw.next()); // {value: "hello", done: false}
console.log(hw.next()); // {value: "world", done: false}
console.log(hw.next()); // {value: "ending", done: true}
console.log(hw.next()); // {value: undefined, done: true}

4. Babel 将 Async 编译成了什么样子
Async
const fetchData = (data) => new Promise((resolve) => setTimeout(resolve, 1000, data + 1))

const fetchValue = async function () {
    var value1 = await fetchData(1);
    var value2 = await fetchData(value1);
    var value3 = await fetchData(value2);
    console.log(value3)
};

fetchValue();
// 大约 3s 后输出 4