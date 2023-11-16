# java基础

## 基本数据类型

基本数据类型分为四类八种

整数: byte（1字节）, short（2字节）, int（默认，3字节）, long（数据值后面需要加L，4字节）
浮点数: float（数据值后面需要加F）, double(默认)
字符: char
布尔: boolean

## 方法

### 键盘录入

nextDouble接受小数
next接受字符串（制表符和空格分开计算）
nextLine接受字符串（只有回车才表示结束）

```java
import java.util.Scanner;
public class ScannerDemo {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    int num = sc.nextInt();
    System.out.println(num);
  }
}
```

### 随机数

```java
import java.util.Random;
Random r = new Random();
int number = r.nextInt(/*随机数的范围， 如果是100，则范围0-99*/)
```

## 运算

### 算术运算

1. 整数参与计算，结果只能是整数
2. 小数参与计算，结果可能是不精确的

`10 / 3 = 3`
`10.0 / 3 = 3.33333335`

### 隐式转换（类型提升）

1. 小变大，取值范围小的转成取值范围大的，会把小的先改成大的，再进行运算
2. byte short char 三种类型数据进行运算的时候，都会先提升成int，再进行运算

```java
int a = 10
double = b = a // b = 10.0
```

### 强制转换

大的转小的

```java
int a1 = 300
byte a2 = (byte)a1 
```

### 有字符时的算术运算符

1. 从左向右加
2. 如果是字符串，会把之前的拼接到一起
3. 如果是char类型会使用asc码表的值进行计算

### 逻辑运算符

1. 逻辑与 `&`
2. 逻辑或 `|`
3. 逻辑异或 `^` 相同false，不同true
4. 逻辑非 `!` 取反
5. 短路与 `&&` 有短路效果
6. 短路或 `||` 有短路效果

### 三元运算符

- 格式： `关系表达式 ? 表达式1 : 表达式2`
- 特点：三元运算符的结果必须要使用，比如赋值给变量或者打印

### switch语句

1. 取值：byte,short,int, char, 枚举, String
2. case不允许重复
3. case的值只能是字面量，不允许是变量
4. jdk12特性，`case 变量 -> 执行语句`，可以省略`break;`
5. jdk12特性，如果有结果，可以把switch返回给一个变量
6. case如果没有break可以穿透
7. 可以case多个，用`,`分割 `case: 1,2,3,4`

## 数组

数组指的是一种容器，可以存储同种数据的多个值

- 数组容器在存储数据的时候，需要结合隐式转换考虑
- int类型的数组容器(byte, short, int)
- double类型的数组容器(byte, short, int, long, float, double)
- 建议容器的类型和存储的数据类型保持一致

两种格式

1. 数据类型[] 数组名（常用）
2. 数据类型 数组名[]

数组创建完毕，长度不变

初始化

```java
int[] array = new int[]{11,22,33}
// 简写
String[] arr1 = {"zhangsan", "lisi"}
```

索引，直接用[]，通过对应数组索引的下标获取数据 `arr1[0]`

定义数组（动态初始化创建）：
数据类型[] 数组名 = new 数据类型[数组的长度]
String[] arr = new String[50]
数组默认初始化值: 有规律的，跟类型有关 如0/0.0/false/\u0000(字符类型，空格)/null(引用类型)
动态初始化，明确数组长度。
静态初始化，手动指定元素，系统计算长度。

### java内存分配

栈（方法运行时使用的内存）、堆（对象、数组，new出来的关键字都是在堆空间）、方法区（存储可以运行的class文件）、本地方法栈（jvm使用）、寄存器（cpu使用）

### 方法定义

`public static void 方法名(int num1, int num2){}`

### 方法的注意事项

方法不调用就不执行
方法与方法之间是平级关系，不能互相嵌套
方法的编写顺序和执行顺序无关
方法的返回值类型为void，表示该方法没有返回值，没有返回值的方法可以省略return语句不写。如果要编写return，后面不能跟具体的数据。

### 方法的重载

在同一个类中，方法名相同，参数不同的方法。与返回值无关
java虚拟机会通过参数的不同来区分同名的方法（参数不同构成重载，但不建议）

### 二维数组的格式

```java
int[][] arr = new int[][];
int[][] arr = {{1,2,3},{4,5,6}};
int[][] arr = new int[][]{{},{}};
```

### 构造方法

1. 方法名与类名相同，大小写也有

```java
public class Student {
  // 空参构造方法
  public Student() {}

  // 有参构造方法
  public Student(int a, int b) {}
}
```

### JavaBean类

1. 类名需要见名知意
2. 成员变量使用private修饰
3. 提供至少两个构造方法（无参，有参）
4. 成员方法（提供每一个成员变量对应的setXxx()/getXxx()、如果还有其他行为，也需要写上）

快捷键alt+insert或者ptg插件（vscode）

### System.out.printf

第一部分参数：要输入的内容%s(占位)
第二部分参数：填充的数据

`System.out.printf("你好啊%s", "张三");`

### 字符串

String, StringBuilder, StringJonier, String Buffer, Pattern, Matcher

创建String对象的两种方式

1. 直接赋值 （记录的是串池里面的地址值）
2. new关键字记录的是堆里面的地址值）

```java
char[] chs = {'a', 'b', 'c', 'd'};
new String(chs);
```

字符串存储原理

1. 直接赋值会复用字符串常量池中的
2. new出来不会复用，而是开辟一个新的空间

==号比较的是什么？

1. 基本数据类型比较数据值
2. 引用数据类型比较地址值

字符串拼接的底层原理

1. 如果没有变量参与，都是字符串直接相加，编译之后就是拼接之后的结果，会复用串池中的字符串。
2. 如果有变量参与，每一行拼接的代码，都会在内存中创建新的字符串，浪费内存

StringBuilder提高效率原理

- 所有要拼接的内容都会往StringBuilder中放，不会创建很多无用的空间，节约内存

StringBUilder源码分析

1. 初始化16长度字节数组
2. 添加的内容大于16会扩容成原来的容量*2 + 2
3. 扩容后还不够，以实际长度为准

#### 字符串比较

基本数据类型比较的是具体的值，引用类型比较的是具体的值
通常使用equals(), equalsIgnoreCase()来进行比较字符串中的内容 s1.equals(s2)

其他常见的字符串方法：substring(), replace(), chatAt()

#### StringBuilder

可以看成是一个容器，创建之后的内容是可变的，提高操作效率。

常见方法：append、reverse、length、toString

#### StringJonier

第一个参数是分隔符，第二个参数和第三个参数是开始结束符号（jdk8）

add length toString 方法




   