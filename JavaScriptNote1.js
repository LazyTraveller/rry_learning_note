import { async, reject } from "q";

//《JavaScript学习笔记的收集》
//1.继承方式
function People() {
    this.type = 'people';

}
People.prototype.eat = function() {
    console.warn('eat food');
}

//构造函数继承
function Man(name) {
    People.call(this);
    this.color = 'red';
    this.name = name;
}

//原型继承
Man.prototype = new People();
// 寄生组合继承
Man.prototype = Object.create(People.prototype, {
    constructor: {
        value: Man
    }
})

//2.基于promise的Ajax封装
function ajax(url, method = 'get', param = {}) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const paramString = getStringParam(param);
        if (method === 'get' && paramString) {
            url.indexOf('?') > -1 ? url += paramString: url+=`?${paramString}`;
        }
        xhr.open(method, url);
        xhr.onload = function () {
            const result = {
                status: xhr.status,
                statusText: xhr.statusText,
                header: xhr.getAllResponseHeaders(),
                data: xhr.response || xhr.responseText
            }
            if ((xhr.statusText >= 200 && xhr.status < 300) || xhr.status == 304) {
                resolve(result);
            } else {
                reject(result);
            }
        }
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.withCredentials = true;
        xhr.onerror = function () {
            reject(new TypeError('请求出错'));
        }
        xhr.timeout = function () {
            reject(new TypeError('请求超时'));
        }
        xhr.onabort = function () {
            reject(new TypeError('请求终止'));
        }
        if (method === 'post') {
            xhr.send(paramString);
        } else {
            xhr.send();
        }
    })
}

function getStringParam(param) {
    let dataString = '';
    for (const key in param) {
        dataString += `${key}=${param[key]}&`
    }
    return dataString;
}

//3.拷贝
//浅拷贝
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

//4.类型判断
//typeof //使用引用类型  number, string, undefined, boolean, symbol
//instanceof  //适用与应用类型  RegExp, Array, Data, Object, function

_proto_ //隐式原型
prototype //显式原型

Object.prototype.toString.call(true)//boolean
Object.prototype.toString.call(123)//number
Object.prototype.toString.call("Jerry")//string 
Object.prototype.toString.call(null) //null
Object.prototype.toString.call(undefined)// undefined
Object.prototype.toString.call(Symbol()) //symbol
Object.prototype.toString.call({}) // Object
Object.prototype.toString.call(function() {}) //function
Object.prototype.toString.call([]) //Arrar
Object.prototype.toString.call(new Error()) //Error
Object.prototype.toString.call(new RegExp()) //RegExp
Object.prototype.toString.call(Math) // Math
Object.prototype.toString.call(JSON) // JSON
Object.prototype.toString.call(new document) //RegExp
Object.prototype.toString.call(window) // Global call来改变this的指向

//5.三种情况避免使用箭头函数
//a.使用箭头函数定义的方法
let foo = {
    value: 1,
    getValue: () => console.log(this.value)
}
foo.getValue(); //undefined

function Foo() {
    this.value = 1
}

// b.定义原型的方法
Foo.prototype.getValue = () => console.log(this.value)
let foo = new Foo();
foo.getValue(); // undefined

// c.作为事件的回调函数
const button = document.getElementById('myButton');
button.addEventListener('click', () => {
    console.log(this === window);
    this.innerHTML = "Clicked button";
});

//6.symbol可用来当作属性或者switch的不可变值
const string = Symbol("demo");
console.log(string);


const TYPE_AUDIO = Symbol();
const TYPE_VIDEO = Symbol();
const TYPE_IMAGE = Symbol();

function handleFileResource(resource) {
    switch(resource.type) {
        case TYPE_AUDIO:
            playAudio(resource);
            break;
        case TYPE_IMAGE:
            playImage(resource);
            break;
        case TYPE_VIDEO:
            playVideo(resource);
            break;
        default: 
          throw new Error("Unkown type of resource")
    }
}

//7.MVC,MVVC,MVVM模式的理解
// 1.MVC(Model-View-Controller)
// Model(模型):数据层，负责存储数据。
// View(视图):展现层，用户所看到的页面
// Controller(控制器):协调层，负责协调Model和View，根据用户在View上的动作在Model上作出对应的更改，同时将更改的信息返回到View上。
// 三者之间的关系
// Controller可以直接访问Model，也可以直接控制View,但是Model和View不能相互通信，相当于COntroller就是介于这两者之间的协调者。

