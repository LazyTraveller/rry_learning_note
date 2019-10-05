// 前端开发知识点：
// HTML&CSS：
//     对Web标准的理解、浏览器内核差异、兼容性、hack、CSS基本功：布局、盒子模型、选择器优先级、
//     HTML5、CSS3、Flexbox
// JavaScript：
//     数据类型、运算、对象、Function、继承、闭包、作用域、原型链、事件、RegExp、JSON、Ajax、
//     DOM、BOM、内存泄漏、跨域、异步装载、模板引擎、前端MVC、路由、模块化、Canvas、ECMAScript 6、Nodejs
// 其他：
//     移动端、响应式、自动化构建、HTTP、离线存储、WEB安全、优化、重构、团队协作、可维护、易用性、SEO、UED、架构、职业生涯、快速

//1.行内元素有哪些？块级元素有哪些？ 空(void)元素有那些？
// 首先：CSS规范规定，每个元素都有display属性，确定该元素的类型，每个元素都有默认的display值，如div的display默认值为“block”，
// 则为“块级”元素；span默认display属性值为“inline”，是“行内”元素。
// (1)行内元素有: a b span img input select strong
// (2)块级元素有: div ul ol li dl dt dd h1 h2 h3 h4 p
// 3）常见的空元素：
    // <br> <hr> <img> <input> <link> <meta></meta>

// 2.页面导入样式时，使用link和@import有什么区别？
// （1）link属于XHTML标签，除了加载CSS外，还能用于定义RSS, 定义rel连接属性等作用；而@import是CSS提供的，只能用于加载CSS;
// （2）页面被加载的时，link会同时被加载，而@import引用的CSS会等到页面被加载完再加载;
 // （3）import是CSS2.1 提出的，只在IE5以上才能被识别，而link是XHTML标签，无兼容问题;


// 3.介绍一下你对浏览器内核的理解？

// 主要分成两部分：渲染引擎(layout engineer或Rendering Engine)和JS引擎。
// 渲染引擎：负责取得网页的内容（HTML、XML、图像等等）、整理讯息（例如加入CSS等），以及计算网页的显示方式，
// 然后会输出至显示器或打印机。
// 浏览器的内核的不同对于网页的语法解释会有不同，所以渲染的效果也不相同。所有网页浏览器、
// 电子邮件客户端以及其它需要编辑、显示网络内容的应用程序都需要内核。
// JS引擎则：解析和执行javascript来实现网页的动态效果。

//4.常见的浏览器内核有哪些？
// Trident内核：IE,MaxThon,TT,The World,360,搜狗浏览器等。[又称MSHTML]
// Gecko内核：Netscape6及以上版本，FF,MozillaSuite/SeaMonkey等
// Presto内核：Opera7及以上。      [Opera内核原为：Presto，现为：Blink;]
// Webkit内核：Safari,Chrome等。   [ Chrome的：Blink（WebKit的分支）]

// 5.html5有哪些新特性、移除了那些元素？如何处理HTML5新标签的浏览器兼容问题？如何区分 HTML 和 HTML5？
// HTML5 现在已经不是 SGML 的子集，主要是关于图像，位置，存储，多任务等功能的增加。
// 绘画 canvas;
// 用于媒介回放的 video 和 audio 元素;
// 本地离线存储 localStorage 长期存储数据，浏览器关闭后数据不丢失;
// sessionStorage 的数据在浏览器关闭后自动删除;
// 语意化更好的内容元素，比如 article、footer、header、nav、section;
// 表单控件，calendar、date、time、email、url、search;
// 新的技术webworker, websocket, Geolocation;

// 移除的元素：
// 纯表现的元素：basefont，big，center，font, s，strike，tt，u;
// 对可用性产生负面影响的元素：frame，frameset，noframes；

// * 支持HTML5新标签：
// IE8/IE7/IE6支持通过document.createElement方法产生的标签，
// 可以利用这一特性让这些浏览器支持HTML5新标签，
// 浏览器支持新标签后，还需要添加标签默认的样式。

// 当然也可以直接使用成熟的框架、比如html5shim;
// <!--[if lt IE 9]>
//   <script> src="http://html5shim.googlecode.com/svn/trunk/html5.js"</script>
// <![endif]-->

// * 如何区分HTML5： DOCTYPE声明\新增的结构元素\功能元素


