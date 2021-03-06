---
title: NAT
date: 2020-06-10
sidebar: false
categories:
- essay
tags:
- network
---

### 简介

NAT(Network Address Translation) 网络地址转换。实际上就是替换IP报文头部的地址信息，通过将内部网络IP地址替换为出口的IP地址提供公网可达性和上层协议的连接能力。

RFC1918规定了三个保留地址段落：10.0.0.0-10.255.255.255；172.16.0.0-172.31.255.255；192.168.0.0-192.168.255.255。这三个范围分别处于A,B,C类的地址段，不向特定的用户分配，被IANA作为私有地址保留。这些地址可以在任何组织或企业内部使用，和其他Internet地址的区别就是，**仅能在内部使用**，不能作为全球路由地址。

简单来说，出了组织管理范围，这些地址就没有任何意义。在阻止管理范围内，用于区分组织内的不同主机，我们只需要在组织出口部署NAT网关，当这些地址中的报文离开私网进入Internet的时候，将源IP替换成公网地址（通常是出口设备的地址），当这个请求到达目标后，被请求的服务端将响应由Internet发回出口网关，出口网关再将目的的值替换为源主机地址，发回内部。这样一次由私网主机向公网服务端的请求和响应就在通信两端均无感知的情况下完成了。

### NAT处理报文的几个关键特点

1. 网络被分为私网和公网两个部分，NAT网关设置在私网到公网的路由出口位置，双向流量必须都要经过NAT网关；
2. **网络访问只能先由私网侧发起，公网无法主动访问私网主机**；
3. NAT网关在两个访问方向上完成两次地址的转换或翻译，出方向做源信息替换，入方向做目的信息替换；
4. NAT网关的存在对通信双方是保持透明的；
5. NAT网关为了实现双向翻译的功能，需要维护一张关联表，把会话的信息保存下来。

**注**：其中第二个特点**打破**了IP协议架构中所有节点在通讯中的**对等地位**，这是NAT最大的弊端，为对等通讯带来了诸多问题，当然相应的克服手段也应运而生。事实上，第四点是NAT致力于达到的目标，但在很多情况下，NAT并没有做到，因为除了IP首部，上层通信协议经常在内部携带IP地址信息。这些我们稍后解释。

### 一对多的NAT
NAT最典型的应用场景，一个组织网络，在出口位置部署NAT网关，所有对公网的访问表现为一台主机。这就是所谓的一对多模型。这种方式下，出口设备只占用一个由Internet服务提供商分配的公网IP地址。面对私网内部数量庞大的主机，如果NAT只进行IP地址的简单替换，就会产生一个问题：**当有多个内部主机去访问同一个服务器时，从返回的信息不足以区分响应应该转发到哪个内部主机。**此时，需要NAT设备根据传输层信息或其他上层协议去区分不同的会话，并且可能要对上层协议的标识进行转换，比如TCP或UDP端口号。这样NAT网关就可以将不同的内部连接访问映射到同一公网IP的不同传输层端口，通过这种方式实现公网IP的复用和解复用。这种方式也被称为端口转换PAT、NAPT或IP伪装，但更多时候直接被称为NAT，因为它是最典型的一种应用模式

### NAT弊端

- **NAT使IP会话的保持失效变短。**因为一个会话建立后会在NAT设备上建立一个关联表，在会话静默的这段时间，NAT网关会进行老化操作。这是任何一个NAT网关必须做的事情，因为IP和端口资源有限，通信的需求无限，所以必须在会话结束后回收资源。
- NAT在实现上将多个内部主机发出的连接复用到一个IP上，这使**依赖IP进行主机跟踪的机制失效**。
<<<<<<< HEAD
- NAT工作机制依赖于修改IP包头的信息，这会**妨碍一些安全协议的工作**。
=======
- NAT工作机制依赖于修改IP包头的信息，这会**妨碍一些安全协议的工作**。

### SNAT与DNAT

SNAT（Source Network Address Translation）源网络地址转换

DNAT（Destination Network Address Translation）目的网络地址转换

SNAT与DNAT是NAT的两种模式，“源（S）”与“目的（D）”是用于描述内网IP在一次访问中所承担的角色。当内网IP主动访问外网IP时，内网IP即为源地址，即使用SNAT；当公网IP主动访问内网IP时，内网IP即为目标地址，即使用DNAT。

SNAT：

- 请求：当外部A需要访问内部B时（内部A主动发起连接），首先将请求包（源：ipA，目标：ipB）发送到NAT网关C，C收到后将数据包源地址改为本机公网IP（源：ipC，目标：ipB）然后发送给B；
- 响应：B收到后向NAT网关发起响应包（源：ipB，目标：ipC）发回给C，C收到后修改其目的地址为（源：ipB，目标：ipA）然后将数据包发送给A。

DNAT：

- 请求：当内部A需要提供对外部B的服务时（外部B主动向内部发起连接），NAT网关C接收连接（源：ipB，目标：ipC），然后将连接转到内部。此过程通过带有公网IP的网关代替内部服务来接收外部的连接，然后将目的地址进行修改，并将数据包（源：ipB，目标ipA）发送给内部服务。
- 响应：A服务在接收到数据包后，将响应（源：ipA，目标：ipB）发送给NAT网关，网关对数据包源地址进行修改，并将响应包（源：ipC，目标：ipB）发送给B。
>>>>>>> 91e5af9f9e988b5b75d47ca02fdb8537b2d2fbbe
