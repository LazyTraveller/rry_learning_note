import { func, object } from "prop-types";

1.迭代器与 for of
一段标准的 for 循环代码：

var colors = ["red", "green", "blue"];

for (var i = 0, len = colors.length; i < len; i++) {
    console.log(colors[i]);
}
看着很简单，但是再回顾这段代码，实际上我们仅仅是需要数组中元素的值，但是却需要提前获取数组长度，声明索引变量等，尤其当多个循环嵌套的时候，更需要使用多个索引变量，代码的复杂度就会大大增加，比如我们使用双重循环进行去重：

function unique(array) {
    var res = [];
    for (var i = 0, arrayLen = array.length; i < arrayLen; i++) {
        for (var j = 0, resLen = res.length; j < resLen; j++) {
            if (array[i] === res[j]) {
                break;
            }
        }
        if (j === resLen) {
            res.push(array[i]);
        }
    }
    return res;
}
为了消除这种复杂度以及减少循环中的错误(比如错误使用其他循环中的变量)，ES6 提供了迭代器和 for of 循环共同解决这个问题。

迭代器
所谓迭代器，其实就是一个具有 next() 方法的对象，每次调用 next() 都会返回一个结果对象，该结果对象有两个属性，value 表示当前的值，done 表示遍历是否结束。

我们直接用 ES5 的语法创建一个迭代器： 
function createIterator(items) {
    var i =0;
    return {
        next: function() {
            var done = i >= items.length;
            var value = !done ? items[i++] : undefined;
            return {
                done: done,
                value: value,
            }
        }
    }
}
var iterator = createIterator([1,2,3]);

console.log(iterator.next()); // { done: false, value: 1 }
console.log(iterator.next()); // { done: false, value: 2 }
console.log(iterator.next()); // { done: false, value: 3 }
console.log(iterator.next()); // { done: true, value: undefined }

for of
ES6 规定，默认的 Iterator 接口部署在数据结构的 Symbol.iterator 属性，或者说，一个数据结构只要具有 Symbol.iterator 属性，就可以认为是"可遍历的"（iterable）。
const obj = {
    value: 1
};

for (value of obj) {
    console.log(value);
}

// TypeError: iterator is not iterable
我们直接 for of 遍历一个对象，会报错，然而如果我们给该对象添加 Symbol.iterator 属性：
const obj = {
    value: 1
};

obj[Symbol.iterator] = function() {
    return createIterator([1,2,3]);
};

for (value of obj) {
    console.log(value);
}

// 1
// 2
// 3

默认可遍历对象
然而如果我们直接遍历一个数组对象：

const colors = ["red", "green", "blue"];

for (let color of colors) {
    console.log(color);
}

// red
// green
// blue
尽管我们没有手动添加 Symbol.iterator 属性，
还是可以遍历成功，这是因为 ES6 默认部署了 Symbol.iterator 属性，当然我们也可以手动修改这个属性：
var colors = ["red", "green", "blue"];

colors[Symbol.iterator] = function() {
    return createIterator([1, 2, 3]);
};

for (let color of colors) {
    console.log(color);
}

// 1
// 2
// 3
除了数组之外，还有一些数据结构默认部署了 Symbol.iterator 属性。

所以 for...of 循环可以使用的范围包括：

数组
Set
Map
类数组对象，如 arguments 对象、DOM NodeList 对象
Generator 对象
字符串
内建迭代器
为了更好的访问对象中的内容，比如有的时候我们仅需要数组中的值，但有的时候不仅需要使用值还需要使用索引，ES6 为数组、Map、Set 集合内建了以下三种迭代器：

entries() 返回一个遍历器对象，用来遍历[键名, 键值]组成的数组。对于数组，键名就是索引值。
keys() 返回一个遍历器对象，用来遍历所有的键名。
values() 返回一个遍历器对象，用来遍历所有的键值。
以数组为例：

var colors = ["red", "green", "blue"];

for (let index of colors.keys()) {
    console.log(index);
}

// 0
// 1
// 2

for (let color of colors.values()) {
    console.log(color);
}

// red
// green
// blue

for (let item of colors.entries()) {
    console.log(item);
}

// [ 0, "red" ]
// [ 1, "green" ]
// [ 2, "blue" ]
Map 类型与数组类似，但是对于 Set 类型需要注意以下：
var colors = new Set(["red", "green", "blue"]);

for (let index of colors.keys()) {
    console.log(index);
}

// red
// green
// blue

for (let color of colors.values()) {
    console.log(color);
}

// red
// green
// blue

for (let item of colors.entries()) {
    console.log(item);
}

// [ "red", "red" ]
// [ "green", "green" ]
// [ "blue", "blue" ]
Set 类型的 keys() 和 values() 返回的是相同的迭代器，这也意味着在 Set 这种数据结构中键名与键值相同。

