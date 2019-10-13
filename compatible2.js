由于浏览器种类众多，不同的浏览器其内核亦不尽相同，故各个浏览器对网页的解析有一定出入，这也是导致浏览器兼容问题出现的主要原因，我们的网页需要在主流浏览器上正常运行，就需要做好浏览器兼容。

使用Trident内核的浏览器：IE、Maxthon、TT；
使用Gecko内核的浏览器：Netcape6及以上版本、FireFox；
使用Presto内核的浏览器：Opera7及以上版本；
使用Webkit内核的浏览器：Safari、Chrome。


在说的兼容性问题，主要是说IE与几个主流浏览器如firefox，google等。而对IE浏览器来说，IE7又是个跨度，因为之前的版本更新甚慢，bug甚多。从IE8开始，IE浏览器渐渐遵循标准，到IE9后由于大家都一致认为标准很重要，可以说在兼容性上比较好，但在中国来说，由于xp的占有率问题，使用IE7以下的用户仍然很多，所以不得不考虑低版本浏览器的兼容。

对浏览器兼容问题，一般分，HTML，Javascript兼容，CSS兼容。 其中html相关问题较容易处理，无非是高版本浏览器用了低版本浏览器无法识别的元素，致其不能解析，所以平时注意一点。特别是HTML5增加了许多新标签，低版本浏览器有点影响时代进步啊

问题一：不同浏览器的标签默认的外补丁和内补丁不同

问题症状：随便写几个标签，不加样式控制的情况下，各自的margin 和padding差异较大。
碰到频率: 100%
解决方案：css里 *{margin:0;padding:0;}
备注：这个是最常见的也是最易解决的一个浏览器兼容性问题，几乎所有的css文件开头都会用通配符*来设置各个标签的内外补丁是0。

问题二：块属性标签float后，又有横行的margin情况下，在ie6显示margin比设置的大

问题症状:常见症状是ie6中后面的一块被顶到下一行
碰到频率：90%（稍微复杂点的页面都会碰到，float布局最常见的浏览器兼容问题）
解决方案：在float的标签样式控制中加入 display:inline;将其转化为行内属性
备注：我们最常用的就是div+css布局了，而div就是个典型的块属性标签，横向布局的时候我们通常都是用div float实现的，横向的间距设置如果用margin实现，这是个必然会碰到的兼容性问题。

问题三：设置较小高度标签（一般小于10px），在ie6，ie7，遨游中高度超出自己设置高度

问题症状：ie6、7和遨游里这个标签的高度不受控制，超出自己设置的高度
碰到频率：60%
解决方案：给超出高度的标签设置overflow:hidden;或者设置行高line-height 小于你设置的高度。
备注：这一般出现在我们设置小圆角背景的标签里。出现这个问题的原因是ie8之前的浏览器都会给标签一个最小默认的行高的高度。即使你的标签是空的，这个标签的高度还是会达到默认的行高。

问题四：行内属性标签，设置display:block后采用float布局，又有横行的margin的情况，ie6间距bug（类似第二种）

问题症状：ie6里的间距比超过设置的间距
碰到几率：20%
解决方案：在display:block;后面加入display:inline;display:table;
备注：行内属性标签，为设置宽高，我们需要设置display:block;(除input标签比较特殊)。在用float布局并有横向的margin后，在ie6下，他就具有了块属性float后的横向margin的bug。不过因它本身就是行内属性标签，所以我们再加上display:inline的话，它的高宽就不可设了。这时候我们还需要在display:inline后面加入display:talbe。

问题五：图片默认有间距

问题症状：几个img标签放在一起的时候，有些浏览器会有默认的间距，加上问题一中提到的通配符也不起作用。
碰到几率：20%
解决方案：使用float属性为img布局
备注：因img标签是行内属性标签，所以只要不超出容器宽度，img标签都会排在一行里，但是部分浏览器的img标签之间会有个间距。去掉这个间距使用float是王道

问题六：标签最低高度设置min-height不兼容

