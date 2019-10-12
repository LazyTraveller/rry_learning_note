import { resolve } from "dns"
promise 
在异步处理成功和失败时，promise均为开发者提供相应的回调函数以编写业务逻辑，
这是一种解决异步嵌套的成熟机制，此外，它以环环相扣的链式结构避免了代码堆积。
var categories = [];
var news [];
new Promise((resolve, reject) => {
    ajax.get({
        methods: 'GET',
        url: '/categories'
    }).then((res)=> {
        categories = res.data;
        resolve(categories[0]);
    }).catch(error =>{
        reject(error);
    })
}).then((data) => {
    ajax.get({
        methods: 'GET',
        url: '/news',
        query: { categories: data}
    }).then((res) => {
        news = res.data
    })
}).catch(error => {
    console.log(error);
})

1.Promise

回调
回调嵌套
回调地狱

题目：红灯三秒亮一次，绿灯一秒亮一次，黄灯2秒亮一次；如何让三个灯不断交替重复亮灯？（用 Promse 实现）
function red() {
    console.warn('red')
}

function green() {
    console.warn('green')
}

function yellow() {
    console.warn('yellow')
}

var ligth = function(timer, func) {
    return new Promise((resolve,reject) =>{
        setTimeout(function() {
            func();
            resolve();
        }, timer)
    })
}

var step = function() {
    Promise.resolve().then(function(){
        return ligth(3000, red)
    }).then(function() {
        return ligth(2000, green)
    }).then(function(){
        return ligth(1000, yellow)
    }).then(function(){
        step();
    });
}


step();

2.Generator 的自动执行
单个异步任务
var fetch = require('node-fetch');

function* gen(){
    var url = 'https://api.github.com/users/github';
    var result = yield fetch(url);
    console.log(result.bio);
}
为了获得最终的执行结果，你需要这样做：

var g = gen();
var result = g.next();

result.value.then(function(data){
    return data.json();
}).then(function(data){
    g.next(data);
});
首先执行 Generator 函数，获取遍历器对象。

然后使用 next 方法，执行异步任务的第一阶段，即 fetch(url)。

注意，由于 fetch(url) 会返回一个 Promise 对象，所以 result 的值为：

{ value: Promise { <pending> }, done: false }
最后我们为这个 Promise 对象添加一个 then 方法，先将其返回的数据格式化(data.json())，
再调用 g.next，将获得的数据传进去，由此可以执行异步任务的第二阶段，代码执行完毕。

多个异步任务
上节我们只调用了一个接口，那如果我们调用了多个接口，使用了多个 yield，我们岂不是要在 then 函数中不断的嵌套下去……

所以我们来看看执行多个异步任务的情况：

var fetch = require('node-fetch');

function* gen() {
    var r1 = yield fetch('https://api.github.com/users/github');
    var r2 = yield fetch('https://api.github.com/users/github/followers');
    var r3 = yield fetch('https://api.github.com/users/github/repos');

    console.log([r1.bio, r2[0].login, r3[0].full_name].join('\n'));
}

function run(gen) {
    var g = gen();

    function next(data) {
        var result = g.next(data);

        if (result.done) return;

        result.value.then(function(data) {
            return data.json();
        }).then(function(data) {
            next(data);
        });

    }

    next();
}

run(gen);
其中的关键就是 yield 的时候返回一个 Promise 对象，给这个 Promise 对象添加 then 方法，当异步操作成功时执行 then 中的 onFullfilled 函数，
onFullfilled 函数中又去执行 g.next，从而让 Generator 继续执行，然后再返回一个 Promise，再在成功时执行 g.next，然后再返回……


启动器函数
在 run 这个启动器函数中，我们在 then 函数中将数据格式化 data.json()，但在更广泛的情况下，比如 yield 直接跟一个 Promise，而非一个 fetch 函数返回的 Promise，因为没有 json 方法，代码就会报错。所以为了更具备通用性，连同这个例子和启动器，我们修改为：

var fetch = require('node-fetch');

function* gen() {
    var r1 = yield fetch('https://api.github.com/users/github');
    var json1 = yield r1.json();
    var r2 = yield fetch('https://api.github.com/users/github/followers');
    var json2 = yield r2.json();
    var r3 = yield fetch('https://api.github.com/users/github/repos');
    var json3 = yield r3.json();

    console.log([json1.bio, json2[0].login, json3[0].full_name].join('\n'));
}