而且每个集合类型都有一个默认的迭代器，在 for-of 循环中，如果没有显式指定则使用默认的迭代器。数组和 Set 
集合的默认迭代器是 values() 方法，Map 集合的默认迭代器是 entries() 方法。

这也就是为什么直接 for of 遍历 Set 和 Map 数据结构，会有不同的数据结构返回：

const values = new Set([1, 2, 3]);

for (let value of values) {
    console.log(value);
}

// 1
// 2
// 3
const values = new Map([["key1", "value1"], ["key2", "value2"]]);
for (let value of values) {
    console.log(value);
}

// ["key1", "value1"]
// ["key2", "value2"]
遍历 Map 数据结构的时候可以顺便结合解构赋值：

const valuess = new Map([["key1", "value1"], ["key2", "value2"]]);

for (let [key, value] of valuess) {
    console.log(key + ":" + value);
}

// key1:value1
// key2:value2

数组(默认values), set(默认values), map(默认[keys, values]);




2.模拟实现一个 Set 数据结构

初始化
Set 本身是一个构造函数，用来生成 Set 数据结构。

let set = new Set();
Set 函数可以接受一个数组（或者具有 iterable 接口的其他数据结构）作为参数，用来初始化。

let set = new Set([1, 2, 3, 4, 4]);
console.log(set); // Set(4) {1, 2, 3, 4}

set = new Set(document.querySelectorAll('div'));
console.log(set.size); // 66

set = new Set(new Set([1, 2, 3, 4]));
console.log(set.size); // 4
属性和方法
操作方法有：

add(value)：添加某个值，返回 Set 结构本身。
delete(value)：删除某个值，返回一个布尔值，表示删除是否成功。
has(value)：返回一个布尔值，表示该值是否为 Set 的成员。
clear()：清除所有成员，无返回值。
举个例子：

let set = new Set();
console.log(set.add(1).add(2)); // Set [ 1, 2 ]

console.log(set.delete(2)); // true
console.log(set.has(2)); // false

console.log(set.clear()); // undefined
console.log(set.has(1)); // false
之所以每个操作都 console 一下，就是为了让大家注意每个操作的返回值。

遍历方法有：

keys()：返回键名的遍历器
values()：返回键值的遍历器
entries()：返回键值对的遍历器
forEach()：使用回调函数遍历每个成员，无返回值

注意 keys()、values()、entries() 返回的是遍历器

let set = new Set(['a', 'b', 'c']);
console.log(set.keys()); // SetIterator {"a", "b", "c"}
console.log([...set.keys()]); // ["a", "b", "c"]
let set = new Set(['a', 'b', 'c']);
console.log(set.values()); // SetIterator {"a", "b", "c"}
console.log([...set.values()]); // ["a", "b", "c"]
let set = new Set(['a', 'b', 'c']);
console.log(set.entries()); // SetIterator {"a", "b", "c"}
console.log([...set.entries()]); // [["a", "a"], ["b", "b"], ["c", "c"]]
let set = new Set([1, 2, 3]);
set.forEach((value, key) => console.log(key + ': ' + value));
// 1: 1
// 2: 2
// 3: 3
属性：

Set.prototype.constructor：构造函数，默认就是 Set 函数。
Set.prototype.size：返回 Set 实例的成员总数。


/**
 * 模拟实现第三版
 */
(function(global) {
    var NaNSymbol = Symbol('NaN');
    var encodeVal = function(value) {
        return value !== value ? NaNSymbol : value;
    }
    var decodeVal = function(value) {
        return (value === NaNSymbol) ? NaN : value;
    }
    var makeIterator = function(array, iterator) {
        var nextIndex = 0;
        var obj = {
            next: function() {
                return nextIndex < array.length ? { value: iterator(array[nextIndex++]), done, false} : { value: void 0, done: true };

            }
        };

        obj[Symbol.iterator] = function() {
            return obj;
        }
        return obj;
    }

    function forOf(obj, cb) {
        let iterable , result;
        if (typeof obj[Symbol.iterator] !== 'function') throw new TypeError(obj, 'is not iterable');
        if(typeof cb!=='function') throw new TypeError('cb must be callbale');
        iterable = obj[Symbol.iterator]();
        result = iterable.next();
        while(!result.done) {
            cb(result.value);
            result = iterable.next();
        }
    }

    function Set(data) {
        this._.value = [];
        this.size = 0;
        forOf(data, (item) => {
            this.add(item);
        })
    }
    Set.prototype['add'] = function(value) {
        value = encodeVal(value);
        if (this_values.indexOf(value) == -1) {
            this.this_values.push(value);
            ++this.size;
        }
        return this;
    }
    Set.prototype['has'] = function(value) {
        return (this._values.indexOf(encodeVal(value)) !== -1);
    }
    Set.prototype['delete'] = function(value) {
        var idx = this._values.indexOf(encodeVal(value));
        if(idx == -1)  return false;
        this._values.splice(idx, 1);
        --this.size;
        return true;
    }
    Set.prototype['clear'] = function(value) {
        this._values = [];
        this.size = 0;
    }

    Set.prototype['forEach'] = function(callbackFn, thisArg) {
        thisArg = thisArg || global;
        for (var i = 0; i < this._values.length; i++) {
            callbackFn.call(thisArg, this._values[i], this._values[i], this);
        }
    }

    Set.prototype['values'] = function() {
        return makeIterator(this._values, function(value){
            return [decodeVal(value), decodeVal(value)];
        })
    }

    Set.prototype['entries'] = function() {
        return makeIterator(this._values, function(value) { return [decodeVal(value), decodeVal(value)]; });
    }

    Set.prototype[Symbol.iterator] = function(){
        return this.values();
    }

    Set.prototype['forEach'] = function(callbackFn, thisArg) {
        thisArg = thisArg || global;
        var iterator = this.entries();

        forOf(iterator, (item) => {
            callbackFn.call(thisArg, item[1], item[0], this);
        })
    }

    Set.length = 0;

    global.Set = Set;

})(this)


