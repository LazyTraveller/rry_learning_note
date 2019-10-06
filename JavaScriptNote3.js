9.参数按值传递
		ECMAScript中所有函数的参数都是按值传递的。
		
		什么是按值传递呢？
		
		也就是说，把函数外部的值复制给函数内部的参数，就和把值从一个变量复制到另一个变量一样。
		按值传递
		var value = 1;
		function foo4(v) {
			v = 2;
			console.log(v);//2
		}
		foo(value);
		console.warn(foo(value))//1
		很好理解，当传递 value 到函数 foo 中，相当于拷贝了一份 value，假设拷贝的这份叫 _value，函数中修改的都是 _value 的值，而不会影响原来的 value 值。
		
		引用传递   所谓按引用传递，就是传递对象的引用，函数内部对参数的任何改变都会影响该对象的值，因为两者引用的是同一个对象。
		var obj = {
			value: 1
		}
		function foo(o) {
			o.value = 2
			console.warn(o.value) //2
		}
		foo(obj);
		console.log(obj.value); //2
		
		第三种传递方式   按共享传递。
		var obj1 = {
			value: 1
		}
		function foo(o) {
			o = 2;
			console.warn(o);//2
		}
		foo(obj1);
		console.warn(obj.value)//1
		共享传递是指，在传递对象的时候，传递对象的引用的副本。
		注意： 按引用传递是传递对象的引用，而按共享传递是传递对象的引用的副本！
		所以修改 o.value，可以通过引用找到原值，但是直接修改 o，并不会修改原值。所以第二个和第三个例子其实都是按共享传递。
		参数如果是基本类型是按值传递，如果是引用类型按共享传递。
		
		但是因为拷贝副本也是一种值的拷贝，所以在高程中也直接认为是按值传递了。
        
        
        10.call和apply的模拟实现
		call() 方法在使用一个指定的 this 值和若干个指定的参数值的前提下调用某个函数或方法。
		var foo = {
			value: 1
		}
		function bar() {
			console.warn(this.value)
			
		}
		bar.call(foo); //1
		注意两点：
		
		call 改变了 this 的指向，指向到 foo
		
		bar 函数执行了
		
		模拟实现call
		Function.prototype.call = function  (context) {
			context.fn = this;
			context.fn();
			delete context.fn;
		}
		var foo = {
			value: 1
		}
		function bar() {
			console.log(this.value);
		}
		bar.call(foo);
		
		Function.prototype.call = function (context) {
			context.fn = this;
			context.fn();
			delete context.fn;
		}
		
		call 函数还能给定参数执行函数
		var foo = {
		    value: 1
		};
		
		function bar(name, age) {
		    console.log(name)
		    console.log(age)
		    console.log(this.value);
		}
		
		bar.call(foo, 'kevin', 18);
		// kevin
		// 18
		// 1
		
		从 Arguments 对象中取值，取出第二个到最后一个参数，然后放到一个数组里。
		
		比如这样：
		
		// 以上个例子为例，此时的arguments为：
		// arguments = {
		//      0: foo,
		//      1: 'kevin',
		//      2: 18,
		//      length: 3
		// }
		// 因为arguments是类数组对象，所以可以用for循环
		var args = [];
		for(var i = 1, len = arguments.length; i < len; i++) {
		    args.push('arguments[' + i + ']');
		}
		
		// 执行后 args为 [foo, 'kevin', 18]
		// 第二版
		Function.prototype.call2 = function(context) {
		    context.fn = this;
		    var args = [];
			//解决数组不定长的问题
		    for(var i = 1, len = arguments.length; i < len; i++) {
		        args.push('arguments[' + i + ']');
		    }
		    eval('context.fn(' + args +')');//把这个参数数组放到要执行的函数的参数里面去。
		    delete context.fn;
		}
		
		// 测试一下
		var foo = {
		    value: 1
		};
		
		function bar(name, age) {
		    console.log(name)
		    console.log(age)
		    console.log(this.value);
		}
		
		bar.call2(foo, 'kevin', 18); 
		// kevin
		// 18
		// 1
		
		1.this 参数可以传 null，当为 null 的时候，视为指向 window
		var value = 1;
		
		function bar() {
		    console.log(this.value);
		}
		
		bar.call(null); // 1
		2.函数是可以有返回值的！
		最后解决方案:
		// 第三版
		Function.prototype.call2 = function (context) {
		    var context = context || window;
		    context.fn = this;
		
		    var args = [];
		    for(var i = 1, len = arguments.length; i < len; i++) {
		        args.push('arguments[' + i + ']');
		    }
		
		    var result = eval('context.fn(' + args +')');
		
		    delete context.fn
		    return result;
		}
		
		// 测试一下
		var value = 2;
		
		var obj = {
		    value: 1
		}
		
		function bar(name, age) {
		    console.log(this.value);
		    return {
		        value: this.value,
		        name: name,
		        age: age
		    }
		}
		
		bar.call(null); // 2
		
		console.log(bar.call2(obj, 'kevin', 18));
		// 1
		// Object {
		//    value: 1,
		//    name: 'kevin',
		//    age: 18
		// }
		
		
		apply的模拟实现
		Function.prototype.apply = function (context, arr) {
			var context = Object(context) || window;
			context.fn = this;
			var result;
			if (!arr) {
				result = context.fn();
			} else {
				var args = [];
				for(var i = 0, len = arr.length; i < len; i++) {
					args.push('arr[]' + i + ']');
			}
			result = eval('context.fn(' + args+ ')')
			delete context.fn;
			return result;
        }
        
        11.bind的模拟实现
		由此我们可以首先得出 bind 函数的两个特点：
		
		返回一个函数
		
		可以传入参数
		
		var foo = {
		    value: 1
		};
		
		function bar() {
		    console.log(this.value);
		}
		
		// 返回了一个函数
		var bindFoo = bar.bind(foo); 
		
		bindFoo(); // 1
		
		
		var foo = {
		    value: 1
		};
		
		function bar(name, age) {
		    console.log(this.value);
		    console.log(name);
		    console.log(age);
		
		}
		
		var bindFoo = bar.bind(foo, 'daisy');
		bindFoo('18');
		// 1
		// daisy
		// 18
		函数需要传 name 和 age 两个参数，竟然还可以在 bind 的时候，只传一个 name，在执行返回的函数的时候，再传另一个参数 age!
		
		// 第二版
		Function.prototype.bind2 = function (context) {
		
		    var self = this;
		    // 获取bind2函数从第二个参数到最后一个参数
		    var args = Array.prototype.slice.call(arguments, 1);
		
		    return function () {
		        // 这个时候的arguments是指bind返回的函数传入的参数
		        var bindArgs = Array.prototype.slice.call(arguments);
		        self.apply(context, args.concat(bindArgs));
		    }
		
		}
        
        

        11.new   new 运算符创建一个用户定义的对象类型的实例或具有构造函数的内置对象类型之一
		// Otaku 御宅族，简称宅
		function Otaku (name, age) {
		    this.name = name;
		    this.age = age;
		
		    this.habit = 'Games';
		}
		
		// 因为缺乏锻炼的缘故，身体强度让人担忧
		Otaku.prototype.strength = 60;
		
		Otaku.prototype.sayYourName = function () {
		    console.log('I am ' + this.name);
		}
		
		var person = new Otaku('Kevin', '18');
		
		console.log(person.name) // Kevin
		console.log(person.habit) // Games
		console.log(person.strength) // 60
		
		person.sayYourName(); // I am Kevin
		实例 person 可以：
		
		访问到 Otaku 构造函数里的属性
		
		访问到 Otaku.prototype 中的属性
		
		模拟new 
		function objectFactory() {
			var onj = new Object(),
			constructor  = [].shift.call(arguments);
			obj.__proto__ = constructor.prototype;
			constructor.apply(obj, arguments);
			return obj;
		}
		1.用new Object() 的方式新建了一个对象 obj
		
		2.取出第一个参数，就是我们要传入的构造函数。此外因为 shift 会修改原数组，所以 arguments 会被去除第一个参数
		
		3.将 obj 的原型指向构造函数，这样 obj 就可以访问到构造函数原型中的属性
		
		4.使用 apply，改变构造函数 this 的指向到新建的对象，这样 obj 就可以访问到构造函数中的属性
		
		5.返回 obj
		
		var person = objectFactory(Otaku, 'Kevin', '18')
		console.log(person.name) // Kevin
		console.log(person.habit) // Games
		console.log(person.strength) // 60
		person.sayYourName(); // I am Kevin
		
		第二版本模拟new
		function FactoryFunction () {
			var obj = new Object();
			constructor = [].shift.call(arguments);
			obj.__proto__ = constructor.prototype;//对象指向构造函数原型
			var ret = constructor.apply(obj, arguments);//对象指向构造函数
			return typeof ret === 'object' ? ret : obj;
		}
        
        

        12.类数组对象与arguments
		所谓的类数组对象:
		
		拥有一个 length 属性和若干索引属性的对象
		var array = ['name', 'age', 'sex'];
		
		var arrayLike = {
		    0: 'name',
		    1: 'age',
		    2: 'sex',
		    length: 3
		}
		console.log(array[0]); // name
		console.log(arrayLike[0]); // name
		console.log(array.length); // 3
		console.log(arrayLike.length); // 3
		for(var i = 0, len = array.length; i < len; i++) {
		   ……
		}
		for(var i = 0, len = arrayLike.length; i < len; i++) {
		    ……
		}
		
		类数组不能直接调用数组的方法,因为没有像数组一样的方法
		如果像调用,必须用 Function.call 间接调用：
		var arrayLike = { 0: 'name', 1: 'age', 2: 'sex', length: 3},
		Array.prototype.jion.call(arrayLike,'&'); //name&age&sex
		Array.prototype.slice.call(arrayLike, 0);//['name','age', 'sex'];
		//slice可以做到类数组转数组
		Array.prototype.map.call(arrayLike, function(item) {
			return item.toUpperCase();
		});
		//['NAME', 'AGE', 'SEX']
		
		类数组转对象
		Array.prototype.slice.call(arrayLike, 0);//['name','age', 'sex'];
		var arrayLike = {0: 'name', 1: 'age', 2: 'sex', length: 3 }
		// 1. slice
		Array.prototype.slice.call(arrayLike); // ["name", "age", "sex"] 
		// 2. splice
		Array.prototype.splice.call(arrayLike, 0); // ["name", "age", "sex"] 
		// 3. ES6 Array.from
		Array.from(arrayLike); // ["name", "age", "sex"] 
		// 4. apply
		Array.prototype.concat.apply([], arrayLike)
		
		
		document.getElementsByTagName()等)也返回类数组对象。
		
		Array.prototype.slice.call(arrayLike , 0);
		Array.prototype.slice.call(arrayLike);
		Array.prototype.splice.call(arrayLike, 0);
		Array.prototype.concat.apply([],arrayLike);
		Array.from(arrayLike);
		
		Arguments 对象只定义在函数体中，包括了函数的参数和其他属性。在函数体中，arguments 指代该函数的 Arguments 对象。
		function foo(name, age, sex) {
			console.warn(arguments);
		}
		foo('name', 'age', 'sex');
		我们可以看到除了类数组的索引属性和length属性之外，还有一个callee属性，接下来我们一个一个介绍。
		Arguments对象的length属性，表示实参的长度，举个例子：
		function foo(b, c, d){
		    console.log("实参的长度为：" + arguments.length)
		}
		
		console.log("形参的长度为：" + foo.length)
		
		foo(1)
		
		// 形参的长度为：3
		// 实参的长度为：1
		
		Arguments 对象的 callee 属性，通过它可以调用函数自身。
		
		讲个闭包经典面试题使用 callee 的解决方法：
		var data = [];
			
		for(var i = 0; i < 3; i++) {
			(data[i] = function() {
				console.log(arguments.callee.i)
			}).i = i;
		}
		data[0]();//0
		data[1]();//1
		data[2]();//2
		
		传入的参数，实参和 arguments 的值会共享，当没有传入时，实参与 arguments 值不会共享
		
		除此之外，以上是在非严格模式下，如果是在严格模式下，实参和 arguments 是不会共享的。
		
		传递参数
		将参数从一个函数传递到另一个函数
		foo foo() {
			bar.apply(this, arguments);
		}
		function bar(a, b, c) {
			console.warn(a, b , c)
		}
		foo(1, 2, 3);
		
		强大的ES6
		使用ES6的 ... 运算符，我们可以轻松转成数组。
		function func(...arguments) {
			console.warn(arguments); [1,2,3]
		}
		func(1,2,3);
        
        
        
		13.创建对象的多种方式以及优缺点
		工厂模式
		function createPerson(name) {
			var o = new Object();
			o.name = name;
			o.getName = function() {
				console.log(this.name);
			};
			return o;
		}
		缺点：对象无法识别，因为所有的实例都指向一个原型
		构造函数模式
		function Person() {
			this.name = name;
			this.getName = function () {
				console.log(this.name);
			};
		}
		var person1 = new Person('kevin');
		优点：实例可以识别为一个特定的类型
		
		缺点：每次创建实例时，每个方法都要被创建一次
		构造函数模式优化
		function Person(name) {
			this.name = name;
			this.getName = getName;
			
		}
		
		function getName() {
			console.log(this.name);
		}
		var person1 = new Person('kevin');
		
		优点：解决了每个方法都要被重新创建的问题
		
		缺点：这叫啥封装……
		原型模式
		function Person (name) {
			
		}
		Person.prototype  = {
			name: 'kevin',
			getName: function() {
				console.log(this.name)
			}
		};
		var person1 = new Person();
		优点：封装性好了一点
		
		缺点：重写了原型，丢失了constructor属性
		
		原型模式优化
		function Person(name) {
		
		}
		
		Person.prototype = {
		    constructor: Person,
		    name: 'kevin',
		    getName: function () {
		        console.log(this.name);
		    }
		};
		
		var person1 = new Person();
		优点：实例可以通过constructor属性找到所属构造函数
		
		缺点：原型模式该有的缺点还是有
		
		组合模式(最多使用的一种)
		构造函数模式与原型模式双剑合璧。
		function Person(name) {
			this.name = name;
		}
		Person.prototype = {
			constructor: Person,
			getName: function() {
				console.log(this.name);
			}
		}
		var person1 = new Person();
		优点：该共享的共享，该私有的私有，使用最广泛的方式
		
		缺点：有的人就是希望全部都写在一起，即更好的封装性
		
		
		工厂,工造函数, 原型, 组合(最为广泛使用)