// 6.简述一下你对HTML语义化的理解？
// 用正确的标签做正确的事情。
// html语义化让页面的内容结构化，结构更清晰，便于对浏览器、搜索引擎解析;
// 即使在没有样式CSS情况下也以一种文档格式显示，并且是容易阅读的;
// 搜索引擎的爬虫也依赖于HTML标记来确定上下文和各个关键字的权重，利于SEO;
// 使阅读源代码的人对网站更容易将网站分块，便于阅读维护理解。


// 7.HTML5的离线储存怎么使用，工作原理能不能解释一下？
// 在用户没有与因特网连接时，可以正常访问站点或应用，在用户与因特网连接时，更新用户机器上的缓存文件。
// 原理：HTML5的离线存储是基于一个新建的.appcache文件的缓存机制(不是存储技术)，
// 通过这个文件上的解析清单离线存储资源，这些资源就会像cookie一样被存储了下来。之后当网络在处于离线状态下时，
// 浏览器会通过被离线存储的数据进行页面展示。

// 如何使用：
// 1、页面头部像下面一样加入一个manifest的属性；
// 2、在cache.manifest文件的编写离线存储的资源；
//     CACHE MANIFEST
//     #v0.11
//     CACHE:
//     js/app.js
//     css/style.css
//     NETWORK:
//     resourse/logo.png
//     FALLBACK:
//     / /offline.html
// 3、在离线状态时，操作window.applicationCache进行需求实现。


// 浏览器是怎么对HTML5的离线储存资源进行管理和加载的呢？

// // 在线的情况下，浏览器发现html头部有manifest属性，它会请求manifest文件，如果是第一次访问app，
// 那么浏览器就会根据manifest文件的内容下载相应的资源并且进行离线存储。如果已经访问过app并且资源已经离线存储了
// ，那么浏览器就会使用离线的资源加载页面，然后浏览器会对比新的manifest文件与旧的manifest文件
// ，如果文件没有发生改变，就不做任何操作，如果文件改变了，那么就会重新下载文件中的资源并进行离线存储。
// // 离线的情况下，浏览器就直接使用离线存储的资源。



// 8.请描述一下 cookies，sessionStorage 和 localStorage 的区别？
// cookie是网站为了标示用户身份而储存在用户本地终端（Client Side）上的数据（通常经过加密）。
// cookie数据始终在同源的http请求中携带（即使不需要），记会在浏览器和服务器间来回传递。
// sessionStorage和localStorage不会自动把数据发给服务器，仅在本地保存。
// 存储大小：
//     cookie数据大小不能超过4k。
//     sessionStorage和localStorage 虽然也有存储大小的限制，但比cookie大得多，可以达到5M或更大。
// 有期时间：
//     localStorage    存储持久数据，浏览器关闭后数据不丢失除非主动删除数据；
//     sessionStorage  数据在当前浏览器窗口关闭后自动删除。
//     cookie          设置的cookie过期时间之前一直有效，即使窗口或浏览器关闭


// 9.网页验证码是干嘛的，是为了解决什么安全问题。
// 区分用户是计算机还是人的公共全自动程序。可以防止恶意破解密码、刷票、论坛灌水；
// 有效防止黑客对某一个特定注册用户用特定程序暴力破解方式进行不断的登陆尝试。


// 10.title与h1的区别、b与strong的区别、i与em的区别？
// title属性没有明确意义只表示是个标题，H1则表示层次明确的标题，对页面信息的抓取也有很大的影响；
// strong是标明重点内容，有语气加强的含义，使用阅读设备阅读网络时：<strong>会重读，而<B>是展示强调内容。
// i内容展示为斜体，em表示强调的文本；

// 10. 谈谈你对MVVM开发模式的理解
// MVVM分为Model、View、ViewModel三者。
// Model 代表数据模型，数据和业务逻辑都在Model层中定义；
// View 代表UI视图，负责数据的展示；
// ViewModel 负责监听 Model 中数据的改变并且控制视图的更新，处理用户交互操作；
// Model 和 View 并无直接关联，而是通过 ViewModel 来进行联系的，Model 和 ViewModel 
// 之间有着双向数据绑定的联系。因此当 Model 中的数据改变时会触发 View 层的刷新，View 
// 中由于用户交互操作而改变的数据也会在 Model 中同步。
// // 这种模式实现了 Model 和 View 的数据自动同步，因此开发者只需要专注对数据的维护操作即可，
// 而不需要自己操作 dom。

