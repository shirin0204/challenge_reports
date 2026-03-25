---
challengeId: "linux-filesystem-top-level"
reportId: "day12"
day: 12
title: "Day 12:/sbin"
summary: "sbinディレクトリを学習。"
publishedAt: "2026-03-22"
draft: false
---

## ディレクトリの概要

`/sbin` はシステム管理用のコマンドが格納されているディレクトリ。主に管理者(root)が使用する重要なコマンドが置かれている。

主にシステム管理の中枢に関わるコマンド軍を担う。（Linuxの運用や維持に直結する領域）

- システム管理／制御用コマンドの配置
- 起動／停止／修復などの管理操作
- 一般ユーザではなく、管理者向けの実行ファイルを分離

## よくある中身

- `shutdown` システムを安全に停止するコマンド
- `reboot` システムを再起動する
- `fsck` ファイルシステムのチェック／修復を行う
- `ifconfig` ネットワーク設定を確認／変更（最近はipコマンドが主流）
- `iptables` ファイアウォール（通信制御）の設定を行う

## /binと/sbinの違い

- `/bin` 一般ユーザ向けの基本コマンド
- `/sbin` システム管理用コマンド（おもにrootが使う）

利便性のため、一般ユーザのPATHにも`/sbin` が含まれている。

```jsx
echo $PATH
/home/USER/.nvm/versions/node/v24.14.0/bin:/home/USER/.local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin:/snap/bin:/home/USER/.local/bin
```

一般ユーザは　`/sbin` を実行はできるが、システム変更などの処理は権限不足により成功しないことが多い(permission denied、operation not permittedなどのエラーが出る）

「実行できるか」ではなく「誰が使う前提か」で別れている