// 2,MVVM(Model-View-ViewModel)
// Model(模型):数据层，负责存储数据。
// View(控制器):就是ViewController层，他的任务就是从ViewModel层获取数据，然后显示。
// ViewModel(视图模型):就是View和Model层的粘合剂，封装业务逻辑处理，封装网络处理，封装数据缓存。就是把原来ViewController层的业务逻辑和页面逻辑等剥离出来放到ViewModel层。

// 3,MVVC(Model-View-View-Controller)
// Model(模型):数据层，负责存储数据。
// View(视图):展现层，创建需求创建cell
// View(视图):定义数组，用来接收控制中的数据。处理回调（比如:刷新回调、点击cell回调、加载更多回调、动态视图高度回调等等）

// Controller(控制器):加载网络数据懒加载



// 8. 简述Vue的响应式原理
// 当一个Vue实例创建时，vue会遍历data选项的属性，用 Object.defineProperty 将它们转为 getter/setter
// 并且在内部追踪相关依赖，在属性被访问和修改时通知变化。

// 每个组件实例都有相应的 watcher 程序实例，它会在组件渲染的过程中把属性记录为依赖，
// 之后当依赖项的 setter 被调用时，会通知 watcher 重新计算，从而致使它关联的组件得以更新。


// 9. 简述Vue的生命周期

// 它可以总共分为8个阶段：

// beforeCreate（创建前）,

// created（创建后）,

// beforeMount(载入前),

// mounted（载入后）,

// beforeUpdate（更新前）,

// updated（更新后）,

// beforeDestroy（销毁前）,

// destroyed（销毁后）



// 10.vue 与 react优缺点对比
// vue
// API设计上简单，语法简单，学习成本低
// 构建方面不包含路由和ajax功能，使用vuex, vue-router
// 指令（dom）和组件（视图，数据，逻辑）处理清晰
// 性能好，容易优化
// 基于依赖追踪的观察系统，并且异步队列更新
// 独立触发
// v-model 实时渲染
// 适用于：模板和渲染函数的弹性选择
// 简单的语法及项目搭建
// 更快的渲染速度和更小的体积
// react
// 利用jsx创建虚拟dom
// 是一种在内存中描述dom数状态的数据结构
// 函数式的方法描述视图
// 使用虚拟dom作为模板
// 程序片段
// 不好控制dom
// 生命周期
// 服务端渲染：react的虚拟dom的生成可以在任何支持js的环境生成的，所以可以在node环境生成，直接转为string,然后插入到html文件中输出浏览器便可
// 适用于：大型应用和更好的可测试性；同时适用于web端和原生app;更大的生态圈
// 优点
// React伟大之处就在于，提出了Virtual Dom这种新颖的思路，并且这种思路衍生出了React Native，有可能会统一Web/Native开发。在性能方面，由于运用了Virtual Dom技术，Reactjs只在调用setState的时候会更新dom，而且还是先更新Virtual Dom，然后和实际Dom比较，最后再更新实际Dom。这个过程比起Angularjs的bind方式来说，一是更新dom的次数少，二是更新dom的内容少，速度肯定快
// ReactJS更关注UI的组件化，和数据的单向更新，提出了FLUX架构的新概念，现在React可以直接用Js ES6语法了，然后通过webpack编译成浏览器兼容的ES5，开发效率上有些优势.
// React Native生成的App不是运行在WebView上，而是系统原生的UI，React通过jsx生成系统原生的UI，iOS和Android的React UI组件还是比较相似的，大量代码可以复用
// 维护UI的状态,Angular 里面使用的是 $scope，在 React 里面使用的是 this.setState。 而 React 的好处在于，它更简单直观。所有的状态改变都只有唯一一个入口 this.setState()，
// 同构的JavaScript
// 单页面JS应用程序的最大缺陷在于对搜索引擎的索引有很大限制。React对此有了解决方案。
// React可以在服务器上预渲染应用再发送到客户端。它可以从预渲染的静态内容中恢复一样的记录到动态应用程序中。
// 因为搜索引擎的爬虫程序依赖的是服务端响应而不是JavaScript的执行，预渲染你的应用有助于搜索引擎优化。
// 缺点
// React是目标是UI组件，通常可以和其它框架组合使用，目前并不适合单独做一个完整的框架。React 即使配上 redux 的组合，也不能称之一个完整的框架，比如你想用Promise化的AJAX？对不起没有，自己找现成的库去。而且第三方组件远远不如Angular多。目前在大的稳定的项目上采用React的，我也就只知道有Yahoo的Email。React本身只是一个V而已，所以如果是大型项目想要一套完整的框架的话，也许还需要引入Redux和route相关的东西。
// vue,react 共性：
// 虚拟dom实现快速渲染
// 轻量级响应式组件
// 服务端渲染易于集成路由工具，打包工具及状态管理工具