4.WeakMap

1. WeakMap 只接受对象作为键名
const map = new WeakMap();
map.set(1, 2);
// TypeError: Invalid value used as weak map key
map.set(null, 2);
// TypeError: Invalid value used as weak map key
2. WeakMap 的键名所引用的对象是弱引用(内存随时都可能收回)

弱引用与强引用相对，是指不能确保其引用的对象不会被垃圾回收器回收的引用。 
一个对象若只被弱引用所引用，则被认为是不可访问（或弱可访问）的，并因此可能在任何时刻被回收。

在 JavaScript 中，一般我们创建一个对象，都是建立一个强引用：

var obj = new Object();
只有当我们手动设置 obj = null 的时候，才有可能回收 obj 所引用的对象。

而如果我们能创建一个弱引用的对象：

// 假设可以这样创建一个
var obj = new WeakObject();
我们什么都不用做，只用静静的等待垃圾回收机制执行，obj 所引用的对象就会被回收。

我们再来看看这句：

WeakMaps 保持了对键名所引用的对象的弱引用

所以 WeakMap 可以帮你省掉手动删除对象关联数据的步骤，所以当你不能或者不想控制关联数据的生命周期时就可以考虑使用 WeakMap。

总结这个弱引用的特性，就是 WeakMaps 保持了对键名所引用的对象的弱引用，即垃圾回收机制不将该引用考虑在内。只要所引用的对象的其他引用都被清除，垃圾回收机制就会释放该对象所占用的内存。也就是说，一旦不再需要，WeakMap 里面的键名对象和所对应的键值对会自动消失，不用手动删除引用。

也正是因为这样的特性，WeakMap 内部有多少个成员，取决于垃圾回收机制有没有运行，运行前后很可能成员个数是不一样的，而垃圾回收机制何时运行是不可预测的，因此 ES6 规定 WeakMap 不可遍历。

所以 WeakMap 不像 Map，一是没有遍历操作（即没有keys()、values()和entries()方法），也没有 size 属性，也不支持 clear 方法，所以 WeakMap只有四个方法可用：get()、set()、has()、delete()。

应用
1. 在 DOM 对象上保存相关数据
传统使用 jQuery 的时候，我们会通过 $.data() 方法在 DOM 对象上储存相关信息(就比如在删除按钮元素上储存帖子的 ID 信息)，jQuery 内部会使用一个对象管理 DOM 和对应的数据，当你将 DOM 元素删除，DOM 对象置为空的时候，相关联的数据并不会被删除，你必须手动执行 $.removeData() 方法才能删除掉相关联的数据，WeakMap 就可以简化这一操作：

let wm = new WeakMap(), element = document.querySelector(".element");
wm.set(element, "data");

let value = wm.get(elemet);
console.log(value); // data

element.parentNode.removeChild(element);
element = null;
2. 数据缓存
从上一个例子，我们也可以看出，当我们需要关联对象和数据，比如在不修改原有对象的情况下储存某些属性或者根据对象储存一些计算的值等，而又不想管理这些数据的死活时非常适合考虑使用 WeakMap。数据缓存就是一个非常好的例子：

const cache = new WeakMap();
function countOwnKeys(obj) {
    if (cache.has(obj)) {
        console.log('Cached');
        return cache.get(obj);
    } else {
        console.log('Computed');
        const count = Object.keys(obj).length;
        cache.set(obj, count);
        return count;
    }
}
3. 私有属性
WeakMap 也可以被用于实现私有变量，不过在 ES6 中实现私有变量的方式有很多种，这只是其中一种：

const privateData = new WeakMap();

class Person {
    constructor(name, age) {
        privateData.set(this, { name: name, age: age });
    }

    getName() {
        return privateData.get(this).name;
    }

    getAge() {
        return privateData.get(this).age;
    }
}

export default Person;