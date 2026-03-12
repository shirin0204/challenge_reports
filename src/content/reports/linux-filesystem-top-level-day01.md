---
challengeId: "linux-filesystem-top-level"
reportId: "day01"
day: 1
title: "Day 1: FHSと /"
summary: "FHS（Filesystem Hierarchy Standard）とルートディレクトリを学習。"
publishedAt: "2026-03-11"
draft: false
---

## FHSとは

Filesystem Hierarchy Standardの略。

Linuxのディレクトリ構造を統一するための仕様。

## FHSのデータ分類

FHSではファイルを2つの軸で分類する

| | 共有可能 (shareable) | 非共有 (unshareable) |
|---|---|---|
| **静的 (static)** | `/usr`<br>`/opt` | `/etc`<br>`/boot` |
| **可変 (variable)** | `/var` | `/home` |

## ルートディレクトリとは

Linuxファイルシステムの起点となる場所

```jsx
すべてのディレクトリは/を起点とする
/
├── bin
├── boot
├── dev
├── etc
├── home
├── usr
└── var
```

## /の役割

- Linuxファイルシステムの最上位
- すべてのディレクトリの親
- OS起動時に最初にマウントされるファイルシステム
- パスは常に/ から始まると「絶対パス」となる

```jsx
% ls -1
bin
bin.usr-is-merged
boot
cdrom
dev
etc
home
lib
lib64
lib.usr-is-merged
lost+found
media
mnt
opt
proc
root
run
sbin
sbin.usr-is-merged
snap
srv
swap.img
sys
tmp
usr
var
```

※’-1’オプションで一行ずつ表示

## / の下には重要ディレクトリしか置かれない（トップレベル）

| ディレクトリ | 役割 |
| --- | --- |
| `/bin` | 基本コマンド（ls, cp, mv など） |
| `/boot` | 起動に必要なファイル（カーネル・bootloader） |
| `/dev` | デバイスファイル（ディスク・端末など） |
| `/etc` | システム設定ファイル |
| `/home` | 一般ユーザーのホームディレクトリ |
| `/lib` | 基本プログラムが使用する共有ライブラリ |
| `/media` | USBなどリムーバブルメディアのマウントポイント |
| `/mnt` | 一時的なマウント用ディレクトリ |
| `/opt` | 追加アプリケーション（サードパーティソフト） |
| `/proc` | カーネル・プロセス情報（仮想ファイルシステム） |
| `/root` | rootユーザーのホームディレクトリ |
| `/run` | システム起動中の一時データ（PIDなど） |
| `/sbin` | システム管理用コマンド |
| `/srv` | サービス用データ（Webサーバなど） |
| `/sys` | デバイス・カーネル情報（仮想ファイルシステム） |
| `/tmp` | 一時ファイル |
| `/usr` | ユーザー共有プログラム・データ |
| `/var` | 可変データ（ログ・キャッシュなど） |

/ はあくまでもOS管理領域となるため、直接ファイルが置かれたり、ユーザーがディレクトリを作成したりする場所じゃない（整理された構造を保つため）

## usr merge

FHSでは `/bin` `/sbin` `/lib` などがトップレベルに存在するが、

最近のLinuxでは

```
/bin  → /usr/bin
/sbin → /usr/sbin
/lib  → /usr/lib
```

のように `/usr` 配下へ統合されている場合が多い。

## / は最初にマウントされる

OS起動時の流れ

```jsx
BIOS(UEFI)
↓
boot loader
↓
kernel
↓
root filesystem(/)
↓
...
```

## /とrootは全くの別もの

rootとは管理者のこと。

/root

これはrootユーザーのホームディレクトリ