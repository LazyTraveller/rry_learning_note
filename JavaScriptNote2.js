//1.原型链

			//原型到原型链
			//构造函数, new 创建一个实例
			function Person() {
				
			}
			var person = new Person();
			person.name = 'Jerry';
			console.warn(person.name);
			
			Person.prototype.name = 'jerry';
			var person1 = new Person();
			var person2 = new Person();
			console.warn(person1.name);
			console.warn(person2.name);  //输出一样
			//什么事原型？每个JavaScript对象在创建的时候就会与之关联的另一个对象,这个对象就是我们所说的原型
			//每个对象都会从原型继承属性
			
			_proto_//属性指向该对象的原型
			console.warn(person.__proto__ === Person.prototype)
			
			Person //构造函数
			person //实例
			Person.prototype//实例原型
			person.__proto__//指向原型
			
			//既然实例对象和构造函数度可以指向原型,那么原型是否有属性指向构造函数和实例
			
			//指向实例倒是没有，因为一个构造函数可以生成多个实例，但是原型指向构造函数倒是有的，这就要讲到第三个属性：
			//constructor﻿，每个原型都有一个 constructor 属性指向关联的构造函数。
			
			console.warn(Person === Person.prototype.constructor) //true
			
			console.warn(Object.getPrototypeOf(person) === Person.prototype) //true
			Object.getPrototypeOf(person) = Person.prototype
			// 当读取实例的属性时，如果找不到，就会查找与对象关联的原型中的属性，如果还查不到，就去找原型的原型，一直找到最顶层为止。
			Person.prototype.name = 'Merry';
			var person3 = new Person();
			person.name = 'kevin';
			console.warn(person.name) //kevin
			delete person.name;
			console.warn(person.name)//Merry
			
			console.warn(Object.prototype.__proto__ === null) //true
			// 所以查到属性的时候查到 Object.prototype 就可以停止查找了。
			
			Person.prototype.__proto__ = Object.prototype;
	        Object.prototype.constructor = Object
			Object.prototype = 
	
			//这就是原型链
			person.__proto__ = Person.prototype
			Person.prototype.__proto__ = Object.prototype
			Object.prototype.__proto__ = null;
			
			console.warn(person.constructor === Person)//true
			// 当获取 person.constructor 时，其实 person 中并没有 constructor 属性,当不能读取到constructor 属性时，
			// 会从 person 的原型也就是 Person.prototype 中读取，正好原型中有该属性，所以：
	        person.constructor === Person.prototype.constructor ===Person
            
            
