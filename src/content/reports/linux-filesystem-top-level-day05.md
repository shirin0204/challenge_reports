---
challengeId: "linux-filesystem-top-level"
reportId: "day05"
day: 5
title: "Day 5: /etc"
summary: "etcディレクトリを学習。"
publishedAt: "2026-03-15"
draft: false
---
## ディレクトリの概要

/etcはLinuxシステムの設定ファイルが保存されているディレクトリ。

基本的に実行ファイルはおかず、テキスト形式の設定ファイルが中心。(config only)

ネットワーク設定、ユーザー設定、サービス設定など、システムの動作を決める重要な設定がここに集まる。

## 主な用途

- OSやサービスの設定ファイルを保存
- システム管理者が手動で編集する設定を置く
- Linux起動時やサービス起動時に読み込まれる設定を管理

## /etcの中身（一部抜粋）

| ファイル | 役割 | 概要 |
| --- | --- | --- |
| `/etc/passwd` | ユーザ一覧 | Linuxユーザ管理の基本 |
| `/etc/shadow` | パスワード | セキュリティの中心 |
| `/etc/hosts` | ホスト名解決 | DNS理解に繋がる |
| `/etc/fstab` | マウント設定 | Linux起動とストレージ |
| `/etc/hostname` | ホスト名 | ネットワーク設定 |
| `/etc/resolv.conf` | DNS設定 | 名前解決 |
| `/etc/systemd/` | サービス設定 | 現代Linuxのサービス管理 |
| `/etc/ssh/` | SSH設定 | リモート接続 |

## Linuxの仕組みと関係

Linuxでは「設定は`/etc`に置く」という設計思想があり、多くのソフトウェアもここに設定を保存する。

- 起動設定 → `/etc/fstab`
- ユーザ管理 → `/etc/passwd`
- ネットワーク → `/etc/hosts`
- サービス設定 → `/etc/systemd/`

## 実際の中身をいくつか見ていく

### /etc/passwd

Linuxに存在するユーザーアカウントの一覧を管理するファイル

ユーザー名、UID、ホームディレクトリ、ログインシェルなどの情報が保存されている。

```jsx
%cat /etc/passwd（抜粋）
root:x:0:0:root:/root:/bin/bash
↑      ↑ ↑   ↑      ↑       ↑
名前   UID GID 説明  ホーム   シェル
```

※ｘはパスワード欄だが、ここには保存されていないため、xという表記になっている。
最後の項目はログインシェル。

`/bin/bash` 通常ユーザーが使用するシェル

`/usr/sbin/nologin` ログイン不可（人間がログインして操作する想定ではないユーザー）

### /etc/systemd

Linuxのサービス管理を行うsystemdの設定ファイルが保存されるディレクトリ。

systemdは、Linuxの

- サービス起動
- 自動起動
- システム管理

などを行う仕組み

```jsx
%la -1 /etc/systemd
journald.conf
logind.conf
network
networkd.conf
oomd.conf
pstore.conf
resolved.conf
sleep.conf
system
system.conf
system-generators
timesyncd.conf
user
user.conf
```

### /etc/hosts

ここではDNSよりも優先されるローカル名前解決テーブル

※DNSとはドメイン名をIPアドレスに変換する仕組み

```jsx
cat /etc/hosts
127.0.0.1 localhost
127.0.1.1 <hostname>

# The following lines are desirable for IPv6 capable hosts
::1     ip6-localhost ip6-loopback
fe00::0 ip6-localnet
ff00::0 ip6-mcastprefix
ff02::1 ip6-allnodes
ff02::2 ip6-allrouters
```

- `127.0.0.1 `localhost`` はループバックアドレスと呼ばれ、自分自身のPCを指す
- `127.0.1.1 <hostname>` は自分のPCのホスト名（Debian / Ubuntu 系でよく使われるローカルホスト名設定）
- `::1     ip6-localhost`はIPv６版の`127.0.0.1`

※ここでドメイン設定をすると広告ブロックができる

例）下記を`/etc/hosts`に追加

```jsx
0.0.0.0 ad.doubleclick.net
0.0.0.0 ads.yahoo.com
0.0.0.0 tracking.facebook.com
0.0.0.0 analytics.google.com
0.0.0.0 ads.twitter.com
```

こうすることで広告サーバ→`0.0.0.0`（存在しない）となり、通信が失敗して広告が消える

### /etc/resolv.conf

DNSサーバの設定ファイル

LinuxがどのDNSサーバに問い合わせるかをここで定義する。

```jsx
%cat /etc/resolv.conf
nameserver 127.0.0.53
options edns0 trust-ad
search .
```

`nameserver`はDNS問い合わせ先のことで、`127.0.0.53`はsystemd-resolvedというローカルDNSサービス（**自分のPC内で動くDNSリゾルバ**）

アプリ

↓

127.0.0.53 (systemd-resolved)

↓

外部DNS

↓

IPアドレス

という流れ

`options`はDNS問い合わせのオプション設定のこと。

- `edns0`大きいパケットやDNSSECなどを扱えるようにしている
- `trust-ad`DNSSEC検証済みのデータを信頼する

※DNSSECはDNSの改ざん防止の仕組みのこと

`search`はドメイン補完設定で、ここの値が設定されていると設定されたドメイン名に補完される。（複数設定されている場合には順番に試される。

### /etc/nsswitch.conf

Linuxが「情報をどこから取得するか」を決める設定を定義する。

基本構成は

情報の種類: 　取得元1 取得元2 取得元3

```jsx
%cat /etc/nsswitch.conf 
passwd:         files systemd sss
group:          files systemd sss
shadow:         files systemd sss
gshadow:        files systemd

hosts:          files mdns4_minimal [NOTFOUND=return] dns
networks:       files

protocols:      db files
services:       db files sss
ethers:         db files
rpc:            db files

netgroup:       nis sss
automount:  sss
```

| 取得元（ソース） | 内容 |
| --- | --- |
| files | ローカルの設定ファイル（例: `/etc/passwd`, `/etc/hosts`, `/etc/services` など） |
| systemd | systemd が管理する内部データベース |
| sss | SSSD（System Security Services Daemon）。LDAP や Active Directory などの外部認証サービスと連携するための仕組み |
| dns | DNSサーバによる名前解決 |
| mdns4_minimal | mDNS（Multicast DNS）。`.local` ドメインなどのLAN内名前解決 |
| db | glibc が利用するデータベース形式の情報源（`/var/db/` などの内部DB） |
| nis | NIS（Network Information Service）。古いUNIXネットワーク認証システム（今はあまり使われない） |

※SSSDとは、Linuxが外部のユーザ管理システムと連携するための仕組み（Linuxと外部認証サービスの橋渡しをするサービス）

※LDAP(Lightweight Directory Access Protocol)は、ユーザ情報や組織情報などを管理するディレクトリサービスのプロトコル

※外部認証基盤とはユーザ管理を中央サーバで一元管理する仕組み（ユーザ管理を一箇所に集約している）

例）

| サービス | 用途 |
| --- | --- |
| Active Directory | Windows企業ネットワーク |
| LDAP | Linux系ユーザ管理 |
| FreeIPA | Linux認証システム |