//11，vue2.0中的$router 和 $route的区别
// 1.router是VueRouter的一个对象，通过Vue.use(VueRouter)和VueRouter构造函数得到一个router的实例对象，这个对象中是一个全局的对象，他包含了所有的路由包含了许多关键的对象和属性。
// 举例：history对象

// $router.push({path:'home'});本质是向history栈中添加一个路由，在我们看来是 切换路由，但本质是在添加一个history记录

// 方法：

// $router.replace({path:'home'});//替换路由，没有历史记录

// 2.route是一个跳转的路由对象，每一个路由都会有一个route对象，是一个局部的对象，可以获取对应的name,path,params,query等

// 我们可以从vue devtools中看到每个路由对象的不同


// 12.如何优化SPA应用的首屏加载速度慢的问题？
// 将公用的JS库通过script标签外部引入，减小app.bundel的大小，让浏览器并行下载资源文件，提高下载速度；
// 在配置 路由时，页面和组件使用懒加载的方式引入，进一步缩小 app.bundel 的体积，在调用某个组件时再加载对应的js文件；
// 加一个首屏 loading 图，提升用户体验


// 13，网页从输入网址到渲染完成经历了哪些过程？
// 输入网址；
// 发送到DNS服务器，并获取域名对应的web服务器对应的ip地址；
// 与web服务器建立TCP连接；
// 浏览器向web服务器发送http请求；
// web服务器响应请求，并返回指定url的数据（或错误信息，或重定向的新的url地址）；
// 浏览器下载web服务器返回的数据及解析html源文件；
// 生成DOM树，解析css和js，渲染页面，直至显示完成；


// 13.ajax请求的过程
// 1、创建XMLHttpRequest对象
// 2，创建一个新的HTTP请求,并指定该HTTP请求的方法、URL及验证信息.
// 3，设置响应HTTP请求状态变化的函数.
// 4，发送HTTP请求.
// 5，获取异步调用返回的数据.
// 6，使用JavaScript和DOM实现局部刷新.


//14.js数组去重
//a.es6 set去重
let array = [1,1,1,1,3,4,5,6,7,8]
let set = new Set(array);
console.warn(set); //set {1,3,4,5,6,7,8}

//b.js去重
function uniq(array) {
    var temp = [];
    for (var i = 0; i < array.length; i++) {
        if (temp.indexOf(array[i]) == -1) {
            temp.push(array[i]);
        }
    }
    return temp;
}

//15.js数组排序
var arrsimpe12 = [,3,54,6,7,894,5,3,9];
arrsimpe12.push(100)
arrsimpe12.sort(function(a,b) {
    return b - a
});
console.warn(arrsimpe12);


// 16.js的原型和原型链
// 1、javascript原型
// JS中每个函数都存在有一个原型对象属性prototype。并且所有函数的默认原型都是Object的实例。
// 2、javascript原型链
// 每个继承父函数的子函数的对象都包含一个内部属性_proto_。该属性包含一个指针，指向父函数的prototype。
// 若父函数的原型对象的_proto_属性为再上一层函数。在此过程中就形成了原型链。


// 17.js有哪些内置对象
// Math对象：Math.abs(x);//用来返回数的绝对值
// Date对象：var date = new Date();// 通过new的方式创建一个日期对象；
// Array对象：var arr=new Array();
// 字符串对象：var str=new String();