//2.作用域  作用域是指程序源代码中定义变量的区域。
			// 静态作用域与动态作用域
			// 因为 JavaScript 采用的是词法作用域，函数的作用域在函数定义的时候就决定了。
			// 而与词法作用域相对的是动态作用域，函数的作用域是在函数调用的时候才决定的。
			var value = 1;
			function foo() {
				console.warn(value);
			}
			
			function bar() {
				var value = 2;
				foo();
			}
			
			bar();
			// 假设JavaScript采用静态作用域，让我们分析下执行过程：
			// 执行 foo 函数，先从 foo 函数内部查找是否有局部变量 value，如果没有，就根据书写的位置，查找上面一层的代码，也就是 value 等于 1，所以结果会打印 1。
			// 假设JavaScript采用动态作用域，让我们分析下执行过程：
			// 执行 foo 函数，依然是从 foo 函数内部查找是否有局部变量 value。如果没有，就从调用函数的作用域，也就是 bar 函数内部查找 value 变量，所以结果会打印 2。
			// 前面我们已经说了，JavaScript采用的是静态作用域，所以这个例子的结果是 1。
			 
			var scope = 'global scope'
			function checkscope() {
				var scope = 'local scope';
				function f() {
					return scope;
				}
				return f();
			}
			checkscope();//local scope
			
		   function checkscope1() {
			   var scope = 'local scope';
			   function f() {
				   return scope;
			   }
			   return f;
		   }
		   checkscope()()//local scope
			// JavaScript 函数的执行用到了作用域链，这个作用域链是在函数定义的时候创建的。
			// 套的函数 f() 定义在这个作用域链里，其中的变量 scope 一定是局部变量，不管何时何地执行函数 f()，这种绑定在执行 f() 时依然有效。
		
		
		    // 3.执行上下文栈
			// 顺序执行
			//变量提升
			var foo = function() {
				console.warn('foo1');
			}
			foo(); //foo1
			var foo = function() {
				console.warn('foo2')
			}
			foo();//foo2
			//函数提升
			function foo() {
				console.warn('foo1');
			}
			foo();//foo2
				
			function foo() {
				console.warn('foo2')
			}
			foo();//foo2
			// 刷过面试题的都知道这是因为 JavaScript 引擎并非一行一行地分析和执行程序，而是一段一段地分析执行。
			// 当执行一段代码的时候，会进行一个“准备工作”，比如第一个例子中的变量提升，和第二个例子中的函数提升。
			// JavaScript 的可执行代码(executable code)的类型有哪些了？
			// 
			// 其实很简单，就三种，全局代码、函数代码、eval代码。
			
			// 执行上下文栈
			function fun3() {
			    console.log('fun3')
			}
			function fun2() {
			    fun3();
			}
			function fun1() {
			    fun2();
			}
			fun1();
			// 执行一个函数的时候，就会创建一个执行上下文，并且压入执行上下文栈，当函数执行完毕的时候，就会将函数的执行上下文从栈中弹出。
			// 伪代码
			
			// fun1()
			// ECStack.push(<fun1> functionContext);
			// // fun1中竟然调用了fun2，还要创建fun2的执行上下文
			// ECStack.push(<fun2> functionContext);
			// // 擦，fun2还调用了fun3！
			// ECStack.push(<fun3> functionContext);
			// // fun3执行完毕
			// ECStack.pop();
			// // fun2执行完毕
			// ECStack.pop();
			// // fun1执行完毕
			// ECStack.pop();
			// // javascript接着执行下面的代码，但是ECStack底层永远有个globalContext
			// var scope = "global scope";
			// function checkscope(){
			//     var scope = "local scope";
			//     function f(){
			//         return scope;
			//     }
			//     return f();
			// }
			// checkscope();
			// var scope = "global scope";
			// function checkscope(){
			//     var scope = "local scope";
			//     function f(){
			//         return scope;
			//     }
			//     return f;
			// }
			// checkscope()();
			// // 两段代码执行的结果一样，但是两段代码究竟有哪些不同呢？
			// // 
			// // 答案就是执行上下文栈的变化不一样。
			// // 
			// // 让我们模拟第一段代码：
			
			// ECStack.push(<checkscope> functionContext);
			// ECStack.push(<f> functionContext);
			// ECStack.pop();
			// ECStack.pop();
			// // 让我们模拟第二段代码：
			
			// ECStack.push(<checkscope> functionContext);
			// ECStack.pop();
			// ECStack.push(<f> functionContext);
			// ECStack.pop();
			// // 是不是有些不同呢？
			
            // // 当然了，这样概括的回答执行上下文栈的变化不同
            

            	// 4.变量对象
			// 对于每个执行上下文，都有三个重要属性：
			// 变量对象(Variable object，VO)    存储了在上下文中定义的变量和函数声明。
			// 作用域链(Scope chain)
			// this
		    
			//全局上下文下的变量对象和函数上下文下的变量对象。
			//全局上下文
			// 全局对象是预定义的对象，作为 JavaScript 的全局函数和全局属性的占位符。通过使用全局对象，可以访问所有其他所有预定义的对象、函数和属性。
			// 
			// 在顶层 JavaScript 代码中，可以用关键字 this 引用全局对象。因为全局对象是作用域链的头，这意味着所有非限定性的变量和函数名都会作为该对象的属性来查询。
			// 1.可以通过 this 引用，在客户端 JavaScript 中，全局对象就是 Window 对象。
			
			console.log(this);
			// 2.全局对象是由 Object 构造函数实例化的一个对象。
			
			console.log(this instanceof Object);
			// 3.预定义了一堆，嗯，一大堆函数和属性。
			
			// 都能生效
			console.log(Math.random());
			console.log(this.Math.random());
			// 4.作为全局变量的宿主。
			
			var a = 1;
			console.log(this.a);
			// 5.客户端 JavaScript 中，全局对象有 window 属性指向自身。
			
			var a = 1;
			console.log(window.a);
			
			this.window.b = 2;
			console.log(this.b);
			// 花了一个大篇幅介绍全局对象，其实就想说：
			
			// 全局上下文中的变量对象就是全局对象呐！
			// 函数上下文
			// 在函数上下文中，我们用活动对象(activation object, AO)来表示变量对象。
			// 
			// 活动对象和变量对象其实是一个东西，只是变量对象是规范上的或者说是引擎实现上的，不可在 JavaScript 环境中访问，只有到当进入一个执行上下文中，这个执行上下文的变量对象才会被激活，所以才叫 activation object 呐，而只有被激活的变量对象，也就是活动对象上的各种属性才能被访问。
			// 
			// 活动对象是在进入函数上下文时刻被创建的，它通过函数的 arguments 属性初始化。arguments 属性值是 Arguments 对象。
			// 
			// 执行过程
			// 执行上下文的代码会分成两个阶段进行处理：分析和执行，我们也可以叫做：
			// 
			// 进入执行上下文
			// 
			// 代码执行
			// 
			// 进入执行上下文
			// 当进入执行上下文时，这时候还没有执行代码，
			// 
			// 变量对象会包括：
			// 
			// 函数的所有形参 (如果是函数上下文)
			// 
			// 由名称和对应值组成的一个变量对象的属性被创建
			// 
			// 没有实参，属性值设为 undefined
			// 
			// 函数声明
			// 
			// 由名称和对应值（函数对象(function-object)）组成一个变量对象的属性被创建
			// 
			// 如果变量对象已经存在相同名称的属性，则完全替换这个属性
			// 
			// 变量声明
			// 
			// 由名称和对应值（undefined）组成一个变量对象的属性被创建；
			// 
			// 如果变量名称跟已经声明的形式参数或函数相同，则变量声明不会干扰已经存在的这类属性
			// 
			function foo3() {
				var b = 2;
				function c() {}
				var d = function() {};
				b = 3;
			}
			foo(1);
			//进入上下文后,活动对象是:
			AO = {
				arguments: {
					0: 1,
					length: 1
				},
				a: 1,
				b: undefined,
				c:reference to function c(){},
				d: undefined
			}
			// 代码执行
			// 在代码执行阶段，会顺序执行代码，根据代码，修改变量对象的值
			// 
			// 还是上面的例子，当代码执行完后，这时候的 AO 是：
			AO = {
				arguments: {
					0: 1,
					length: 1,
				},
				a: 1,
				b: 3,
				c: reference to function c() {},
				d: reference to FunctionExpression "d",
			}
			// 到这里变量对象的创建过程就介绍完了，让我们简洁的总结我们上述所说：
			// 
			// 全局上下文的变量对象初始化是全局对象
			// 
			// 函数上下文的变量对象初始化只包括 Arguments 对象
			// 
			// 在进入执行上下文时会给变量对象添加形参、函数声明、变量声明等初始的属性值
			// 
            // 在代码执行阶段，会再次修改变量对象的属性值
            
            function foo() {
			    console.log(a);
			    a = 1;
			}
			
			foo(); // ???
			
			function bar() {
			    a = 1;
			    console.log(a);
			}
			bar(); // ???
			// 第一段会报错：Uncaught ReferenceError: a is not defined。 因为函数中的 "a" 并没有通过 var 关键字声明，所有不会被存放在 AO 中。
			// 
			// 第二段会打印：1。 当第二段执行 console 的时候，全局对象已经被赋予了 a 属性，这时候就可以从全局找到 a 的值
			
			console.log(foo);
			
			function foo(){
			    console.log("foo");
			}
			
			var foo = 1;
			// 会打印函数，而不是 undefined 。进入执行上下文时，首先会处理函数声明，其次会处理变量声明，如果如果变量名称跟已经声明的形式参数或函数相同，则变量声明不会干扰已经存在的这类属性。
    
            
            // 6.作用域链
			// 当查找变量的时候，会先从当前上下文的变量对象中查找，如果没有找到，就会从父级(词法层面上的父级)执行上下文的变量对象中查找，一直找到全局上下文的变量对象，也就是全局对象。这样由多个执行上下文的变量对象构成的链表就叫做作用域链。
			
		    // 函数创建 函数的作用域在函数定义的时候就决定了。 这是因为函数有一个内部属性 [[scope]]，当函数创建的时候，就会保存所有父变量对象到其中
			function foo() {
			    function bar() {
			        ...
			    }
			}
			// 函数创建时，各自的[[scope]]为：
			
			
			foo.[[scope]] = [
			  globalContext.VO
			];
			
			bar.[[scope]] = [
			    fooContext.AO,
			    globalContext.VO
			];
			
			// 函数激活
			// 当函数激活时，进入函数上下文，创建 VO/AO 后，就会将活动对象添加到作用链的前端。
			捋一捋
			以下面的例子为例，结合着之前讲的变量对象和执行上下文栈，我们来总结一下函数执行上下文中作用域链和变量对象的创建过程：
			
			var scope = "global scope";
			function checkscope(){
			    var scope2 = 'local scope';
			    return scope2;
			}
			checkscope();
			执行过程如下：
			
			1.checkscope 函数被创建，保存作用域链到 内部属性[[scope]]
			
			checkscope.[[scope]] = [
			    globalContext.VO
			];
			2.执行 checkscope 函数，创建 checkscope 函数执行上下文，checkscope 函数执行上下文被压入执行上下文栈
			
			ECStack = [
			    checkscopeContext,
			    globalContext
			];
			3.checkscope 函数并不立刻执行，开始做准备工作，第一步：复制函数[[scope]]属性创建作用域链
			
			checkscopeContext = {
			    Scope: checkscope.[[scope]],
			}
			4.第二步：用 arguments 创建活动对象，随后初始化活动对象，加入形参、函数声明、变量声明
			
			checkscopeContext = {
			    AO: {
			        arguments: {
			            length: 0
			        },
			        scope2: undefined
			    }
			}
			5.第三步：将活动对象压入 checkscope 作用域链顶端
			
			checkscopeContext = {
			    AO: {
			        arguments: {
			            length: 0
			        },
			        scope2: undefined
			    },
			    Scope: [AO, [[Scope]]]
			}
			6.准备工作做完，开始执行函数，随着函数的执行，修改 AO 的属性值
			
			checkscopeContext = {
			    AO: {
			        arguments: {
			            length: 0
			        },
			        scope2: 'local scope'
			    },
			    Scope: [AO, [[Scope]]]
			}
			7.查找到 scope2 的值，返回后函数执行完毕，函数上下文从执行上下文栈中弹出
			
			ECStack = [
			    globalContext
			];