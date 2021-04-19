
//1、数据类型判断
// typeof 可以正确识别：Undefined、Boolean、Number、String、Symbol、Function 等类型的数据，
// 但是对于其他的都会认为是 object，比如 Null、Date 等，所以通过 typeof 来判断数据类型会不准确。
// 但是可以使用 Object.prototype.toString 实现。

function typeOf(obj) {
  let res = Object.prototype.toString.call(obj).split('')[1]
  res = res.substring(0, res.length - 1).toLowerCase()
  return res
}

typeOf([]) // 'array'
typeOf({})  // 'object'
typeOf(new Date) // 'date'


//2、继承
// 原型链继承

function Animal() {
  this.colors = ['black', 'white']
}

Animal.prototype.getColor = function() {
  return this.colors
}

function Dog() {}

Dog.prototype = new Animal()
let dog1 = new Dog()
dog1.colors.push('red')
let dog2 = new Dog()
console.log(dog2.colors)  // ['black', 'white', 'brown']

// 原型链继承存在的问题：
// 问题1：原型中包含的引用类型属性将被所有实例共享；
// 问题2：子类在实例化的时候不能给父类构造函数传参

//借用构造函数实现继承

function Animal(name) {
  this.name = name
  this.getName = function() {
    return this.name
  }
}

function Dog(name) {
  Animal.call(this, name)
}

Dog.prototype = new Animal()
// 用构造函数实现继承解决了原型链继承的 2 个问题：引用类型共享问题以及传参问题。
// 但是由于方法必须定义在构造函数中，所以会导致每次创建子类实例都会创建一遍方法。