// 18，js操作数组的方法
// join()：join(separator): 将数组的元素组起一个字符串，以separator为分隔符，省略的话则用默认用逗号为分隔符，该方法只接收一个参数：即分隔符。
// push()和pop()：push(): 可以接收任意数量的参数，把它们逐个添加到数组末尾，并返回修改后数组的长度。 pop()：数组末尾移除最后一项，减少数组的 length 值，然后返回移除的项。
// shift() 和 unshift()：shift()：删除原数组第一项，并返回删除元素的值；如果数组为空则返回undefined 。 unshift:将参数添加到原数组开头，并返回数组的长度
// sort()：按升序排列数组项——即最小的值位于最前面，最大的值排在最后面
// reverse()：反转数组项的顺序。
// concat()：将参数添加到原数组中。这个方法会先创建当前数组一个副本，然后将接收到的参数添加到这个副本的末尾，最后返回新构建的数组。在没有给 concat()方法传递参数的情况下，它只是复制当前数组并返回副本。
// slice()：返回从原数组中指定开始下标到结束下标之间的项组成的新数组。slice()方法可以接受一或两个参数，即要返回项的起始和结束位置。在只有一个参数的情况下， slice()方法返回从该参数指定位置开始到当前数组末尾的所有项。如果有两个参数，该方法返回起始和结束位置之间的项——但不包括结束位置的项。
// splice()：splice()：很强大的数组方法，它有很多种用法，可以实现删除、插入和替换。
// 删除：可以删除任意数量的项，只需指定 2 个参数：要删除的第一项的位置和要删除的项数。例如， splice(0,2)会删除数组中的前两项。
// 插入：可以向指定位置插入任意数量的项，只需提供 3 个参数：起始位置、 0（要删除的项数）和要插入的项。例如，splice(2,0,4,6)会从当前数组的位置 2 开始插入4和6。
// 替换：可以向指定位置插入任意数量的项，且同时删除任意数量的项，只需指定 3 个参数：起始位置、要删除的项数和要插入的任意数量的项。插入的项数不必与删除的项数相等。例如，splice (2,1,4,6)会删除当前数组位置 2 的项，然后再从位置 2 开始插入4和6。
// splice()方法始终都会返回一个数组，该数组中包含从原始数组中删除的项，如果没有删除任何项，则返回一个空数组。
// indexOf()和 lastIndexOf() （ES5新增）：indexOf()：接收两个参数：要查找的项和（可选的）表示查找起点位置的索引。其中， 从数组的开头（位置 0）开始向后查找。
// lastIndexOf：接收两个参数：要查找的项和（可选的）表示查找起点位置的索引。其中， 从数组的末尾开始向前查找。
// 这两个方法都返回要查找的项在数组中的位置，或者在没找到的情况下返回1。在比较第一个参数与数组中的每一项时，会使用全等操作符。
// forEach() （ES5新增）forEach()：对数组进行遍历循环，对数组中的每一项运行给定函数。这个方法没有返回值。参数都是function类型，默认有传参，参数分别为：遍历的数组内容；第对应的数组索引，数组本身。
// map() （ES5新增）map()：指“映射”，对数组中的每一项运行给定函数，返回每次函数调用的结果组成的数组。
// filter() （ES5新增）filter()：“过滤”功能，数组中的每一项运行给定函数，返回满足过滤条件组成的数组。
// every() （ES5新增）every()：判断数组中每一项都是否满足条件，只有所有项都满足条件，才会返回true。
// some() （ES5新增）some()：判断数组中是否存在满足条件的项，只要有一项满足条件，就会返回true。
// reduce()和 reduceRight() （ES5新增）这两个方法都会实现迭代数组的所有项，然后构建一个最终返回的值。reduce()方法从数组的第一项开始，逐个遍历到最后。而 reduceRight()则从数组的最后一项开始，向前遍历到第一项。
// 这两个方法都接收两个参数：一个在每一项上调用的函数和（可选的）作为归并基础的初始值。
// 传给 reduce()和 reduceRight()的函数接收 4 个参数：前一个值、当前值、项的索引和数组对象。这个函数返回的任何值都会作为第一个参数自动传给下一项。第一次迭代发生在数组的第二项上，因此第一个参数是数组的第一项，第二个参数就是数组的第二项。



