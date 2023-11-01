# java基础

## 基本数据类型

基本数据类型分为四类八种

整数: byte（1字节）, short（2字节）, int（默认，3字节）, long（数据值后面需要加L，4字节）
浮点数: float（数据值后面需要加F）, double(默认)
字符: char
布尔: boolean

## 方法

### 键盘录入

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