function run(gen) {
    var g = gen();

    function next(data) {
        var result = g.next(data);

        if (result.done) return;

        result.value.then(function(data) {
            next(data);
        });

    }

    next();
}

run(gen);
只要 yield 后跟着一个 Promise 对象，我们就可以利用这个 run 函数将 Generator 函数自动执行。


3.async
//使用generator
var fetch = require('node-fetch')
var co = require('co');

function* gen(){
    var r1 = yield fetch('https://api.github.com/users/github');
    var josn1 = yield r1.join();
    console.log(json1.bio);
}

co(gen);

async
var fetch = require('node-fetch');
var fetchDate = async function() {
    var r1 = await fetch('https://api.github.com/users/github');
    var json1 = await r.json1();
    console.warn(json1.bio);
}
fetchDate();

使用 async 会比使用 Promise 更优雅的处理异步流程。
/**
 * 示例三
 */
function fetch() {
  return (
    fetchData()
    .then(value1 => {
      return fetchMoreData(value1)
    })
    .then(value2 => {
      return fetchMoreData2(value2)
    })
  )
}

async function fetch() {
  const value1 = await fetchData()
  const value2 = await fetchMoreData(value1)
  return fetchMoreData2(value2)
};


2. 错误处理
function fetch() {
  try {
    fetchData()
      .then(result => {
        const data = JSON.parse(result)
      })
      .catch((err) => {
        console.log(err)
      })
  } catch (err) {
    console.log(err)
  }
}
在这段代码中，try/catch 能捕获 fetchData() 中的一些 Promise 构造错误，但是不能捕获 JSON.parse 抛出的异常，如果要处理 JSON.parse 抛出的异常，需要添加 catch 函数重复一遍异常处理的逻辑。

在实际项目中，错误处理逻辑可能会很复杂，这会导致冗余的代码。

async function fetch() {
  try {
    const data = JSON.parse(await fetchData())
  } catch (err) {
    console.log(err)
  }
};


并发执行 async 函数
async function handleList() {
  const listPromise = await getList();
  // ...
  await submit(listData);
}

async function handleAnotherList() {
  const anotherListPromise = await getAnotherList()
  // ...
  await submit(anotherListData)
}

// 方法一
(async () => {
  const handleListPromise = handleList()
  const handleAnotherListPromise = handleAnotherList()
  await handleListPromise
  await handleAnotherListPromise
})()

// 方法二
(async () => {
  Promise.all([handleList(), handleAnotherList()]).then()
})()

给定一个 URL 数组，如何实现接口的继发和并发？
// 继发一
async function loadData() {
  var res1 = await fetch(url1);
  var res2 = await fetch(url2);
  var res3 = await fetch(url3);
  return "whew all done";
}
/ 继发二
async function loadData(urls) {
  for (const url of urls) {
    const response = await fetch(url);
    console.log(await response.text());
  }
}
// 并发一
async function loadData() {
  var res = await Promise.all([fetch(url1), fetch(url2), fetch(url3)]);
  return "whew all done";
}
// 并发二
async function loadData(urls) {
  // 并发读取 url
  const textPromises = urls.map(async url => {
    const response = await fetch(url);
    return response.text();
  });

  // 按次序输出
  for (const textPromise of textPromises) {
    console.log(await textPromise);
  }
}

async 会取代 Generator 吗？
Generator 本来是用作生成器，使用 Generator 处理异步请求只是一个比较 hack 的用法，在异步方面，async 可以取代 Generator，但是 async 和 Generator 两个语法本身是用来解决不同的问题的。

async 会取代 Promise 吗？
async 函数返回一个 Promise 对象
面对复杂的异步流程，Promise 提供的 all 和 race 会更加好用
Promise 本身是一个对象，所以可以在代码中任意传递
async 的支持率还很低，即使有 Babel，编译后也要增加 1000 行左右。


异步处理实战
API 介绍
为了实现这个功能，我们需要用到几个 Nodejs 的 API，所以我们来简单介绍一下。

fs.readdir
readdir 方法用于读取目录，返回一个包含文件和目录的数组。

fs.stat
stat 方法的参数是一个文件或目录，它产生一个对象，该对象包含了该文件或目录的具体信息。此外，该对象还有一个 isFile() 方法可以判断正在处理的到底是一个文件，还是一个目录。
思路分析
我们基本的实现思路就是：