// 19，什么是闭包，闭包的优缺点
// 闭包各种专业文献的闭包定义都非常抽象，我的理解是: 闭包就是能够读取其他函数内部变量的函数。
// 由于在javascript中，只有函数内部的子函数才能读取局部变量，所以说，闭包可以简单理解成“定义在一个函数内部的函数“。
// 所以，在本质上，闭包是将函数内部和函数外部连接起来的桥梁。
// 优点：
// 1. 逻辑连续，当闭包作为另一个函数调用的参数时，避免你脱离当前逻辑而单独编写额外逻辑。
// 2. 方便调用上下文的局部变量。
// 3. 加强封装性，第2点的延伸，可以达到对变量的保护作用。
// 缺点：
// 闭包有一个非常严重的问题，那就是内存浪费问题，这个内存浪费不仅仅因为它常驻内存，更重要的是，对闭包的使用不当会造成无效内存的产生


// 20，阻止时间冒泡和默认事件
// 1，e.stopPropagation()
// 2，e.preventDefault()，
// 3，return false




// 21，javascript中apply、call和bind的区别
// 在JS中，这三者都是用来改变函数的this对象的指向的，他们有什么样的区别呢。
// 在说区别之前还是先总结一下三者的相似之处：
// 1、都是用来改变函数的this对象的指向的。
// 2、第一个参数都是this要指向的对象。
// 3、都可以利用后续参数传参
// call和apply都是对函数的直接调用，而bind方法返回的仍然是一个函数，因此后面还需要()来进行调用才可以。
// call后面的参数与say方法中是一一对应的，而apply的第二个参数是一个数组，数组中的元素是和say方法中一一对应的，这就是两者最大的区别。


// 22.写一个闭包
var result = f00(1)(2);
alert(result);

function foo(a) {
    return function (b) {
        return a+b;
    }
}


// 23HTTP中Get、Post、Put与Delete的区别
// 1、GET请求会向数据库发索取数据的请求，从而来获取信息，该请求就像数据库的select操作一样，只是用来查询一下数据，不会修改、增加数据，不会影响资源的内容，即该请求不会产生副作用。无论进行多少次操作，结果都是一样的。
// 2、与GET不同的是，PUT请求是向服务器端发送数据的，从而改变信息，该请求就像数据库的update操作一样，用来修改数据的内容，但是不会增加数据的种类等，也就是说无论进行多少次PUT操作，其结果并没有不同。
// 3、POST请求同PUT请求类似，都是向服务器端发送数据的，但是该请求会改变数据的种类等资源，就像数据库的insert操作一样，会创建新的内容。几乎目前所有的提交操作都是用POST请求的。
// 4、DELETE请求顾名思义，就是用来删除某一个资源的，该请求就像数据库的delete操作。
// 就像前面所讲的一样，既然PUT和POST操作都是向服务器端发送数据的，那么两者有什么区别呢。。。POST主要作用在一个集合资源之上的（url），而PUT主要作用在一个具体资源之上的（url/xxx），通俗一下讲就是，如URL可以在客户端确定，那么可使用PUT，否则用POST。
// 综上所述，我们可理解为以下：
// 1、POST /url 创建
// 2、DELETE /url/xxx 删除
// 3、PUT /url/xxx 更新
// 4、GET /url/xxx 查看

// GET和POST的区别
// 区别一:
// GET重点从服务器上获取资源,POST重点向服务器发送数据.
// 区别二:
// get传输数据是通过URL请求，置于URL后，并用”?”连接，多个请求数据间用”&”连接.post传输数据通过Http的post机制，将字段与对应值封存在请求实体中发送给服务器，这个过程对用户是不可见的；
// 区别三:
// Get传输的数据量小，因为受URL长度限制，但效率较高；
// Post可以传输大量数据，所以上传文件时只能用Post方式；
// 区别四:
// get是不安全的，因为URL是可见的，可能会泄露私密信息，如密码等；
// post较get安全性较高；
// 区别五:
// get方式只能支持ASCII字符，向服务器传的中文字符可能会乱码。
// post支持标准字符集，可以正确传递中文字符。

// 24,箭头函数和普通函数的区别
// 1,箭头函数是匿名函数，不能作为构造函数，不能使用new
// 2,箭头函数不绑定arguments，取而代之用rest参数...解决
// 3,箭头函数不绑定this，会捕获其所在的上下文的this值，作为自己的this值
// 4,箭头函数通过 call() 或 apply() 方法调用一个函数时，只传入了一个参数，对 this 并没有影响。
// 5,箭头函数没有原型属性
// 6,箭头函数不能当做Generator函数,不能使用yield关键字