问题症状：因为min-height本身就是一个不兼容的css属性，所以设置min-height时不能很好的被各个浏览器兼容
碰到几率：5%
解决方案：如果我们要设置一个标签的最小高度200px，需要进行的设置为：{min-height:200px; height:auto !important; height:200px; overflow:visible;}
备注：在B/S系统前端开时，有很多情况下我们有这种需求。当内容小于一个值（如300px）时。容器高度为300px；当内容高度大于这个值时，容器高度被撑高，而不是出现滚动条。这时候我们就会面临这个兼容性问题。
问题七：透明度的兼容css设置

方法是：每写一小段代码（布局中的一行或者一块）我们都要在不同的浏览器中看是否兼容，当然熟练到一定的程度就没这么麻烦了。建议经常
会碰到兼容性问题的新手使用。很多兼容性问题都是因为浏览器对标签的默认属性解析不同造成的，只要我们稍加设置都能轻松地解决这些兼容
问题。如果我们熟悉标签的默认属性的话，就能很好的理解为什么会出现兼容问题以及怎么去解决这些兼容问题。
1
2
3
技巧一：css hack

使用hack 我可以把浏览器分为3类：ie6 ；ie7和遨游；其他（ie8 chrome ff safari opera等）

ie6认识的hack 是下划线_ 和星号 *
ie7 遨游认识的hack是星号 * （包括上面问题6中的 !important也算是hack的一种。不过实用性较小。）
比如这样一个css设置 height:300px;*height:200px;_height:100px;
ie6浏览器在读到 height:300px的时候会认为高时300px；继续往下读，他也认识*heihgt， 所以当ie6读到*height:200px的时候会覆盖掉
前一条的相冲突设置，认为高度是200px。继续往下读，ie6还认识_height,所以他又会覆盖掉200px高的设置，把高度设置为100px；
ie7和遨游也是一样的从高度300px的设置往下读。当它们读到*height200px的时候就停下了，因为它们不认识_height。所以它们会把高度
解析为200px；剩下的浏览器只认识第一个height:300px;所以他们会把高度解析为300px。
1
2
3
4
5
因为优先级相同且相冲突的属性设置后一个会覆盖掉前一个，所以书写的次序是很重要的。

/* CSS属性级Hack */ 
color:red; /* 所有浏览器可识别*/

_color:red; /* 仅IE6 识别 */

*color:red; /* IE6、IE7 识别 */

+color:red; /* IE6、IE7 识别 */

*+color:red; /* IE6、IE7 识别 */

