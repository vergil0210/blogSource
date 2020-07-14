---
title: OSI 模型
date: 2020-07-14
sidebar: false
categories: 
- essay
tags: 
- network
---

OSI模型中的各层协议表，摘自[wikipedia]([https://zh.wikipedia.org/wiki/OSI%E6%A8%A1%E5%9E%8B](https://zh.wikipedia.org/wiki/OSI模型))

| OSI模型                                                      |
| ------------------------------------------------------------ |
| [应用层](https://zh.wikipedia.org/wiki/应用层)（application layer） OSI Layer 7 |
| [DHCP](https://zh.wikipedia.org/wiki/动态主机设置协议)	（[v6](https://zh.wikipedia.org/wiki/DHCPv6)）	[DNS](https://zh.wikipedia.org/wiki/域名系统)     [FTP](https://zh.wikipedia.org/wiki/文件传输协议)	[Gopher](https://zh.wikipedia.org/wiki/Gopher_(网络协议))	[HTTP](https://zh.wikipedia.org/wiki/超文本传输协议)（[SPDY](https://zh.wikipedia.org/wiki/SPDY)、[HTTP/2](https://zh.wikipedia.org/wiki/HTTP/2)）	[IMAP4](https://zh.wikipedia.org/wiki/IMAP)     [IRC](https://zh.wikipedia.org/wiki/IRC)	[NNTP](https://zh.wikipedia.org/wiki/網路新聞傳輸協議)	[XMPP](https://zh.wikipedia.org/wiki/XMPP)	[POP3](https://zh.wikipedia.org/wiki/郵局協定)	[SIP](https://zh.wikipedia.org/wiki/会话发起协议)	[SMTP](https://zh.wikipedia.org/wiki/简单邮件传输协议)	[SNMP](https://zh.wikipedia.org/wiki/简单网络管理协议)[SSH](https://zh.wikipedia.org/wiki/Secure_Shell)	[TELNET](https://zh.wikipedia.org/wiki/Telnet)	[RPC](https://zh.wikipedia.org/wiki/远程过程调用)		[RTCP](https://zh.wikipedia.org/wiki/实时传输控制协议)	[RTP](https://zh.wikipedia.org/wiki/实时传输协议)	[RTSP](https://zh.wikipedia.org/wiki/即時串流協定)	[SDP](https://zh.wikipedia.org/wiki/会话描述协议)	[SOAP](https://zh.wikipedia.org/wiki/简单对象访问协议)	[GTP](https://zh.wikipedia.org/wiki/GPRS隧道协议)	[STUN](https://zh.wikipedia.org/wiki/STUN)	[NTP](https://zh.wikipedia.org/wiki/網絡時間協議)	[SSDP](https://zh.wikipedia.org/wiki/简单服务发现协议)	[更多](https://zh.wikipedia.org/wiki/Category:应用层协议) |
| [表示层](https://zh.wikipedia.org/wiki/表示层)（presentation layer） OSI Layer 6 |
| 该层被弃用。应用层的[HTTP](https://zh.wikipedia.org/wiki/超文本传输协议)、[FTP](https://zh.wikipedia.org/wiki/文件传输协议)、[Telnet](https://zh.wikipedia.org/wiki/Telnet)等协议有类似的功能。传输层的[TLS/SSL](https://zh.wikipedia.org/wiki/安全套接层)也有类似功能。 |
| [会话层](https://zh.wikipedia.org/wiki/会话层)（session layer） OSI Layer 5 |
| 该层被弃用。应用层的[HTTP](https://zh.wikipedia.org/wiki/超文本传输协议)、[RPC](https://zh.wikipedia.org/wiki/远程过程调用)、[SDP](https://zh.wikipedia.org/wiki/会话描述协议)、[RTCP](https://zh.wikipedia.org/wiki/实时传输控制协议)等协议有类似的功能。 |
| [传输层](https://zh.wikipedia.org/wiki/传输层)（transport layer） OSI Layer 4 |
| [TCP](https://zh.wikipedia.org/wiki/传输控制协议)（[T/TCP](https://zh.wikipedia.org/wiki/事务传输控制协议) 、[Fast Open](https://zh.wikipedia.org/wiki/TCP快速打开)）[UDP](https://zh.wikipedia.org/wiki/用户数据报协议)、[DCCP](https://zh.wikipedia.org/wiki/数据拥塞控制协议)、[SCTP](https://zh.wikipedia.org/wiki/流控制传输协议)、[RSVP](https://zh.wikipedia.org/wiki/资源预留协议)、[PPTP](https://zh.wikipedia.org/wiki/點對點隧道協議)、[TLS/SSL](https://zh.wikipedia.org/wiki/安全套接层)、[更多](https://zh.wikipedia.org/wiki/Category:传输层协议) |
| [网络层](https://zh.wikipedia.org/wiki/网络层)（network layer） OSI Layer 3 |
| [IP](https://zh.wikipedia.org/wiki/网际协议)（[v4](https://zh.wikipedia.org/wiki/IPv4)、[v6](https://zh.wikipedia.org/wiki/IPv6)）、[ICMP](https://zh.wikipedia.org/wiki/互联网控制消息协议)（[v6](https://zh.wikipedia.org/wiki/ICMPv6)）、[IGMP](https://zh.wikipedia.org/wiki/因特网组管理协议)、[IS-IS](https://zh.wikipedia.org/wiki/中间系统到中间系统)、[IPsec](https://zh.wikipedia.org/wiki/IPsec)、[BGP](https://zh.wikipedia.org/wiki/边界网关协议)、[RIP](https://zh.wikipedia.org/wiki/路由信息协议)、[OSPF](https://zh.wikipedia.org/wiki/开放式最短路径优先)、[RARP](https://zh.wikipedia.org/wiki/逆地址解析协议)、[更多](https://zh.wikipedia.org/wiki/Category:网络层协议) |
| [数据链路层](https://zh.wikipedia.org/wiki/数据链路层)（data link layer） OSI Layer 2 |
| [Wi-Fi](https://zh.wikipedia.org/wiki/Wi-Fi)（[IEEE 802.11](https://zh.wikipedia.org/wiki/IEEE_802.11)）、[ARP](https://zh.wikipedia.org/wiki/地址解析协议)、[WiMAX](https://zh.wikipedia.org/wiki/全球互通微波存取)（[IEEE 802.16](https://zh.wikipedia.org/wiki/IEEE_802.16)）、[ATM](https://zh.wikipedia.org/wiki/异步传输模式)、[DTM](https://zh.wikipedia.org/wiki/数字地面模型)[令牌环](https://zh.wikipedia.org/wiki/令牌环)、[以太网](https://zh.wikipedia.org/wiki/以太网)[FDDI](https://zh.wikipedia.org/wiki/光纤分布式数据接口)、[帧中继](https://zh.wikipedia.org/wiki/帧中继)、[GPRS](https://zh.wikipedia.org/wiki/通用分组无线服务)[EV-DO](https://zh.wikipedia.org/wiki/EV-DO)、[HSPA](https://zh.wikipedia.org/wiki/高速封包存取)、[HDLC](https://zh.wikipedia.org/wiki/高级数据链路控制)、[PPP](https://zh.wikipedia.org/wiki/点对点协议)、[PPPoE](https://zh.wikipedia.org/wiki/PPPoE)、[L2TP](https://zh.wikipedia.org/wiki/第二层隧道协议)[ISDN](https://zh.wikipedia.org/wiki/综合业务数字网)、[SPB](https://zh.wikipedia.org/wiki/IEEE_802.1aq)、[STP](https://zh.wikipedia.org/wiki/生成树协议)、[更多](https://zh.wikipedia.org/wiki/Category:链路协议) |
| [物理层](https://zh.wikipedia.org/wiki/物理层)（physical layer） OSI Layer 1 |
| [以太网](https://zh.wikipedia.org/wiki/以太网)、[调制解调器](https://zh.wikipedia.org/wiki/调制解调器)、[电力线通信](https://zh.wikipedia.org/wiki/電力線通信)、[同步光网络](https://zh.wikipedia.org/wiki/同步光网络)、[G.709](https://zh.wikipedia.org/w/index.php?title=G.709&action=edit&redlink=1)、[光导纤维](https://zh.wikipedia.org/wiki/光导纤维)[同轴电缆](https://zh.wikipedia.org/wiki/同轴电缆)、[双绞线](https://zh.wikipedia.org/wiki/双绞线)、[更多](https://zh.wikipedia.org/wiki/Category:物理層協議) |