//25.理解async/await
//JavaScript对异步
//async函数是generator函数的语法糖，使用关键字async来表示， 在函数内部使用await来表示异步
//相较于generator，Async函数的改进在于下面四点
//内置执行器，generator函数的执行必须依靠执行器，而aysnc函数自带执行器，调用的方式跟普通的函数调用一样
//更好的语义， async 和 await 相较于 * 和 yield 更加语义化
// 更广的适用性。co 模块约定，yield 命令后面只能是 Thunk 函数或 Promise对象。而 async 函数的 await 
// 命令后面则可以是 Promise 或者 原始类型的值（Number，string，boolean，但这时等同于同步操作）
// 返回值是 Promise。async 函数返回值是 Promise 对象，比 Generator 函数返回的 Iterator 对象方便，可以直接使用 then() 方法进行调用

//async 与其他的异步操作的对比
//先定义一个fetch方法用于获取GitHub user 的信息
function fetchUser() {
    return new Promise((resolve, reject) => {
        fetch('api.github.com/users/su...').then((data)=> {
            resolve(data.json());
        },(error) => {
            reject(error);
        });
    });
}

//Promise的方式
function getUserByPromise() {
    fetchUser().then((data)=> {
        console.warn(data)
    }, (error) => {
        console.warn(error)
    })
}
getUserByPromise();
//Promise的方式虽然解决了callback hell 但是这个方式充满了Promise的then()方法，如果处理流程复杂的话
//整段代码充满then，语义化不明显

//Generator方式
function FetchUserByGenerator() {
    const user = yield fetchUser();
    return user;
}
const g = FetchUserByGenerator();
const result = g.next().value;
result.then((v) => { console.warn(v)},(error) => {console.warn(error)})
// Generator 的方式解决了 Promise 的一些问题，流程更加直观、语义化。但是 Generator 的问题在于，
// 函数的执行需要依靠执行器，每次都需要通过 g.next() 的方式去执行。

// async 方式
async function getUserByAsync() {
    let User = await fetchUser();
    return User;
}

getUserByAsync().then(v=>console.warn(v));
//async 函数完美的解决了上面两种方式的问题。流程清晰，直观、语义明显。操作异步流程就如同操作同步流程。同时 async 函数自带执行器，执行的时候无需手动加载。
// 语法

// async 函数返回一个 Promise 对象
// async 函数内部 return 返回的值。会成为 then 方法回调函数的参数。
async function f() {
    return 'hello world';
}
f().then(((v) => console.warn(v))) //hello world
// 如果 async 函数内部抛出异常，则会导致返回的 Promise 对象状态变为 reject 状态。抛出的错误而会被 catch 方法回调函数接收到。
async function e() {
    throw new (Error('error'))
}
e().then(v => console.warn(v)).catch(e => console.warn(e));

// async 函数返回的 Promise 对象，必须等到内部所有的 await 命令的 Promise 对象执行完，才会发生状态改变
// 也就是说，只有当 async 函数内部的异步操作都执行完，才会执行 then 方法的回调。
const delay = timeout => new Promise(resolve => setTimeout(resolve, timeout));
async function f1() {
    await delay(1000);
    await delay(2000);
    await delay(3000);
    return 'deno';
}
f1().then(v => console.warn(v)); 

// 正常情况下，await 命令后面跟着的是 Promise ，如果不是的话，也会被转换成一个 立即 resolve 的 Promise
async function f() { return await 1 }; f().then( (v) => console.log(v)) // 1

// 如果返回的是 reject 的状态，则会被 catch 方法捕获。
// Async 函数的错误处理
// async 函数的语法不难，难在错误处理上。

// 先来看下面的例子：
// let a; async function f() { await Promise.reject('error'); a = await 1; // 这段 await 并没有执行 } f().then(v => console.log(a));
// 如上面所示，当 async 函数中只要一个 await 出现 reject 状态，则后面的 await 都不会被执行。
// 解决办法：可以添加 try/catch。

let a;
async function correct() {
    try {
        await Promise.reject('error')
    } catch (error) {
        console.warn(error);
    }
    a = await 1;
    return a;
}

correct.then(v => console.warn(v));

//26.JavaScript数据类型
// //原始类型

// Null：只包含一个值：null
// Undefined：只包含一个值：undefined
// Boolean：包含两个值：true和false
// Number：整数或浮点数，还有一些特殊值（-Infinity、+Infinity、NaN）
// String：一串表示文本值的字符序列
// Symbol：一种实例是唯一且不可改变的数据类型
// (在es10中加入了第七种原始类型BigInt，现已被最新Chrome支持)

