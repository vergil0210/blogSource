---
title: RabbitMQ学习笔记
date: 2020-01-07
categories:
- learning notes
tags: 
- massage queue
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