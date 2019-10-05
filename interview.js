// 1.href和src区别
// href
// href标识超文本引用，用在link和a等元素上，href是引用和页面关联，是在当前元素和引用资源之间建立联系
// 若在文档中添加href ，浏览器会识别该文档为 CSS 文件，就会并行下载资源并且不会停止对当前文档的处理。这也是为什么建议使用 link 方式加载 CSS，而不是使用 @import 方式。
// src
// src表示引用资源，替换当前元素，用在img，script，iframe上，src是页面内容不可缺少的一部分。
// 当浏览器解析到src ，会暂停其他资源的下载和处理（图片不会暂停其他资源下载），直到将该资源加载、编译、执行完毕，类似于将所指向资源应用到当前内容。这也是为什么建议把 js 脚本放在底部而不是头部的原因。

// 2.浏览器的渲染过程
// 解析HTML生成DOM树。
// 解析CSS生成CSSOM规则树。
// 将DOM树与CSSOM规则树合并在一起生成渲染树。
// 遍历渲染树开始布局，计算每个节点的位置大小信息。
// 将渲染树每个节点绘制到屏幕。

// 3.处理兼容问题的思路
// 要不要做
// 产品的角度（产品的受众、受众的浏览器比例、效果优先还是基本功能优先）
// 成本的角度 (有无必要做某件事)
// 做到什么程度 * 让哪些浏览器支持哪些效果
// 如何做 根据兼容需求选择技术框架/库(jquery) 根据兼容需求选择兼容工具(html5shiv.js、respond.js、css reset、normalize.css、Modernizr) * 条件注释、CSS Hack、js 能力检测做一些修补


// 4.行内元素和块级元素有哪些
// 行内元素
// 一个行内元素只占据它对应标签的边框所包含的空间
// 一般情况下，行内元素只能包含数据和其他行内元素

// b, big, i, small, tt
// abbr, acronym, cite, code, dfn, em, kbd, strong, samp, var
// a, bdo, br, img, map, object, q, script, span, sub, sup
// button, input, label, select, textarea
// 块级元素
// 占据一整行，高度、行高、内边距和外边距都可以改变，可以容纳块级标签和其他行内标签

// header,form,ul,ol,table,article,div,hr,aside,figure,canvas,video,audio,footer


// 5.重置（resetting）CSS 和 标准化（normalizing）CSS 的区别是什么？你会选择哪种方式，为什么？
// 重置（Resetting）： 重置意味着除去所有的浏览器默认样式。对于页面所有的元素，像margin、padding、font-size这些样式全部置成一样。你将必须重新定义各种元素的样式。
// 标准化（Normalizing）： 标准化没有去掉所有的默认样式，而是保留了有用的一部分，同时还纠正了一些常见错误。
// 当需要实现非常个性化的网页设计时，我会选择重置的方式，因为我要写很多自定义的样式以满足设计需求，这时候就不再需要标准化的默认样式了。

// 6.有哪些清除浮动的技术，都适用哪些情况？
// 空div方法：<div style="clear:both;"></div>。
// Clearfix 方法：上文使用.clearfix类已经提到。
// overflow: auto或overflow: hidden方法：上文已经提到。


// 6.请解释什么是雪碧图（css sprites），以及如何实现？
// 雪碧图是把多张图片整合到一张上的图片。它被运用在众多使用了很多小图标的网站上（Gmail 在使用）。实现方法：
// 使用生成器将多张图片打包成一张雪碧图，并为其生成合适的 CSS。
// 每张图片都有相应的 CSS 类，该类定义了background-image、background-position和background-size属性。
// 使用图片时，将相应的类添加到你的元素中。
// 好处：
// 减少加载多张图片的 HTTP 请求数（一张雪碧图只需要一个请求）。但是对于 HTTP2 而言，加载多张图片不再是问题。
// 提前加载资源，防止在需要时才在开始下载引发的问题，比如只出现在:hover伪类中的图片，不会出现闪烁。



// 7.使用 CSS 预处理的优缺点分别是什么？
// 优点：

// 提高 CSS 可维护性。
// 易于编写嵌套选择器。
// 引入变量，增添主题功能。可以在不同的项目中共享主题文件。
// 通过混合（Mixins）生成重复的 CSS。
// Splitting your code into multiple files. CSS files can be split up too but doing so will require a HTTP request to download each CSS file.
// 将代码分割成多个文件。不进行预处理的 CSS，虽然也可以分割成多个文件，但需要建立多个 HTTP 请求加载这些文件。
// 缺点：
// 需要预处理工具。
// 重新编译的时间可能会很慢。
// 对于你使用过的 CSS 预处理，说说喜欢和不喜欢的地方？
// 喜欢：
// 绝大部分优点上题以及提过。
// Less 用 JavaScript 实现，与 NodeJS 高度结合。



// 8.display的属性值都有哪些？
// none, block, inline, inline-block, table, table-row, table-cell, list-item.
// inline和inline-block有什么区别？