// 对象类型

// Object：自己分一类丝毫不过分，除了常用的Object，Array、Function等都属于特殊的对象

// 不可变性
// 栈内存：

// 存储的值大小固定
// 空间较小
// 可以直接操作其保存的变量，运行效率高
// 由系统自动分配存储空间
// JavaScript中的原始类型的值被直接存储在栈中，在变量定义时，栈就为其分配好了内存空间。

// 堆内存：

// 存储的值大小不定，可动态调整
// 空间较大，运行效率低
// 无法直接操作其内部存储，使用引用地址读取
// 通过代码进行分配空间
// 相对于上面具有不可变性的原始类型，我习惯把对象称为引用类型，
// 引用类型的值实际存储在堆内存中，它在栈中只存储了一个固定长度的地址，这个地址指向堆内存中的值。


//复制
//原始数据
var name = 'ConardLi';
var name2 = name;
name2 = 'code秘密花园';
console.log(name); // ConardLi;
// 虽然两者值是相同的，但是两者指向的内存空间完全不同，这两个变量参与任何操作都互不影响。
//引用数据
var obj = {name:'ConardLi'};
var obj2 = obj;
obj2.name = 'code秘密花园';
console.log(obj.name); // code秘密花园
// 当我们复制引用类型的变量时，实际上复制的是栈中存储的地址，
//所以复制出来的obj2实际上和obj指向的堆中同一个对象。因此，我们改变其中任何一个变量的值，另一个变量都会受到影响，这就是为什么会有深拷贝和浅拷贝的原因。

var name = 'ConardLi';
var name2 = 'ConardLi';
console.log(name === name2); // true
var obj = {name:'ConardLi'};
var obj2 = {name:'ConardLi'};
console.log(obj === obj2); // false

// 对于原始类型，比较时会直接比较它们的值，如果值相等，即返回true。
// 对于引用类型，比较时会比较它们的引用地址，虽然两个变量在堆中存储的对象具有的属性值都是相等的，但是它们被存储在了不同的存储空间，因此比较值为false
// ECMAScript中所有的函数的参数都是按值传递的


//27.分不清null 和undefined
// 在原始类型中，有两个类型Null和Undefined，他们都有且仅有一个值，null和undefined，并且他们都代表无和空，我一般这样区分它们：
// null
// 表示被赋值过的对象，刻意把一个对象赋值为null，故意表示其为空，不应有值。
// 所以对象的某个属性值为null是正常的，null转换为数值时值为0。
// undefined
// 表示“缺少值”，即此处应有一个值，但还没有定义，
// 如果一个对象的某个属性值为undefined，这是不正常的，如obj.name=undefined，我们不应该这样写，应该直接delete obj.name。
// undefined转为数值时为NaN(非数字值的特殊值)
// JavaScript是一门动态类型语言，成员除了表示存在的空值外，还有可能根本就不存在（因为存不存在只在运行期才知道），这就是undefined的意义所在。

//28.不老实的Number类型
// 计算机中所有的数据都是以二进制存储的，所以在计算时计算机要把数据先转换成二进制进行计算，然后在把计算结果转换成十进制。
// 由上面的代码不难看出，在计算0.1+0.2时，二进制计算发生了精度丢失，导致再转换成十进制后和预计的结果不符。

//28.引用类型
// Array 数组
// Date 日期
// RegExp 正则
// Function 函数
// 包装类型
// 为了便于操作基本类型值，ECMAScript还提供了几个特殊的引用类型，他们是基本类型的包装类型：

// Boolean
// Number
// String
// 注意包装类型和原始类型的区别：

true === new Boolean(true); // false
123 === new Number(123); // false
'ConardLi' === new String('ConardLi'); // false
console.log(typeof new String('ConardLi')); // object
console.log(typeof 'ConardLi'); // string

// 引用类型和包装类型的主要区别就是对象的生存期，使用new操作符创建的引用类型的实例，在执行流离开当前作用域之前都一直保存在内存中，
// 而自基本类型则只存在于一行代码的执行瞬间，然后立即被销毁，这意味着我们不能在运行时为基本类型添加属性和方法。

// 装箱和拆箱
// 装箱转换：把基本类型转换为对应的包装类型