用 fs.readdir 获取指定目录的内容信息
循环遍历内容信息，使用 fs.stat 获取该文件或者目录的具体信息
将具体信息储存起来
当全部储存起来后，筛选其中的是文件的信息
遍历比较，找出最大文件
获取并返回最大文件

回调函数
var fs = require('fs');
var path = require('path');

function findLargest(dir, cb) {
    fs.readdir(dir, function(er, files) {
        if(er) return cb(er);
        var counter = files.length;
        var errored = false;
        var stats = [];
        files.forEach(function(file, index) {
            fs.stat(path.json(dir, file), function(er, stat) {
                if(errored) return;
                if(er) {
                    errored = true;
                    return cb(er);
                }
                stats[index] = stat;

                if(counter == 0) {
                    var largest = stats.filter(function(stat) { return stat.isFile()})
                    .reduce(function(pre, next) {
                        if(pre.size > next.size) return pre
                        return next;
                    })
                    cb(null, files[stats.indexOf(largest)])
                }
            })
        })
    })
}

// 查找当前目录最大的文件
findLargest('./', function(er, filename) {
    if (er) return console.error(er)
    console.log('largest file was:', filename)
});

promise
var fs = require('fs');
var path = require('path')
var readdir = function(dir) {
    return new Promise(function(resolve, reject) {
        fs.readdir(dir, function (err, files) {
            if(err) reject(err);
            resolve(files)
        });
    })
}

var stat = function (path) {
    return new Promise(function (resolve, rejext) {
        fs.stat(stat, function(err, stat) {
            if(err) reject(err)
            resolve(stat)
        })  
    })
}

function findLargest(dir) {
    return readdir(fir).then(function (files) {
        let promises = files.map(file => stat(path.join(dir, file)))
        return Promise.all(promise).then(function(stats) {
            return {stats, files }
        })
        
    }).then(data =>{
        let largest = data.stats
        .filter(function(stats) { return stat.isFile() })
        .reduce((prev, next) =>{
            if(prev.size >next.size) return prev;
            return next;
        })
        return data.files[data.stats.indexOf(largest)]
    })
    
}


使用方式为：

findLargest('./')
.then(function(filename) {
    console.log('largest file was:', filename);
})
.catch(function() {
    console.log(error);
});
Generator
var fs = require('fs');
var path = require('path');

var co = require('co')

var readDir = function(dir) {
    return new Promise(function(resolve, reject) {
        fs.readdir(dir, function(err, files) {
            if (err) reject(err);
            resolve(files)
        })
    })
}

var stat = function(path) {
    return new Promise(function(resolve, reject) {
        fs.stat(path, function(err, stat) {
            if (err) reject(err)
            resolve(stat)
        })
    })
}

function* findLargest(dir) {
    var files = yield readDir(dir);
    var stats = yield files.map(function(file) {
        return stat(path.join(dir, file))
    })

    let largest = stats
        .filter(function(stat) { return stat.isFile() })
        .reduce((prev, next) => {
            if (prev.size > next.size) return prev
            return next
        })

    return files[stats.indexOf(largest)]

}
使用方式为：

co(findLargest, './')
.then(function(filename) {
    console.log('largest file was:', filename);
})
.catch(function() {
    console.log(error);
});
Async
var fs = require('fs');
var path = require('path');

var readDir = function(dir) {
    return new Promise(function(resolve, reject) {
        fs.readdir(dir, function(err, files) {
            if (err) reject(err);
            resolve(files)
        })
    })
}

var stat = function(path) {
    return new Promise(function(resolve, reject) {
        fs.stat(path, function(err, stat) {
            if (err) reject(err)
            resolve(stat)
        })
    })
}

async function findLargest(dir) {
    var files = await readDir(dir);

    let promises = files.map(file => stat(path.join(dir, file)))
    var stats = await Promise.all(promises)

    let largest = stats
        .filter(function(stat) { return stat.isFile() })
        .reduce((prev, next) => {
            if (prev.size > next.size) return prev
            return next
        })

    return files[stats.indexOf(largest)]

}
使用方式为：

findLargest('./')
.then(function(filename) {
    console.log('largest file was:', filename);
})
.catch(function() {
    console.log(error);
});