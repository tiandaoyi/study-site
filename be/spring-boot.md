# Spring Boot

## 概述

概念：简化Spring的开发，提供了一种快速使用Spring的方式

Spring的缺点：配置繁琐、依赖繁琐

Spring Boot功能：自动配置、起步依赖(依赖传递)、辅助功能

## 入门

- 创建项目时，使用jar的打包方式。
- SpringBoot的引导类，是项目入口，运行main方法就可以启动项目。
- 使用SpringBoot和Spring构建的项目，业务代码完全一样。

## 配置

很多配置都有默认值，如果想替换默认配置，可以使用application.properties(优先级高)或者application.yml进行配置

properties:

```properties
server.port=8080
```

yml:

```yml
server:
  port:
    8080
```

### yml

yml或yaml优势：简介，以数据为核心。

- 大小写敏感
- 数据值前边必须有空格，作为分隔符
- 使用缩进表示层级关系
- 缩进时不允许使用Tab键，只允许使用空格
- 缩进的空格数目不重要，只要相同层级左侧对其即可
- #表示注释，从这个字符到行尾，都会被解析器忽略

对象(map): 键值对的集合。

```yaml
person:
  name: zhangsan
# inline
person: {name: zhangsan}
```

数组：一组按次序排列的值

```yaml
address:
  - beijing
  - shanghai
# inline
address: [beijing,shanghai]
```

纯量：单个的、不可再分的值（单引号中的转译不会识别，会原样输出）

```yaml
address: "hello \n world"
address2: 'hello \n world'
```

引用

```yaml
name: abc
person:
  abc: ${name}
```

### 读取配置文件内容

第一种，使用@Value

```java
// 对象
@Value("${person.name}")
private String name;
// 数组
@Value("${address[0]}")
private String name;

```

第二种，Environment

```java
@Autowired
private Environment env;

env.getProperty("person.name")
env.getProperty("address[0]")
```

第三种，@ConfigurationProperties

```java
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "person")
public class Person {}
```