// 拆箱操作：把引用类型转换为基本类型

// 既然原始类型不能扩展属性和方法，那么我们是如何使用原始类型调用方法的呢？

// 每当我们操作一个基础类型时，后台就会自动创建一个包装类型的对象，从而让我们能够调用一些方法和属性，例如下面的代码：

var name = "ConardLi";
var name2 = name.substring(2);
// 实际上发生了以下几个过程：

// 创建一个String的包装类型实例
// 在实例上调用substring方法
// 销毁实例
// 也就是说，我们使用基本类型调用方法，就会自动进行装箱和拆箱操作，相同的，我们使用Number和Boolean类型时，也会发生这个过程

// 除了程序中的自动拆箱和自动装箱，我们还可以手动进行拆箱和装箱操作。我们可以直接调用包装类型的valueOf或toString，实现拆箱操作：
var num =new Number("123");  
console.log( typeof num.valueOf() ); //number
console.log( typeof num.toString() ); //string

//29.类型转换
// 因为JavaScript是弱类型的语言，所以类型转换发生非常频繁，上面我们说的装箱和拆箱其实就是一种类型转换。
// 类型转换分为两种，隐式转换即程序自动进行的类型转换，强制转换即我们手动进行的类型转换。
// 类型转换规则
// 如果发生了隐式转换，那么各种类型互转符合下面的规则：type.png

// f语句和逻辑语句
// 在if语句和逻辑语句中，如果只有单个变量，会先将变量转换为Boolean值，只有下面几种情况会转换成false，其余被转换成true：

// null
// undefined
// ''
// NaN
// 0
// false
// #7.3 各种运数学算符
// 我们在对各种非Number类型运用数学运算符(- * /)时，会先将非Number类型转换为Number类型;

// 1 - true // 0
// 1 - null //  1
// 1 * undefined //  NaN
// 2 * ['5'] //  10
// 注意+是个例外，执行+操作符时：

// // 1.当一侧为String类型，被识别为字符串拼接，并会优先将另一侧转换为字符串类型。
// // 2.当一侧为Number类型，另一侧为原始类型，则将原始类型转换为Number类型。
// // 3.当一侧为Number类型，另一侧为引用类型，将引用类型和Number类型转换成字符串后拼接。
// 123 + '123' // 123123   （规则1）
// 123 + null  // 123    （规则2）
// 123 + true // 124    （规则2）
// 123 + {}  // 123[object Object]    （规则3）

// 30.==
// 使用==时，若两侧类型相同，则比较结果和===相同，否则会发生隐式转换，使用==时发生的转换可以分为几种不同的情况（只考虑两侧类型不同）：

// 1.NaN
// NaN和其他任何类型比较永远返回false(包括和他自己)。

// NaN == NaN // false
// 2.Boolean
// Boolean和其他任何类型比较，Boolean首先被转换为Number类型。

// true == 1  // true 
// true == '2'  // false
// true == ['1']  // true
// true == ['2']  // false
// 这里注意一个可能会弄混的点：undefined、null和Boolean比较，虽然undefined、null和false都很容易被想象成假值，但是他们比较结果是false，原因是false首先被转换成0：

// undefined == false // false
// null == false // false
// 3.String和Number
// String和Number比较，先将String转换为Number类型。

// 123 == '123' // true
// '' == 0 // true
// 4.null和undefined
// null == undefined比较结果是true，除此之外，null、undefined和其他任何结果的比较值都为false。

// null == undefined // true
// null == '' // false
// null == 0 // false
// null == false // false
// undefined == '' // false
// undefined == 0 // false
// undefined == false // false
// 5.原始类型和引用类型
// 当原始类型和引用类型做比较时，对象类型会依照ToPrimitive规则转换为原始类型:

//   '[object Object]' == {} // true
//   '1,2,3' == [1, 2, 3] // true
// 来看看下面这个比较：

// [] == ![] // true
// !的优先级高于==，![]首先会被转换为false，然后根据上面第三点，false转换成Number类型0，左侧[]转换为0，两侧比较相等。

// [null] == false // true
// [undefined] == false // true
// 根据数组的ToPrimitive规则，数组元素为null或undefined时，该元素被当做空字符串处理，所以[null]、[undefined]都会被转换为0。

// 所以，说了这么多，推荐使用===来判断两个值是否相等..