[color:red; /* IE6、IE7 识别 */ 

color:red\9; /* IE6、IE7、IE8、IE9 识别 */

color:red\0; /* IE8、IE9 识别*/

color:red\9\0; /* 仅IE9识别 */

color:red \0; /* 仅IE9识别 */

color:red!important; /* IE6 不识别!important 有危险*/

/* CSS选择符级Hack */ 
*html #demo { color:red;} /* 仅IE6 识别 */

*+html #demo { color:red;} /* 仅IE7 识别 */

body:nth-of-type(1) #demo { color:red;} /* IE9+、FF3.5+、Chrome、Safari、Opera 可以识别 
*/ 
head:first-child+body #demo { color:red; } /* IE7+、FF、Chrome、Safari、Opera 可以识别 */

:root #demo { color:red\9; } : /* 仅IE9识别 */
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
越少的浮动，就会越少的代码，会有更灵活的页面，会有扩展性更强的页面。这不多说，归结为到一定水平了，浮动会用的较少。另外，您也会避免使用浮动+margin的用法。所以，越后来越不易遇到这种bug。

技巧二：padding，marign，height，width

注意是技巧，不是方法： 写好标准头 http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd”> http://www.w3.org/1999/xhtml”> 尽量用padding，慎用margin，height尽量补上100%，父级height有定值子级height不用100%，子级全为浮动时底部补个空clear:both的div宽尽量用margin，慎用padding，width算准实际要的减去padding

技巧三：显示类（display:block,inline）

display:block,inline两个元素

display:block; //可以为内嵌元素模拟为块元素

display:inline; //实现同一行排列的的效果

display:table; //for FF,模拟table的效果
1
2
3
4
5
6
7
display:block块元素，元素的特点是： 总是在新行上开始；高度，行高以及顶和底边距都可控制；宽度缺省是它的容器的100%，除非设定一个宽度

display:inline就是将元素显示为行内元素，元素的特点是：和其他元素都在一行上；高，行高及顶和底边距不可改变；宽度就是它的文字或图片的宽度，不可改变。span，a，label，input，img，strong和em是 inline 元素的例子

技巧四：怎样使一个div层居中于浏览器中？

1）

<style type="text/css">

<!-- div {

position:absolute;

top:50%;

left:50%;

margin:-100px 0 0 -100px;

width:200px;

height:200px;

border:1px solid red; } -->

</style>
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
2）div里的内容，IE默认为居中，而FF默认为左对齐，可以尝试增加代码margin: 0 auto;

技巧五：float的div闭合;清除浮动;自适应高度

① 例如：＜div id="floatA">＜div id="floatB">＜div id="NOTfloatC">

这里的NOTfloatC并不希望继续平移，而是希望往下排。(其中floatA、floatB的属性已经设置为float:left;)
这段代码在IE中毫无问题，问题出在FF。原因是NOTfloatC并非float标签，必须将float标签闭合。在＜divclass="floatB">＜div class="NOTfloatC">之间加上＜div class="clear">这个div一定要注意位置，而且必须与两个具有float属性的div同级，之间不能存在嵌套关系，否则会产生异常。并且将clear这种样式定义为为如下即可：.clear{clear:both;}
②作为外部 wrapper 的 div 不要定死高度,为了让高度能自适应，要在wrapper里面加上overflow:hidden; 当包含float的box的时候，高度自适应在IE下无效，这时候应该触发IE的layout私有属性用zoom:1;可以做到，这样就达到了兼容。
例如某一个wrapper如下定义：

.colwrapper{overflow:hidden; zoom:1; margin:5px auto;}
1
③对于排版,我们用得最多的css描述可能就是float:left.有的时候我们需要在n栏的float div后面做一个统一的背景,譬如:

<div id=”page”>

<div id=”left”>＜/div>
<div id=”center”>＜/div>
<div id=”right”>＜/div>

</div>
1
2
3
4
5
6
7
比如我们要将page的背景设置成蓝色,以达到所有三栏的背景颜色是蓝色的目的,但是我们会发现随着left centerright的向下拉长,而page居然保存高度不变,问题来了,原因在于page不是float属性,而我们的page由于要居中,不能设置成float,所以我们应该这样解决：

<div id=”page”>

<div id=”bg” style=”float:left;width:100%”>

<div id=”left”>＜/div>
<div id=”center”>＜/div>
<div id=”right”>＜/div>

</div>

</div>
1
2
3
4
5
6
7
8
9
10
11
再嵌入一个float left而宽度是100%的DIV解决之。

④万能float 闭合(非常重要!)

将以下代码加入Global CSS 中,给需要闭合的div加上class="clearfix"即可,屡试不爽。

/* Clear Fix */ 
.clearfix:after { content:"."; display:block; height:0; clear:both;visibility:hidden; } 
.clearfix { display:inline-block; } 
/* Hide from IE Mac */ 
.clearfix {display:block;} 
/* End hide from IE Mac */ 
/* end of clearfix */
1
2
3
4
5
6
7
或者这样设置：.hackbox{display:table; //将对象作为块元素级的表格显示}

技巧六：div嵌套时 y轴上 padding和 marign的问题

FF里 y 轴上 子div 到 父div 的距离为 父padding + 子marign
IE里 y 轴上 子div 到 父div 的距离为 父padding和 子marign里大的一个
FF里 y 轴上 父padding=0 且 border=0 时，子div 到 父div 的距离为0，子marign 作用到 父div 外面
**技巧七：父级盒子的BFC **

marign 重合问题： 当两个垂直边界相遇时，它们将形成一个边界。这个边界的高度等于两个发生叠加的边界的高度中的较大者。总的有以下解决方式：

外层 padding
透明边框 border:1px solid transparent;
.绝对定位 postion:absolute:
外层DIV overflow:hidden;
内层DIV　加 float:left;display:inline;
外层DIV 有时会用到zoom:1;
