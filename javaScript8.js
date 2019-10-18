从promise、process.nextTick、setTimeout出发，谈谈Event Loop中的Job queue #5
 Open	forthealllight opened this issue May 18, 2018 · 2 comments
Comments
@forthealllight
Owner
forthealllight commented May 18, 2018 • 
edited 
简要介绍：谈谈promise.resove,setTimeout,setImmediate,process.nextTick在EvenLoop队列中的执行顺序

1. 问题的引出

event loop都不陌生，是指主线程从“任务队列”中循环读取任务，比如

例1：

setTimeout(function(){console.log(1)},0);

console.log(2)

//输出2,1
在上述的例子中，我们明白首先执行主线程中的同步任务，当主线程任务执行完毕后，再从event loop中读取任务，因此先输出2，再输出1。

event loop读取任务的先后顺序，取决于任务队列（Job queue）中对于不同任务读取规则的限定。比如下面一个例子：

例2：

setTimeout(function () {
  console.log(3);
}, 0);

Promise.resolve().then(function () {
  console.log(2);
});
console.log(1);
//输出为  1  2 3
先输出1，没有问题，因为是同步任务在主线程中优先执行，这里的问题是setTimeout和Promise.then任务的执行优先级是如何定义的。

2 . Job queue中的执行顺序

在Job queue中的队列分为两种类型：macro-task和microTask。我们举例来看执行顺序的规定，我们设

macro-task队列包含任务: a1, a2 , a3
micro-task队列包含任务: b1, b2 , b3

执行顺序为，首先执行marco-task队列开头的任务，也就是 a1 任务，执行完毕后，在执行micro-task队列里的所有任务，也就是依次执行b1, b2 , b3，执行完后清空micro-task中的任务，接着执行marco-task中的第二个任务，依次循环。

了解完了macro-task和micro-task两种队列的执行顺序之后，我们接着来看，真实场景下这两种类型的队列里真正包含的任务（我们以node V8引擎为例），在node V8中，这两种类型的真实任务顺序如下所示：

macro-task队列真实包含任务：

script(主程序代码),setTimeout, setInterval, setImmediate, I/O, UI rendering

micro-task队列真实包含任务：
process.nextTick, Promises, Object.observe, MutationObserver

由此我们得到的执行顺序应该为：

script(主程序代码)—>process.nextTick—>Promises...——>setTimeout——>setInterval——>setImmediate——> I/O——>UI rendering

在ES6中macro-task队列又称为ScriptJobs，而micro-task又称PromiseJobs

3 . 真实环境中执行顺序的举例

(1) setTimeout和promise

例3:

setTimeout(function () {
  console.log(3);
}, 0);

Promise.resolve().then(function () {
  console.log(2);
});

console.log(1);

我们先以第1小节的例子为例，这里遵循的顺序为：

script(主程序代码)——>promise——>setTimeout
对应的输出依次为：1 ——>2————>3

(2) process.nextTick和promise、setTimeout

例子4：
setTimeout(function(){console.log(1)},0);

new Promise(function(resolve,reject){
   console.log(2);
   resolve();
}).then(function(){console.log(3)
}).then(function(){console.log(4)});

process.nextTick(function(){console.log(5)});

console.log(6);
//输出2,6,5,3,4,1
这个例子就比较复杂了，这里要注意的一点在定义promise的时候，promise构造部分是同步执行的，这样问题就迎刃而解了。

首先分析Job queue的执行顺序：

script(主程序代码)——>process.nextTick——>promise——>setTimeout

I) 主体部分： 定义promise的构造部分是同步的，
因此先输出2 ，主体部分再输出6（同步情况下，就是严格按照定义的先后顺序）

II)process.nextTick: 输出5

III）promise： 这里的promise部分，严格的说其实是promise.then部分，输出的是3,4

IV) setTimeout ： 最后输出1

综合的执行顺序就是： 2——>6——>5——>3——>4——>1

(3)更复杂的例子

setTimeout(function(){console.log(1)},0);

new Promise(function(resolve,reject){
   console.log(2);
   setTimeout(function(){resolve()},0)
}).then(function(){console.log(3)
}).then(function(){console.log(4)});

process.nextTick(function(){console.log(5)});

console.log(6);

//输出的是  2 6 5 1 3 4
这种情况跟我们（2）中的例子，区别在于promise的构造中，没有同步的resolve，因此promise.then在当前的执行队列中是不存在的，只有promise从pending转移到resolve，才会有then方法，而这个resolve是在一个setTimout时间中完成的，因此3,4最后输出。