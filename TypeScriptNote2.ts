//接口与类
//函数、组件、SDK

接口 作用是为这些类型命名，以及为你的代码或者第三方代码定义契约
接口好比一个名字，代表有什么属性为什么类型
interface LabeledValue {
    label: string,
}
function printLabel(labelledObj: LabeledValue) {
    console.warn(labelledObj.label);
}
let myObj = {size: 10, label: "size 10 Object" };
printLabel(myObj);

可选属性
interface SquareConfig {
    color?: string,
    width?: number,
}
function createSquare(config: SquareConfig): { color: string; area: number } {
    let newSquare = { color: 'white', area: 100}
    if(config.color) {
        newSquare.color = config.color;
    }
    if(config.width) {
        newSquare.area = config.width * config.width;
    }
    return newSquare;
}
let mySquare = createSquare({color: 'black'});

only read reference
interface Point {
    readonly x : number;
    readonly y : number;
    [propname : string]: any; 额外的属性检查 或者使用断言  赋值
}
let P1: Point = { x: 10, y: 10};
P1.x = 5//error
该用readonly还是const的方法， 最简单的判断方法就是，看要把它作为变量使用还是作为一个属性，
作为变量使用就用const， 作为属性则用readonly。

函数类型
就像一个只有参数列表和返回值类型的函数定义
interface SearchFun {
    (source: string, subString: string): boolean
}

可索引类型接口
interface StringArray {
      readonly [index: number] : string,
}

let myArray: StringArray;
myArray = ['a', 'b'];
let mystr: string = myArray[0];

继承接口
interface Shape {
    color: string,
}
interface Square extends Shape {
   sideLength: number,
}

let Square = <Square>{}
Square.color = 'blue'
Square.sideLength = 10;
一个接口可以继承多个接口
interface PenStroke {
    penWidth: number,
}
interface Square extends Shape, PenStroke {
    sideLength: number,
}

let square = <Square>{}
square.color = 'blue';
square.sideLength = 10;
square.penWidth = 10;



类
interface ClockInterFace {
    currentTime: Date;
    setTime(d:Date);
}

class Clock implements ClockInterFace {
    currentTime: Date;
    constructor(h: number, m: number) {}
    setTime(d:Date) {
        this.currentTime = d;
    }
     
}

继承类
class Animal {
    name: string;
    constructor(theName: string){
       this.name = theName;
    }
    move(d: number = 0) {
        console.warn(`${this.name} moved ${d}`);
    }

}

class Dog extends Animal {
    constructor(name: string) { super(name); }
    bark() {
        console.warn('hh')
    }
    move(d = 2) {
        console.warn('fff');
        super.move(d);  //重写父类的方法
    }
}

寄存器  通过getters/setters 来截取对对象成员的访问
let passcode = "secret passcode";
class Employee {
    private _fullName: string;
    get fullName():string {
        return this._fullName;
    }
    set fullName(newName: string) {
        if( passcode && passcode == 'secret passcode') {
            this._fullName = newName;
        } else {
            console.warn("Error : ,,,,,");
        }
    }
}

let employee = new Employee();
employee.fullName = "Bob Smith";
if(employee.fullName) {
    alert(employee.fullName);
}


抽象类
abstract class Department {
    constructor(public name: string) {

    }
    printName(): void {
        console.log('Department name' +this.name);
    }

    abstract printMeeting(): void;//抽检类的抽象方法必须在派生类中实现

}

class AccountingDepartment extends Department {
    constructor() {
        super();//在派生类的构造函数中必须调研super();
    }
    printMeeting(): void {
        console.warn('')''
    }
    generteReports(): void {
        console.warn()
    }
}

let deparment: Department;//允许创建一个对抽象类型的引用
deparment = new Department();//不能创建一个抽象类的实例
deparment = new AccountingDepartment();//允许对一个抽象子类进行实例化和赋值
deparment.printName();
deparment.printMeeting();
deparment.generteRepotrs();//方法在声明的抽象类中不存在



命名空间与模块
  