// 11.v-if 和 v-show 有什么区别？
// v-show 仅仅控制元素的显示方式，将 display 属性在 block 和 none 来回切换；而v-if会控制这个 DOM 节点的存在与否。
// 当我们需要经常切换某个元素的显示/隐藏时，使用v-show会更加节省性能上的开销；当只需要一次显示或隐藏时，使用v-if更加合理。

// 12.简述Vue的响应式原理
// 当一个Vue实例创建时，vue会遍历data选项的属性，用 Object.defineProperty 将它们转为 getter/setter并且在内部追踪相关依赖，在属性被访问和修改时通知变化。
// 每个组件实例都有相应的 watcher 程序实例，它会在组件渲染的过程中把属性记录为依赖，之后当依赖项的 setter 被调用时，会通知 watcher 重新计算，从而致使它关联的组件得以更新。

// 13. delete和Vue.delete删除数组的区别
// delete只是被删除的元素变成了 empty/undefined 其他的元素的键值还是不变。
// Vue.delete直接删除了数组 改变了数组的键值。

var a=[1,2,3,4]
    var b=[1,2,3,4]
    delete a[1]
    console.log(a)
    this.$delete(b,1)
    console.log(b)

// 14.如何优化SPA应用的首屏加载速度慢的问题？
// 将公用的JS库通过script标签外部引入，减小app.bundel的大小，让浏览器并行下载资源文件，提高下载速度；
// 在配置 路由时，页面和组件使用懒加载的方式引入，进一步缩小 app.bundel 的体积，在调用某个组件时再加载对应的js文件；
// 加一个首屏 loading 图，提升用户体验；

// 15. 前端如何优化网站性能？
// 减少 HTTP 请求数量
// 合并 CSS 和 JS 文件:CSS Sprites：国内俗称 CSS 精灵，这是将多张图片合并成一张图片达到减少 HTTP 请求的一种解决方案，可以通过 CSS background 属性来访问图片内容。
// 采用 lazyLoad：俗称懒加载，可以控制网页上的内容在一开始无需加载，不需要发请求，等到用户操作真正需要的时候立即加载出内容。
// CSS Sprites：国内俗称 CSS 精灵，这是将多张图片合并成一张图片达到减少 HTTP 请求的一种解决方案，可以通过 CSS background 属性来访问图片内容。
// 控制资源文件加载优先级
// 浏览器在加载 HTML 内容时，是将 HTML 内容从上至下依次解析，解析到 link 或者 script 标签就会加载 href 或者 src 对应链接内容，为了第一时间展示页面给用户，就需要将 CSS 提前加载，不要受 JS 加载影响。
// 一般情况下都是 CSS 在头部，JS 在底部。

// 利用浏览器缓存
// 浏览器缓存是将网络资源存储在本地，等待下次请求该资源时，如果资源已经存在就不需要到服务器重新请求该资源，直接在本地读取该资源。
// 减少重排（Reflow）
// 基本原理：重排是 DOM 的变化影响到了元素的几何属性（宽和高），浏览器会重新计算元素的几何属性，会使渲染树中受到影响的部分失效，浏览器会验证 DOM 树上的所有其它结点的 visibility 属性，
// 这也是 Reflow 低效的原因。如果 Reflow 的过于频繁，CPU 使用率就会急剧上升


// 16.重绘与回流

// 重绘(repaint): 当元素样式的改变不影响布局时，浏览器将使用重绘对元素进行更新，此时由于只需要UI层面的重新像素绘制，因此 损耗较少
// 回流(reflow): 当元素的尺寸、结构或触发某些属性时，浏览器会重新渲染页面，称为回流。此时，浏览器需要重新经过计算，计算后还需要重新页面布局，因此是较重的操作。会触发回流的操作:
// * 页面初次渲染
// * 浏览器窗口大小改变
// * 元素尺寸、位置、内容发生改变
// * 元素字体大小变化
// * 添加或者删除可见的 dom 元素
// * 激活 CSS 伪类（例如：:hover）
// * 查询某些属性或调用某些方法
// * clientWidth、clientHeight、clientTop、clientLeft
// * offsetWidth、offsetHeight、offsetTop、offsetLeft
// * scrollWidth、scrollHeight、scrollTop、scrollLeft
// * getComputedStyle()
// * getBoundingClientRect()
// * scrollTo()
// 回流必定触发重绘，重绘不一定触发回流。重绘的开销较小，回流的代价较高。

