		
            3.偏函数
			在计算机科学中，局部应用是指固定一个函数的一些参数，然后产生另一个更小元的函数。
			
			什么是元？元是指函数参数的个数，比如一个带有两个参数的函数被称为二元函数。
			function add(a, b) {
			    return a + b;
			}
			
			// 执行 add 函数，一次传入两个参数即可
			add(1, 2) // 3
			
			// 假设有一个 partial 函数可以做到局部应用
			var addOne = partial(add, 1);
			
			addOne(2) // 3
			柯里化是将一个多参数函数转换成多个单参数函数，也就是将一个 n 元函数转换成 n 个一元函数。
			
			局部应用则是固定一个函数的一个或者多个参数，也就是将一个 n 元函数转换成一个 n - x 元函数。
			
			
			partial
			
			我们来写个 demo 验证下 this 的指向：
			
			function add(a, b) {
			    return a + b + this.value;
			}
			
			// var addOne = add.bind(null, 1);
			var addOne = partial(add, 1);
			
			var value = 1;
			var obj = {
			    value: 2,
			    addOne: addOne
			}
			obj.addOne(2); // ???
			// 使用 bind 时，结果为 4
			// 使用 partial 时，结果为 5
			第二版
			然而正如 curry 函数可以使用占位符一样，我们希望 partial 函数也可以实现这个功能，我们再来写第二版：
			
			// 第二版
			var _ = {};
			
			function partial(fn) {
			    var args = [].slice.call(arguments, 1);
			    return function() {
			        var position = 0, len = args.length;
			        for(var i = 0; i < len; i++) {
			            args[i] = args[i] === _ ? arguments[position++] : args[i]
			        }
			        while(position < arguments.length) args.push(argumetns[position++]);
			        return fn.apply(this, args);
			    };
			};
			我们验证一下：
			
			var subtract = function(a, b) { return b - a; };
			subFrom20 = partial(subtract, _, 20);
			subFrom20(5);
			写在最后
			值得注意的是：underscore 和 lodash 都提供了 partial 函数，但只有 lodash 提供了 curry 函数。
			
			我们现在需要写一个 foo 函数，这个函数返回首次调用时的 Date 对象，注意是首次。
			
			解决一：普通方法
			var t;
			function foo() {
			    if (t) return t;
			    t = new Date()
			    return t;
			}
			问题有两个，一是污染了全局变量，二是每次调用 foo 的时候都需要进行一次判断。
			
			解决二：闭包
			我们很容易想到用闭包避免污染全局变量。
			
			var foo = (function() {
			    var t;
			    return function() {
			        if (t) return t;
			        t = new Date();
			        return t;
			    }
			})();
			然而还是没有解决调用时都必须进行一次判断的问题。
			
			解决三：函数对象
			函数也是一种对象，利用这个特性，我们也可以解决这个问题。
			
			function foo() {
			    if (foo.t) return foo.t;
			    foo.t = new Date();
			    return foo.t;
			}
			依旧没有解决调用时都必须进行一次判断的问题。
			
			解决四：惰性函数
			不错，惰性函数就是解决每次都要进行判断的这个问题，解决原理很简单，重写函数。
			
			var foo = function() {
			    var t = new Date();
			    foo = function() {
			        return t;
			    };
			    return foo();
			};
			
			
			5.函数记忆
			函数记忆是指将上次的计算结果缓存起来，当下次调用时，如果遇到相同的参数，就直接返回缓存中的数据。
			原理
			实现这样一个 memorize 函数很简单，原理上只用把参数和对应的结果数据存到一个对象中，调用时，判断参数对应的数据是否存在，存在就返回对应的结果数据。
			
			function memorize(f) {
				var cache = {};
				return function() {
					var key = arguments.length + Array.prototype.join.call(arguments, ',');
					if(key in cache) {
						return cache[key]
					} else {
						return cache[key] = f.apply(this, arguments);
					}
				}
			}
			我们来测试一下：
			
			var add = function(a, b, c) {
			  return a + b + c
			}
			
			var memoizedAdd = memorize(add)
			
			console.time('use memorize')
			for(var i = 0; i < 100000; i++) {
			    memoizedAdd(1, 2, 3)
			}
			console.timeEnd('use memorize')
			
			console.time('not use memorize')
			for(var i = 0; i < 100000; i++) {
			    add(1, 2, 3)
			}
			console.timeEnd('not use memorize')
			在 Chrome 中，使用 memorize 大约耗时 60ms，如果我们不使用函数记忆，大约耗时 1.3 ms 左右。
            所以，函数记忆也并不是万能的，你看这个简单的场景，其实并不适合用函数记忆。
            




            6.递归
			程序调用自身的编程技巧称为递归(recursion)。
			
			以阶乘为例：
			
			function factorial(n) {
			    if (n == 1) return n;
			    return n * factorial(n - 1)
			}
			
			console.log(factorial(5)) // 5 * 4 * 3 * 2 * 1 = 120
			
			斐波那契数列
			在《JavaScript专题之函数记忆》中讲到过的斐波那契数列也使用了递归：
			
			function fibonacci(n){
			    return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
			}
			
			console.log(fibonacci(5)) // 1 1 2 3 5
			
			递归条件
			从这两个例子中，我们可以看出：
			
			构成递归需具备边界条件、递归前进段和递归返回段，当边界条件不满足时，递归前进，当边界条件满足时，递归返回。阶乘中的 n == 1 和 斐波那契数列中的 n < 2 都是边界条件。
			
			总结一下递归的特点：
			
			子问题须与原始问题为同样的事，且更为简单；
			
			不能无限制地调用本身，须有个出口，化简为非递归状况处理。
			
			尾调用，是指函数内部的最后一个动作是函数调用。该调用的返回值，直接返回给函数。
			
			也就说尾调用函数执行时，虽然也调用了一个函数，但是因为原来的的函数执行完毕，执行上下文会被弹出，执行上下文栈中相当于只多压入了一个执行上下文。然而非尾调用函数，就会创建多个执行上下文压入执行上下文栈。
			
			函数调用自身，称为递归。如果尾调用自身，就称为尾递归。
			
			阶乘函数优化
			我们需要做的就是把所有用到的内部变量改写成函数的参数，以阶乘函数为例：
			
			function factorial(n, res) {
			    if (n == 1) return res;
			    return factorial2(n - 1, n * res)
			}
			
            console.log(factorial(4, 1)) // 24
            
            我们已经跟着 underscore 写了 debounce、throttle、unique、isElement、flatten、findIndex、
			findLastIndex、sortedIndex、indexOf、lastIndexOf、eq、partial、compose、memorize 共 14 个功能函数，
			跟着 jQuery 写了 type、isArray、isFunction、isPlainObject、isWindow、isArrayLike、
			extend、each 共 8 个功能函数，自己实现了 shallowCopy、deepCopy、curry、shuffle 共 4 个功能函数
			，加起来共有 26 个功能函数