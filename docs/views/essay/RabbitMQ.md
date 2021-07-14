---
title: RabbitMQ学习笔记
date: 2020-01-07
categories:
- learning notes
tags: 
- MQ
---

## 1 简介

::: tip

参考文章：[新手也能看懂，消息队列其实很简单](https://zhuanlan.zhihu.com/p/52773169)

:::

### 1.1 什么是消息队列

 我们知道，队列是一种先进先出的数据结构。消息队列可以比作是一个按照先进先出的顺序存放、取出消息的管子。   

### 1.2 消息队列的使用场景

总的来说可以划分为以下两种：**(这段直接搬运)**

1. **通过异步处理提高系统性能**

   

   ​			![img](https://pic3.zhimg.com/80/v2-38d11d9e3a712f558d97ee1149265da2_hd.jpg)

   如上图，在不使用消息队列服务器的时候，用户的请求数据直接写入数据库，在高并发的情况下数据库压力剧增，使得响应速度变慢。但是在使用消息队列之后，用户的请求数据发送给消息队列之后**立即返回**，再由消息队列的消费者进程从消息队列中获取数据，**异步写入数据库**。由于消息队列服务器处理速度快于数据库（消息队列也比数据库有更好的伸缩性），因此响应速度得到大幅改善。

   通过以上分析我们可以得出**消息队列具有很好的削峰作用的功能**——即**通过异步处理，将短时间高并发产生的事务消息存储在消息队列中，从而削平高峰期的并发事务。** 举例：在电子商务一些秒杀、促销活动中，合理使用消息队列可以有效抵御促销活动刚开始大量订单涌入对系统的冲击。如下图所示：

   ![img](https://pic3.zhimg.com/80/v2-d8cc821bcafbf17b08c96b0f5990670a_hd.jpg)

   因为**用户请求数据写入消息队列之后就立即返回给用户了，但是请求数据在后续的业务校验、写数据库等操作中可能失败**。因此使用消息队列进行异步处理之后，需要**适当修改业务流程进行配合**，比如**用户在提交订单之后，订单数据写入消息队列，不能立即返回用户订单提交成功，需要在消息队列的订单消费者进程真正处理完该订单之后，甚至出库后，再通过电子邮件或短信通知用户订单成功**，以免交易纠纷。这就类似我们平时手机订火车票和电影票。

2. **降低系统耦合性**

   我们知道如果模块之间不存在直接调用，那么新增模块或者修改模块就对其他模块影响较小，这样系统的可扩展性无疑更好一些。   

   我们最常见的**事件驱动架构**类似**生产者消费者**模式，在大型网站中通常用利用消息队列实现事件驱动结构。如下图所示：

   

   ![img](https://pic1.zhimg.com/80/v2-89acee0a50ff56e2b63450e831b96924_hd.jpg)

   

   消息队列使利用**发布-订阅模式**工作，消息发送者（生产者）发布消息，一个或多个消息接受者（消费者）订阅消息。 从上图可以看到**消息发送者（生产者）和消息接受者（消费者）之间没有直接耦合**，消息发送者将消息发送至分布式消息队列即结束对消息的处理，消息接受者从分布式消息队列获取该消息后进行后续处理，并不需要知道该消息从何而来。**对新增业务，只要对该类消息感兴趣，即可订阅该消息，对原有系统和业务没有任何影响，从而实现网站业务的可扩展性设计**。

   消息接受者对消息进行过滤、处理、包装后，构造成一个新的消息类型，将消息继续发送出去，等待其他消息接受者订阅该消息。因此基于事件（消息对象）驱动的业务架构可以是一系列流程。

   **另外为了避免消息队列服务器宕机造成消息丢失，会将成功发送到消息队列的消息存储在消息生产者服务器上，等消息真正被消费者服务器处理后才删除消息。在消息队列服务器宕机后，生产者服务器会选择分布式消息队列服务器集群中的其他服务器发布消息。**

   ::: tip 备注

   不要认为消息队列只能利用发布-订阅模式工作，只不过在解耦这个特定业务环境下是使用发布-订阅模式的。除了发布-订阅模式，还有**点对点订阅模式**（一个消息只有一个消费者）。 另外，这两种消息模型是 JMS （Java Message Service）提供的，AMQP 协议还提供了 5 种消息模型。

   :::



### 1.3 使用消息队列可能带来哪些问题

* **系统可用性降低：** 系统可用性在某种程度上降低，在加入MQ之前，你不用考虑消息丢失或者说MQ挂掉等等的情况，但是，引入MQ之后你就需要去考虑了！
* **系统复杂性提高：** 假如MQ之后要考虑保证消息是否被重复消费、消息是否丢失、确保消息传递顺序等问题
* **影响系统一致性：** 之前有提到，异步处理提高系统性能。但是如果消息的消费者没有正确消费消息的话会如何？要知道网站服务器已经默认消息消费成功提前给用户响应了。

​	

### 1.4 安装注意事项

使用RabbitMQ需要安装对应版本的ErLang,具体参考[官网文档](https://www.rabbitmq.com/which-erlang.html)。

| [RabbitMQ version](https://www.rabbitmq.com/versions.html) | Minimum required Erlang/OTP | Maximum supported Erlang/OTP | Notes                                                        |
| :--------------------------------------------------------- | :-------------------------- | :--------------------------- | :----------------------------------------------------------- |
| 3.8.2 3.8.1 3.8.0                                          | 21.3.x                      | 22.x                         | Erlang 22.1 is recommended.Erlang 22.x dropped support for HiPE |
| 3.7.23 3.7.22 3.7.21 3.7.20 3.7.19                         | 21.3.x                      | 22.x                         | [Erlang/OTP 20.3.x support is discontinued](https://groups.google.com/forum/#!searchin/rabbitmq-users/ANN\|sort:date/rabbitmq-users/9tc_OE1eMPk/ly1NEISwBwAJ)Erlang 22.x dropped support for HiPE |

::: tip

rabbitMQ自带管理页面，默认为```localhost:15672```默认管理员账号密码都是guest

:::

### 1.5 JMS  与 AMQP 协议简介

#### JMS简介

JMS (JAVA Message Service) Java消息服务，JMS的客户端之间可以通过JMS服务进行异步的消息传输。JMS API是一个消息服务的**规范和标准**，允许应用程序组件基于JavaEE平台**创建、发送、接收**和读取消息。

它的特点有：

1. 使用分布式通信
2. 耦合度更低
3. 消息服务更加可靠
4. 异步性

#### AMQP简介

AMQP（Advanced Message Queing Protocol）一个提供统一消息服务的**应用层标准高级消息队列协议**，是应用层协议的一个开放标准，为面向消息的中间件设计，兼容JMS。基于此协议的客户端与消息中间件可传递消息，并不受客户端/中间件产品或不同的开发语言等条件限制。**RabbitMQ就是基于AMQP协议实现的**。

#### 两种协议对比

![img](https://pic4.zhimg.com/80/v2-d8a225f003571f7e7907618c61b48cd3_hd.jpg)

#### 总结

- AMQP 为消息定义了线路层（wire-level protocol）的协议，而JMS所定义的是API规范。在 Java 体系中，多个client均可以通过JMS进行交互，不需要应用修改代码，但是其对跨平台的支持较差。而AMQP天然具有跨平台、跨语言特性。
- JMS 支持TextMessage、MapMessage 等复杂的消息类型；而 AMQP 仅支持 byte[] 消息类型（复杂的类型可序列化后发送）。
- 由于Exchange 提供的路由算法，AMQP可以提供多样化的路由方式来传递消息到消息队列，而 JMS 仅支持 队列 和 主题/订阅 方式两种。



​	

## 2 Java开发rabbitMQ

### 2.1 上手Demo：简单队列

**模型**

![img](https://www.rabbitmq.com/img/tutorials/python-one.png)

说明：

* P： producer 消息生产者   

* 红色：队列

* C：Consumer 消息消费者

下面直接上代码

```java
// 发送消息

public static final String QUEUE_NAME = "test_simple_queue";

public static void main(String[] args) throws IOException, TimeoutException {
    Connection connection = null;
    Channel channel = null;
    try {
        connection = ConnectionUtils.getConnection();
        // 从连接中获取通道
        channel = connection.createChannel();
        // 创建队列申明
        channel.queueDeclare(QUEUE_NAME,false,false,false,null);
        String msg = "hello simple queue";
        //发布消息
        channel.basicPublish("",QUEUE_NAME,null,msg.getBytes());
        System.out.println("send msg:"+ msg);
    } catch (IOException | TimeoutException e) {
        e.printStackTrace();
    } finally {
        channel.close();
        connection.close();
    }

}
```

```java

// 接收消息
public static void main(String[] args) throws IOException, TimeoutException {
    Connection connection = ConnectionUtils.getConnection();
    Channel channel = connection.createChannel();

    /**
            创建队列申明
            注： 消费者可以不进行队列申明
            channel.queueDeclare(Send.QUEUE_NAME,false,false,false,null);
    */
    // 创建消费者
    DefaultConsumer consumer = new DefaultConsumer(channel){
        @Override
        public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
            String msg = new String(body, StandardCharsets.UTF_8);
            System.out.println("receive:" + msg);
        }
    };
    // 监听队列
    channel.basicConsume(Send.QUEUE_NAME,true,consumer);
}
```

::: tip

```channel.basicConsume```使用了监听器模式,只要RabbitMQ接收到生产者发出的消息就会调用```DefualtConsumer.handleDeliver方法```对于设计不熟悉的可以参考[设计模式笔记](../DesignPatterns)

::: 

##### 简单队列的不足

耦合性高，生产者一一对应消费者。无法做到多个消费者同时消费消息队列中的消息。   

队列名变更的话，生产者、消费者需要同时变更。

### 2.2 Work queues 工作队列

**模型**

![img](https://www.rabbitmq.com/img/tutorials/python-two.png)

##### 工作队列的优势

Simple队列是一一对应的，而实际开发中生产者发送消息是**毫不费力的**（指发送一条消息需要的资源很少），而消费者一般要和业务逻辑结合，处理消息需要花费时间。所以二者工作效率是不同的，队列中自然会积压很多消息。工作队列可以很好的解决这个问题，减少资源的浪费。

#### 2.2.1 轮询调度（round-robin）

```java
// send
static final String QUEUE_NAME = "test_work_queue";

public static void main(String[] args) throws IOException, TimeoutException, InterruptedException {
    Connection connection = ConnectionUtils.getConnection();
    Channel channel = connection.createChannel();
    channel.queueDeclare(QUEUE_NAME,false,false,false,null);
    for (int i = 0; i < 50; i++) {
        String msg = "第" + i + "条msg";
        channel.basicPublish("",QUEUE_NAME,null,msg.getBytes());
        Thread.sleep(100);
    }
    channel.close();
    connection.close();
}
```

```java
//receive1
public static void main(String[] args) throws IOException, TimeoutException {
    Connection connection = ConnectionUtils.getConnection();

    Channel channel = connection.createChannel();
    channel.queueDeclare(Send.QUEUE_NAME,false,false,false,null);
    //定义消费者
    DefaultConsumer consumer = new DefaultConsumer(channel) {
        @Override
        public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
            String msg = new String(body, StandardCharsets.UTF_8);
            System.out.println("[1] receive:"+msg);
            //模拟对数据进行处理
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
                System.out.println("[1] done");
            }
        }
    };
    channel.basicConsume(Send.QUEUE_NAME,true,consumer);
}
```

```java
//receive2
public static void main(String[] args) throws IOException, TimeoutException {
    Connection connection = ConnectionUtils.getConnection();

    Channel channel = connection.createChannel();
    channel.queueDeclare(Send.QUEUE_NAME,false,false,false,null);
    //定义消费者

    DefaultConsumer consumer = new DefaultConsumer(channel) {
        @Override
        public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
            String msg = new String(body, StandardCharsets.UTF_8);
            System.out.println("[2] receive:"+msg);
		   //模拟对数据进行处理所需要的时间
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                e.printStackTrace();
                System.out.println("[2] done");
            }
        }
    };
    channel.basicConsume(Send.QUEUE_NAME,true,consumer);
}
```

::: tip

本质上来说就是再增加了一个消费者，同时消费生产者的信息。

:::

**现象**

* 消费者1和消费者2处理的数据消息是一样的。
* 消费者1：偶数
* 消费者2：奇数

这种方式叫做轮询调度（round-robin） 结果就是无论消费读取、消费消息的快慢，都不会多给一个消息，二者获得消息是一样的。永远是你一个我一个。

#### 2.2.2 公平分发（fair dispatch）

为了进一步提高资源的利用率可以使用```公平分发```模式

步骤：

1. 关闭自动应答
2. 设置预取数量
3. 每次接受消息后在此获取需要手动回执

```java {12,13}
//send
static final String QUEUE_NAME = "test_work_queue";

public static void main(String[] args) throws IOException, TimeoutException, InterruptedException {
    Connection connection = ConnectionUtils.getConnection();
    Channel channel = connection.createChannel();
    channel.queueDeclare(QUEUE_NAME,false,false,false,null);

    /**
         * 每个消费者发送确认消息之前，不发送下一个消费者,一次只处理一个消息
         */
    int prefetchCount = 1;
    channel.basicQos(prefetchCount);
    for (int i = 0; i < 50; i++) {
        String msg = "第" + i + "条msg";
        channel.basicPublish("",QUEUE_NAME,null,msg.getBytes());
        Thread.sleep(100);
    }
    channel.close();
    connection.close();
}
```

```java {}
//receive1
public static void main(String[] args) throws IOException, TimeoutException {
    Connection connection = ConnectionUtils.getConnection();

    Channel channel = connection.createChannel();
    channel.queueDeclare(Send.QUEUE_NAME,false,false,false,null);
    //设置预获取数量为1
    int prefetchCount = 1;
    channel.basicQos(prefetchCount);

    //定义消费者
    DefaultConsumer consumer = new DefaultConsumer(channel) {
        @Override
        public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
            String msg = new String(body, StandardCharsets.UTF_8);
            System.out.println("[1] receive:"+msg);
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }finally {
                System.out.println("[1] done");
                //手动回执
                channel.basicAck(envelope.getDeliveryTag(),false);
            }
        }
    };
    //自动应答设置为false
    channel.basicConsume(Send.QUEUE_NAME, false,consumer);
}
```

``` java
//reveive2
public static void main(String[] args) throws IOException, TimeoutException {
    Connection connection = ConnectionUtils.getConnection();

    Channel channel = connection.createChannel();
    channel.queueDeclare(Send.QUEUE_NAME,false,false,false,null);

    //设置预获取数量为1
    int prefetchCount = 1;
    channel.basicQos(prefetchCount);

    //定义消费者
    DefaultConsumer consumer = new DefaultConsumer(channel) {
        @Override
        public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
            String msg = new String(body, StandardCharsets.UTF_8);
            System.out.println("[2] receive:"+msg);

            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            } finally {
                System.out.println("[2] done");
                //手动回执？
                channel.basicAck(envelope.getDeliveryTag(),false);
            }
        }
    };
    //关闭自动应答
    channel.basicConsume(Send.QUEUE_NAME,false,consumer);
}
```

**现象**

消费者1处理消息的比消费者2多

#### 2.2.3 消息应答与消息持久化

```java
boolean autoAck = false;
channel.basicConsume(QUEUE_,autoACK,consumer)
```

Ack(Acknowledge character 即**消息应答**或**确认字符**）在数据通信中，接收站发给发送站的一种传输类控制字符。表示发来的数据已确认接收无误。  

```boolean autoAck = true```（自动确认模式）   

表示一旦rabbitMQ将消息分发给消费者，就会自动从内存中删除。这种情况下，如果正在执行的消费者出现故障，就会丢失正在处理的消息。

```boolean autoAck = false```（手动模式），此时如果有一个消费者挂掉，消息就会交付给其他消费者。

rabbitMQ支持**消息应答**，消费者发送一个消息应答，通知RabbitMQ已经接受到消息，然后RabbitMQ就会删除内存中消息。

::: tip **思考：**

如果消息队列中间件挂掉了的话，消息任然会丢失，此时用什么方式保证消息的安全呢？答案很简单，只需要将消息保存到磁盘中就可以了，即**消息持久化**
:::

**使用Java代码的方式设置消息持久化**

```java
boolean durable = true;
channel.queueDeclare(QUEUE_NAME,durable,false,false,null);
```

RabbitMQ原生api中通过设置durable实参来指定是否需要消息持久化

::: warn 注意：

如果该队列之前已经使用过，不可以直接将```durable```修改为true。因为rabbitMQ Management会保存该队列的属性，该队并列并没有进行持久化设置，RabbitMQ不允许重新定义一个已存在的队列。此时申明会抛出```ShutdownSignalException```，我们可以通过在Management中删除该队列或重新定义队列名来完成。

:::

### 2.3发布/订阅模式

#### 2.3.1 Exchange 交换机

作用：

* 接受生产者的消息
* 推送消息给绑定好的队列

RabbitMQ中交换机的类型：

1. **Direct exchange：直连交换机**，转发消息到routigKey指定的队列

	直连交换机是一种**带路由功能**的交互机，一个队列通过**routing_key与一个交换机绑定**，当消息被发送的时候，需要指定一个routing_key，这个消息被送达交换机的时候，就会被交换机送到指定的队列里面去。同样一个routing_key也是支持应用到多个队列中的，当一个交换机绑定多个队列时，消息就会被送到对应的队列去处理。

2. **Fanout exchange：扇形交换机**，转发消息到所有绑定队列（速度最快）

	扇形交换机是最基本的交换机类型，它做的事情很简单--广播信息。Fanout交换机会把接收到的消息全部转发到绑定的队列上。因为广播不需要“思考”，所以Fanout交换机是四种交换机中**速度最快**的。

3. **Topic exchange：主题交换机**，按规则转发消息（最灵活）

	发送到主题交换机上的消息需要携带指定规则的routing_key，主题交换机会根据这个规则将数据发送到对应的(多个)队列上。

	主题交换机的routing_key需要有一定的规则，交换机和队列的binding_key需要采用\*.#.\*.....的格式，每个部分用.分开，其中：

	*表示匹配一个单词

	\#表示匹配任意数量（零个或多个）单词。(通配符)

4. **Headers exchange：**首部交换机 

**模型**

![img](https://www.rabbitmq.com/img/tutorials/python-three.png)

X：交换机

解读：

1. 一个生产者多个消费者
2. 每个消费者都有自己的队列
3. 生产者没有直接把消息发送到队列，而是通过``交换机```转发消息给队列
4. 每个队列都要绑定到交换机上
5. 生产者发送的消息是经过```交换机```到达队列，实现一个消息可以被多个消费者消费。

**代码展示：**

```java
//send
public static final String EXCHANGE_NAME = "exchange_fanout";

public static void main(String[] args) throws IOException, TimeoutException {
    Connection connection = ConnectionUtils.getConnection();
    Channel channel = connection.createChannel();
    // 声明交换机
    channel.exchangeDeclare(EXCHANGE_NAME, "fanout");

    // 发送消息
    String msg = "hello ps";
    channel.basicPublish(EXCHANGE_NAME,"",null,msg.getBytes());
    System.out.println("send: "+msg);
    //关闭资源
    channel.close();
    connection.close();
}
```

执行后可以在[RabbitMQ Management](http://localhost:15672/#/exchanges)中看到有新的叫交换机注册。但是此时有一个问题，RabbitMQ中**只有队列有存储能力**，此时还没有绑定队列，所以消息会丢失。所以我们需要创建队列并绑定交换机。

![image-20200111184900888](../img/image-20200111184900888.png)

```java
//receive1(receive2与其代码一致)
private final static String QUEUE_NAME = "test_queue_fanout_2";
public static void main(String[] args) throws IOException, TimeoutException {
    Connection connection = ConnectionUtils.getConnection();
    Channel channel = connection.createChannel();
    //队列申明
    channel.queueDeclare(QUEUE_NAME,false,false,false,null);
    //绑定队列到交换机
    channel.queueBind(QUEUE_NAME, Send.EXCHANGE_NAME,"");
    // 创建消费者
    DefaultConsumer consumer = new DefaultConsumer(channel){
        @Override
        public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
            String msg = new String(body, StandardCharsets.UTF_8);
            System.out.println("receive1:" + msg);
        }
    };
    // 监听队列
    channel.basicConsume(QUEUE_NAME,true,consumer);
}
```

此时可以发现两个个消费者都能获得该消息。在[RabbitMQ Management](http://localhost:15672/#/exchanges)中也能看到两个队列已经绑定成功

![image-20200111191332012](../img/image-20200111191332012.png)

### 2.4路由模式

**模型**

![img](https://www.rabbitmq.com/img/tutorials/python-four.png)

使用直连交换机

``` java
//send
public static final String EXCHANGE_NAME = "exchange_direct";
public static void main(String[] args) throws IOException, TimeoutException {
    Connection connection = ConnectionUtils.getConnection();
    Channel channel = connection.createChannel();
    // 声明交换机
    channel.exchangeDeclare(EXCHANGE_NAME, "direct");

    // 发送消息
    String msg = "hello direct";
    //设置路由键000000
    String routingKey = "error"
    channel.basicPublish(EXCHANGE_NAME,routingKey,null,msg.getBytes());
    System.out.println("send: "+msg);
    //关闭资源
    channel.close();
    connection.close();
}
```

```java
//receive1
private final static String QUEUE_NAME = "test_queue_direct_1";
public static void main(String[] args) throws IOException, TimeoutException {
    Connection connection = ConnectionUtils.getConnection();
    Channel channel = connection.createChannel();
    //队列申明
    channel.queueDeclare(QUEUE_NAME,false,false,false,null);
    //绑定队列到交换机路由表
    String routingKey = "error";
    channel.queueBind(QUEUE_NAME, Send.EXCHANGE_NAME,routingKey);
    // 创建消费者
    DefaultConsumer consumer = new DefaultConsumer(channel){
        @Override
        public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
            String msg = new String(body, StandardCharsets.UTF_8);
            System.out.println("receive1:" + msg);
        }
    };
    // 监听队列
    channel.basicConsume(QUEUE_NAME,true,consumer);
}
```

```java
//receive2
private final static String QUEUE_NAME = "test_queue_direct_1";
public static void main(String[] args) throws IOException, TimeoutException {
    Connection connection = ConnectionUtils.getConnection();
    Channel channel = connection.createChannel();
    //队列申明
    channel.queueDeclare(QUEUE_NAME,false,false,false,null);
    //绑定队列到交换机路由表
    String routingKey1 = "error";
    String routingKey2 = "info";
    String routingKey3 = "warning";
    channel.queueBind(QUEUE_NAME, Send.EXCHANGE_NAME,routingKey1);
    channel.queueBind(QUEUE_NAME, Send.EXCHANGE_NAME,routingKey2);
    channel.queueBind(QUEUE_NAME, Send.EXCHANGE_NAME,routingKey3);
    // 创建消费者
    DefaultConsumer consumer = new DefaultConsumer(channel){
        @Override
        public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
            String msg = new String(body, StandardCharsets.UTF_8);
            System.out.println("receive2:" + msg);
        }
    };
    // 监听队列
    channel.basicConsume(QUEUE_NAME,true,consumer);
}
```

**现象**

当生产者设置路由为```error```时，两个消费者都可以收到消息，当设置为```info```或```warning``时，只有消费者2可以接收到消息。



### 2.5 主题模式

使用主题交换机

**模型**

![img](https://www.rabbitmq.com/img/tutorials/python-five.png)



``` java
//send
public static final String EXCHANGE_NAME = "exchange_topic";
public static void main(String[] args) throws IOException, TimeoutException {
    Connection connection = ConnectionUtils.getConnection();
    Channel channel = connection.createChannel();
    // 声明交换机
    String exchangeType = "topic"
    channel.exchangeDeclare(EXCHANGE_NAME, exchangeType);
    // 发送消息
    String msg = "hello topic";
    //设置路由键000000
    String routingKey = "goods.add"
    channel.basicPublish(EXCHANGE_NAME,routingKey,null,msg.getBytes());
    System.out.println("send: "+msg);
    //关闭资源
    channel.close();
    connection.close();
}
```

```java
//receive1
private final static String QUEUE_NAME = "test_queue_topic_1";
public static void main(String[] args) throws IOException, TimeoutException {
    Connection connection = ConnectionUtils.getConnection();
    Channel channel = connection.createChannel();
    //队列申明
    channel.queueDeclare(QUEUE_NAME,false,false,false,null);
    //绑定队列到交换机路由表
    String routingKey = "goods.update";
    channel.queueBind(QUEUE_NAME, Send.EXCHANGE_NAME,routingKey);
    // 创建消费者
    DefaultConsumer consumer = new DefaultConsumer(channel){
        @Override
        public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
            String msg = new String(body, StandardCharsets.UTF_8);
            System.out.println("receive1:" + msg);
        }
    };
    // 监听队列
    channel.basicConsume(QUEUE_NAME,true,consumer);
}
```

```java
//receive2
private final static String QUEUE_NAME = "test_queue_topic_1";
public static void main(String[] args) throws IOException, TimeoutException {
    Connection connection = ConnectionUtils.getConnection();
    Channel channel = connection.createChannel();
    //队列申明
    channel.queueDeclare(QUEUE_NAME,false,false,false,null);
    //绑定队列到交换机路由表
    String routingKey = "goods.#";
    channel.queueBind(QUEUE_NAME, Send.EXCHANGE_NAME,routingKey);
    // 创建消费者
    DefaultConsumer consumer = new DefaultConsumer(channel){
        @Override
        public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
            String msg = new String(body, StandardCharsets.UTF_8);
            System.out.println("receive2:" + msg);
        }
    };
    // 监听队列
    channel.basicConsume(QUEUE_NAME,true,consumer);
}
```

结果：消费者1无法拿到消息，消费者2可以拿到消息。

### 2.6 RabbitMQ 的消息确认机制（事物+confirm）

在RabbitMQ中，我们可以通过持久化数据解决RabbitMQ服务器异常的数据丢失问题。

存在以下几种场景：

生产者将消息发出去后，消息到底有没有到达RabbitMQ服务器？默认情况下生产者是不知道的。

解决方案：

	- AMQP事物机制
	- Confirm 模式

#### 2.6.1 AMQP事物机制

RabbitMQ中与事务机制有关的方法有三个，分别是Channel里面的txSelect()，txCommit()以及txRollback()，txSelect用于将当前Channel设置成是transaction模式，txCommit用于提交事务，txRollback用于回滚事务，在通过txSelect开启事务之后，我们便可以发布消息给broker代理服务器了，如果txCommit提交成功了，则消息一定是到达broker了，如果在txCommit执行之前broker异常奔溃或者由于其他原因抛出异常，这个时候我们便可以捕获异常通过txRollback回滚事务。

::: tip 注：

Broker：消息队列服务器实体

:::

代码如下：

```java

//txSend
private static final String QUEUE_NAME = "test_queue_tx";
public static void main(String[] args) throws IOException, TimeoutException {
    Connection connection = ConnectionUtils.getConnection();
    Channel channel = connection.createChannel();
    channel.queueDeclare(QUEUE_NAME,false,false,false,null);
    String msg = "hello tx msg";

    try {
        channel.txSelect();
        channel.basicPublish("",QUEUE_NAME,null,msg.getBytes());
        int i =1/0;
        channel.txCommit();
    } catch (Exception e){
        channel.txRollback();
        System.out.println("send message rollback");
    } finally {
        channel.close();
        connection.close();
    }

}
```

可以看到，当执行 **除零** 时，会被```catch```捕获并进行事物回滚。**在实际应用中，可以在回滚之后再次进行消息重发操作保证消息的安全性**。但是于此同时也存在一个缺陷：因为每一次发送消息都是一次请求，发送失败后再次发送显然比较浪费资源，会**降生产者的吞吐量**。

#### 2.6.2 Confirm模式

**原理**

生产者将信道设置成confirm模式时，所有在该信道上发布的消息都会被指派一个唯一的ID（从1开始），一旦消息被投递到所有的匹配的队列之后，broker就会发送一个确认给生产者（包含消息的唯一ID），这就使得生产者知道消息已经正确到达目的队列了，如果消息和队列是可持久化的，那么确认消息会在**消息写入磁盘之后发出**，broker回传给生产者的确认消息中 deliver-tag 域包含了确认消息的序列号，此外broker也可以设置```basic.ack```的multiple域，**表示到这个序列号之前的所有消息都得到了处理**

Confirm 最大的优势在于他是异步的，当rabbitMQ自身出现了异常问题，就会发送一条Nack消息，生产者可以通过回调方法处理Nack消息。

**编程模式**

- 普通模式

	开启confirm模式

	```channel.confirmSelect()```

	....（发送消息）

	通过```channel.waitForConfirms()```判断是否发送成功。

- 异步模式

	Channel对象提供```ConfirmListener()```回调方法，该方法只包含一个**deliverTag**（当前channel发出的消息序列号），我们需要自己为每一个Channel维护一个unconfirm的消息序号集合，每发布一条数据，集合中元素+1，每回调一次handleAck方法，集合中删除对应的一条（或多条）记录（具体参照是否开启multiple）。从程序运行效率上来说，unconfirm集合最好采用有序集合SortedSet存储结构。

	![截图](../img/Screenshot_20200112_124837_tv.danmaku.bili.jpg)   

::: warning 

事物机制和Confirm模式不可以共存

:::

