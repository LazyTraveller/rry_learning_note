重点讲解了如原型、作用域、执行上下文、变量对象、this、闭包、按值传递、call、apply、bind、new、继承等 JS 语言中的比较难懂的概念。
1.继承的多种方式和优缺点
		原型链继承
			
		function Parent() {
			this.name = name;
		}
		Parent.prototype.getName = function () {
			console.warn(this.name);
		}
		
		function Child() {
	
		}
		Child.prototype = new Parent();
		var child = new Child();
		console.warn(child.getName())//kevin
		
		1.引用类型的属性被所有实例共享，举个例子：
		function Parent () {
		    this.names = ['kevin', 'daisy'];
		}
		
		function Child () {
		
		}
		
		Child.prototype = new Parent();
		
		var child1 = new Child();
		
		child1.names.push('yayu');
		
		console.log(child1.names); // ["kevin", "daisy", "yayu"]
		
		var child2 = new Child();
		
		console.log(child2.names); // ["kevin", "daisy", "yayu"]
		2.在创建 Child 的实例时，不能向Parent传参
		
		借用构造函数(经典继承)
		function Parent() {
			this.name = ['kevin', 'disy']
		}
		function Child() {
			Parent.call(this);
		}
		var child = new Child();
		child.name.push('yayu');
		console.log(child.name)//['kevin', 'disy', 'yayu'];
		
		var child2 = new Child();
		console.warn(child2.name)//['kevin', 'disy'];
		
		1.避免了引用类型的属性被所有实例共享
		
		2.可以在 Child 中向 Parent 传参
		
		function Parent (name) {
		    this.name = name;
		}
		
		function Child (name) {
		    Parent.call(this, name);
		}
		
		var child1 = new Child('kevin');
		
		console.log(child1.name); // kevin
		
		var child2 = new Child('daisy');
		
		console.log(child2.name); // daisy
		缺点：
		
		方法都在构造函数中定义，每次创建实例都会创建一遍方法。
		
		组合继承
		function Parent(name) {
			this.name = name;
			this.color = ['red', 'blue']
		}
		Parent.prototype.getName =function () {
			console.warn(this.name)
		}
		function Child(name, age) {
			Parent.call(this, name);
			this.age = age;
		}
		
		Child.prototype = new Parent();
		var child = new Child('kevin', 10);
		child.color.push('black');
		console.warn(child.name)//kevin
		console.warn(child.age)//18
		console.warn(child.color)//["red", "blue", "black"]
		var child2 = new Child('daisy', '20');
		
		console.log(child2.name); // daisy
		console.log(child2.age); // 20
		console.log(child2.colors); // ["red", "blue", "green"]
		
		
		原型式继承
		function createObj(o) {
			function F(){}
			F.prototype = o;
			return new F();
		}
		就是 ES5 Object.create 的模拟实现，将传入的对象作为创建的对象的原型。
		
		缺点：
		
		包含引用类型的属性值始终都会共享相应的值，这点跟原型链继承一样。
		
		寄生式继承
		创建一个仅用于封装继承过程的函数，该函数在内部以某种形式来做增强对象，最后返回对象。
		function createObj(o) {
			var clone = Object.create(o);
			clone.sayName = function () {
				console.log('hi')
			}
			return clone;
		}
		缺点：跟借用构造函数模式一样，每次创建对象都会创建一遍方法。
		
		寄生组合式继承
		function Parent (name) {
		    this.name = name;
		    this.colors = ['red', 'blue', 'green'];
		}
		
		Parent.prototype.getName = function () {
		    console.log(this.name)
		}
		
		function Child (name, age) {
		    Parent.call(this, name);
		    this.age = age;
		}
		
		Child.prototype = new Parent();
		
		var child1 = new Child('kevin', '18');
		
		console.log(child1)
		组合继承最大的缺点是会调用两次父构造函数。
		
		一次是设置子类型实例的原型的时候：
		
		Child.prototype = new Parent();
		一次在创建子类型实例的时候：
		
		var child1 = new Child('kevin', '18');
		回想下 new 的模拟实现，其实在这句中，我们会执行：
		
		Parent.call(this, name);
		在这里，我们又会调用了一次 Parent 构造函数。
		
		所以，在这个例子中，如果我们打印 child1 对象，我们会发现 Child.prototype 和 child1 都有一个属性为colors，属性值为['red', 'blue', 'green']。
		
		那么我们该如何精益求精，避免这一次重复调用呢？
		
		如果我们不使用 Child.prototype = new Parent() ，而是间接的让 Child.prototype 访问到 Parent.prototype 呢？
		
		看看如何实现：
		
		function Parent (name) {
		    this.name = name;
		    this.colors = ['red', 'blue', 'green'];
		}
		
		Parent.prototype.getName = function () {
		    console.log(this.name)
		}
		
		function Child (name, age) {
		    Parent.call(this, name);
		    this.age = age;
		}
		
		var F = function() {}关键第三步
		F.prototype = Parent.prototype;
		Child.prototype = new F();
		var child = new Child('kevin', 18);
		console.warn(child);
		
		
		最后我们封装一下这个继承方法：
		function object(o) {
			function F() {}
			F.prototype  = o;
			return new F();
		}
		
		function prototype(child, parent) {
			var prototype = object(parent.prototype);
			prototype.constructor = child;
			child.prototype = prototype;
		}
		prototype(Child, Parent);
		
		引用《JavaScript高级程序设计》中对寄生组合式继承的夸赞就是：
		
		这种方式的高效率体现它只调用了一次 Parent 构造函数，并且因此避免了在 Parent.prototype 上面创建不必要的、多余的属性。
        与此同时，原型链还能保持不变；因此，还能够正常使用 instanceof 和 isPrototypeOf。开发人员普遍认为寄生组合式继承是引用类型最理想的继承范式。
       
        原型继承,构造函数继承,组合继承(原型加构造函数),寄生继承,寄生组合继承(寄生+原型+构造)


        call()、apply()、bind()的用法终于理解
		call 、bind 、 apply 这三个函数的第一个参数都是 this 的指向对象，第二个参数差别就来了：
		call的参数是直接放进去的，第二第三第n个参数全都用逗号分隔，直接放到后面 obj.myFun.call(db,'成都', ... ,'string' )；
		apply的所有参数都必须放在一个数组里面传进去 obj.myFun.apply(db,['成都', ..., 'string' ]);
		bind除了返回是函数以外，它 的参数和call 一样。
		
		1. 每个函数都包含两个非继承而来的方法：call()方法和apply()方法。
		2. 相同点：这两个方法的作用是一样的。
		都是在特定的作用域中调用函数，等于设置函数体内this对象的值，以扩充函数赖以运行的作用域。
		
		一般来说，this总是指向调用某个方法的对象，但是使用call()和apply()方法时，就会改变this的指向。
		apply()方法 接收两个参数，一个是函数运行的作用域（this），另一个是参数数组。
		语法：apply([thisObj [,argArray] ]);，调用一个对象的一个方法，2另一个对象替换当前对象。
		
		说明：如果argArray不是一个有效数组或不是arguments对象，那么将导致一个
		TypeError，如果没有提供argArray和thisObj任何一个参数，那么Global对象将用作thisObj。
		
		call()方法 第一个参数和apply()方法的一样，但是传递给函数的参数必须列举出来。
		语法：call([thisObject[,arg1 [,arg2 [,...,argn]]]]);，应用某一对象的一个方法，用另一个对象替换当前对象。
		
		说明： call方法可以用来代替另一个对象调用一个方法，call方法可以将一个函数的对象上下文从初始的上下文改变为thisObj指定的新对象，如果没有提供thisObj参数，那么Global对象被用于thisObj。
        
        

