import { array, func, object } from "prop-types";
import { type } from "os";
import { resolve, reject } from "q";

console.warn('hello world');
//boolean  布尔值
//null 
//undefined
//number
//string
//symbol
//object
//array

let areYouOk: boolean = true;
let a: number = 6;
let b: number = 1_000_100;
let name1: string = 'xiaoming';
let othername: string = 'xiaohong';
let list: number[] = [1,2,3];
let list1: Array<number> = [1, 3, 4];

//类型断言
let oneString: any = 'this is a string'
let stringLength: number = (<string>oneString).length;
let stringLength1: number = (oneString as string).length;

//数字函数  输入一个数字类型，返回一个数字类型
function hello(arr: number): number {
    return arr;
}
//字符串函数，输入一个字符类型，返回一个字符串类型
function hello1(arr: string): string {
    return arr
}
//任何类型函数，输入任何类型，返回一个任何类型  和泛型的区别就是any不能准确地表达返回值与参数必须是相同类型。
function hello2(arr: any): any {
    return arr;
}

//泛型函数
//返回的值和参数类型相同
function hello3<T>(arr: T): T {
    return arr;
}
//使用泛型
//<1>使用尖括号
let output = hello3<string>("hello typeSrcipt")
//<2>使用类型推断
let output1 = hello3("hello typeSrcipt");
let output2 = hello3<number>(3);


function JiangRiLi<T>(arr: T): T {
    return arr;
}

//泛型变量
function hello4<T>(arr: Array<T>): Array<T> {
    return arr;
}

//数字枚举
enum OrderStatus {
    start = 1,
    upaid,
    shipping,
    shiped,
    complete,
}
//字符串枚举
enum OrderStatus2 {
    start = "start",
    upaid = "upaid",
    shipping = "shipping",
    shiped = "shiped",
    completed ="completed"
}
//symbol
const symbol = Symbol();
//iterator and generator
//array,map,set,string
const array = [233,'hello', true]
for(let a of array) {
    console.warn(a);
}
// for ...of, and for ...in:最大的区别就是用于迭代器返回的值不一样，for ..in 迭代的是对象的键， 而for ..of迭代的是对象的值

//<human salary="20000" girlfriend="null" type="developer" />
const array  = [3,4,5];
for (let i in array) {
    console.warn(i);//0, 1, 2
}
for (let i of array) {
    console.warn(i);// 3, 4, 5
}
//generator 生成器
function* infiniterList() {
    let i = 0;
    while(true) {//永远执行下去
        yield i++;
    }
}
var iterator = infiniterList();
while(true) {
    console.log(iterator.next());//{ value: xxx, done: false }
}


function* infiniterList1() {
    let i = 0;
    while( i < 3) {
        yield i++;
    }
}
let gen = infiniterList1();
console.warn(gen.next());
console.warn(gen.next());

function* generator1() {
    try {
        yield 1;
    } 
    catch(error) {
        console.warn(error.message)
    }
}
const iterator1 = generator1();
iterator1.next();
iterator1.throw(new Error('something incorrect'));
//外部系统可以传递一个值到generator函数体里面
//外部系统可以抛入一个异常到generator函数体中

//字典 interface
interface A {
    a: number,
    b: string,
    c: number[]
}
let a: A;
a.a = 1;
a.b = 'hello'
a.c = [1,2,3];

//交叉类型与联合类型
//交叉类型是指多个字典类型合并为一个新的字典类型。
interface A {
    d: number,
    z: string
}
interface B {
    f: string,
    g: string,
}
type C = A & B;
let c: C

//联合类型
function padleft(value: string, padding: string | number) {

}
//如果一个值是联合类型，只能访问他们的共有属性
interface A {
    a: number,
    b: string,
}
interface B {
    b: string,
    c: number,
}
interface D {
    b: string,
    f: number,
}

let obj: A | B | C;
obj.b = '';

interface Teacher {
    teach(): void
}
interface Student {
    learn(): void
}
function getPerson(): Teacher | Student {
    return {} as Teacher
}
const person = getPerson();
//类型保护
function isTeacher(person: Teacher | Student) : person is Teacher {

}
//typeod and instanceod 会引起类型保护

//函数  包括量部分：参数类型和返回值类型
function add(x: number, y: number): number {
    return x + y;
}
const add1 = function(x: number, y: number): number {
    return x + y;
}
//也可以给一个变量赋值一个函数的类型
let add3: (x: number, y: number) => number
//参数，每个函数参数必须有值，必须一一对应

//1可选参数
function buildName(firstName: string, lastName?: string) {
    if (lastName) {
        return firstName+ '' + lastName;
    } else {
        return firstName;
    }
}
let name3 = buildName('balc');//is ok
let name2 = buildName('nu','bb')//is ok too
//可选参数必须跟在必须参数的后面， 如果想让firstname是可选，那么必须调整参数位置，把firstname放在后面
//2默认参数
function buildName2(firstName: string, lastName = "Obama") {
    return firstName + " " + lastName;
}
//3.剩余参数
function buildName3(firstName: string, ...name: string[]) {
    return firstName + " " + name.join(' ');
}

//创建promise
const promise = new Promise((resolve, reject) => {
    resolve(2333)
})
//订阅promise
promise.then((res) => {
    console.warn(res)
})
promise.catch((err) => {

})
