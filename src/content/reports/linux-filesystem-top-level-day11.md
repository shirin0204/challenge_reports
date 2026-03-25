---
challengeId: "linux-filesystem-top-level"
reportId: "day11"
day: 11
title: "Day 11:/root"
summary: "rootディレクトリを学習。"
publishedAt: "2026-03-21"
draft: false
---

## ディレクトリの概要

`/root`はrootユーザ専用（管理者）のホームディレクトリ。一般ユーザの`/home`と同じような役割で、一般ユーザの影響を受けず、安全に管理作業ができるように分離されている。

※rootユーザはシステム全体を操作できる特権ユーザ。

- rootユーザの作業ディレクトリ
- 管理者用の設定／スクリプトの保存
- 緊急時の操作環境（システム復旧など）

## よくある中身

- `.bashrc` シェルの設定ファイル。エイリアスや環境設定を書く
- `.profile` ログイン時に読み込まれる設定ファイル
- `.bash_history` 実行したコマンド履歴が保存される
- `script.sh` 管理者が使うスクリプト
- `.ssh/` SSH鍵や接続設定を保存するしレクトリ
- `snap/` Snapアプリのデータ保存ディレクトリ（アプリごとに分離された領域）

## 実際に見てみる

```jsx
sudo ls -al root/
total 40
drwx------  6 root root 4096 Mar 13 17:32 .
drwxr-xr-x 23 root root 4096 Jan 16 17:34 ..
-rw-------  1 root root    7 Jan 27 15:06 .bash_history
-rw-r--r--  1 root root 3106 Apr 22  2024 .bashrc
drwx------  2 root root 4096 Aug  6  2025 .cache
-rw-------  1 root root   20 Mar 13 17:32 .lesshst
drwxr-xr-x  3 root root 4096 Jan 22 23:23 .local
-rw-r--r--  1 root root  161 Apr 22  2024 .profile
drwx------  6 root root 4096 Jan 16 17:54 snap
drwx------  2 root root 4096 Jan 16 17:54 .ssh
```