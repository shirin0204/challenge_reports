---
challengeId: "linux-filesystem-top-level"
reportId: "day09"
day: 9
title: "Day 9:/opt"
summary: "optディレクトリを学習。"
publishedAt: "2026-03-19"
draft: false
---

## ディレクトリの概要

/optは追加アプリケーション（オプションソフト）を配置するためのディレクトリ。主にOS標準ではないソフトをまとめて管理する場所。

システムと追加ソフトを分離することで、アンインストールや管理が楽になる。

- サードパーティ製ソフトのインストール先
- 独自アプリや手動インストールしたツールの配置
- パッケージ管理外のソフトを整理

## よくある中身

- `/opt/google` Google Chromeなどの公式パッケージが入ることがある
- `/opt/docker` Docker関連ツールや独自構成が入る
- `/opt/appname` アプリ単体でディレクトリが作られる

**実際に見てみる**

```jsx
ls -1 opt
containerd
google
warpdotdev
```

- `containerd`はコンテナランタイム（コンテナのライフサイクルを管理する基盤ソフトウェア）

ls usr/bin | grep "warp"
warp-terminal

- `warpdotdev`はターミナルアプリのWarp

3つともOS標準ではなく、**外部ベンダー製**のもので、アプリ単位でディレクトリを持っている。


### アプリの違い

Linuxではインストール方法によってどこに入るかが決まる。

どこに入るかは「誰が管理するか」によって異なる

| インストール方法 | 配置先 |
| --- | --- |
| apt / dnf などのパッケージ管理(OSが管理) | `/usr` |
| 手動インストール / ベンダー独自(アプリ提供先が管理) | `/opt` |
| ユーザ単位（ローカル）(ユーザが管理) | `/home` |