---
challengeId: "linux-filesystem-top-level"
reportId: "day04"
day: 4
title: "Day 4: /dev"
summary: "devディレクトリを学習。"
publishedAt: "2026-03-14"
draft: false
---
## ディレクトリの概要

`/dev`は、Linuxカーネルが管理するデバイスファイルの集合。

デバイスファイル（device node）とも呼ばれる。

Linuxでは、**ハードウェアをファイルとして扱う仕組み**がある。(Everything is a file)

| ハードウェア | Linuxからの見え方 |
| --- | --- |
| SSD | /dev/sda |
| USB | /dev/sdb |
| 端末 | /dev/tty |
| 仮想デバイス | /dev/null  |

また、`/dev`は現在udev（デバイス管理システム）によって起動時やデバイス接続時に自動生成される。

※udev とは、Linuxでデバイスを管理し、`/dev`のデバイスファイルを自動生成する仕組み。

例）USBメモリを挿すと

カーネルが検出
↓
udevが処理
↓
/dev/sdb が作られる

## 主な用途

Linuxのデバイス（ハードウェア）へアクセスするための窓口。

アプリケーションやコマンドは

- ディスク
- USB
- キーボード
- ターミナル

などに直接触れるのではなく、`/dev`のファイルを通して操作する

## 代表的なファイル

### ストレージ系

| デバイス | 意味 |
| --- | --- |
| `/dev/sda` | 1台目のディスク |
| `/dev/sda1` | そのパーティション |
| `/dev/loop*` | ループデバイス（ISOやイメージをディスクとして扱う） |
| `/dev/mapper` | LVMや暗号化ディスク |

※ パーティションとは1つのディスクを複数の領域に分割したもの。
それぞれが独立したディスクのように扱われ、/dev/sda1 /dev/sda2 のように番号で識別される。

### 特殊デバイス

| デバイス | 用途 |
| --- | --- |
| `/dev/null` | データを捨てる |
| `/dev/zero` | 0を出し続ける |
| `/dev/random` | 安全な乱数 |
| `/dev/urandom` | 高速な疑似乱数 |

### ターミナル系

| デバイス | 意味 |
| --- | --- |
| `/dev/tty` | 現在の端末 |
| `/dev/tty0`〜 | 仮想コンソール |
| `/dev/pts` | 仮想ターミナル |

### 入出力系

| デバイス | 意味 |
| --- | --- |
| `/dev/stdin` | 標準入力 |
| `/dev/stdout` | 標準出力 |
| `/dev/stderr` | 標準エラー |

### 仮想メモリ系

| デバイス | 意味 |
| --- | --- |
| `/dev/mem` | 物理メモリ |
| `/dev/shm` | 共有メモリ |

## /dev/sda

`/dev/sda`は物理ディスクを操作するためのデバイスファイル（ブロックデバイス）

`/dev/sda`のブロックデバイス（ディスク・パーティション）とマウント状況を表示

```jsx
%lsblk sda
NAME   MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
sda      8:0    0 476.9G  0 disk 
├─sda1   8:1    0     1G  0 part /boot/efi
└─sda2   8:2    0 475.9G  0 part /
```

- `/dev/sda` → SSD全体
- `/dev/sda1` → EFIブート領域（/boot/efi）
- `/dev/sda2` → Linux本体（/）

`/dev/sda`ディスクの詳細情報とパーティションテーブルを表示

```jsx
%sudo fdisk -l
（中略）
Disk /dev/sda: 476.94 GiB, 512110190592 bytes, 1000215216 sectors
Disk model: SAMSUNG MZNLN512
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: gpt
Disk identifier: B44DAF85-F580-4D0A-A46A-ABD2895C03B8

Device       Start        End   Sectors   Size Type
/dev/sda1     2048    2203647   2201600     1G EFI System
/dev/sda2  2203648 1000212479 998008832 475.9G Linux filesystem
```

パーティションテーブルの各項目の意味

| 項目 | 意味 |
| --- | --- |
| Device | パーティション名 |
| Start | パーティション開始位置 |
| End | パーティション終了位置 |
| Sectors | 使用しているセクタ数 |
| Size | パーティションサイズ |
| Type | パーティションの用途 |


## 仮想デバイスの役割

仮想デバイスはよく使う機能をデバイスとして提供するもの。

実際のハードウェアを持たず、カーネルがソフトウェアとして提供するデバイス。

| デバイス | 機能 |
| --- | --- |
| `/dev/null` | データ破棄 |
| `/dev/zero` | 0を無限に生成（初期化、テスト用データ等） |
| `/dev/random` | 暗号用途のための高品質な乱数を生成（暗号鍵等） |
| `/dev/loop` | ファイルをディスクとして扱う |

## /dev/null

`/dev/null`は、書き込まれたデータをすべて破棄する特殊デバイス。

Linuxではコマンドの出力は通常 stdout（標準出力）として画面に表示されるが、
不要な出力を捨てたい場合に /dev/null を使う。

```jsx
%ll /dev/null
crw-rw-rw- 1 root root 1, 3 Mar 14 14:17 /dev/null
```

先頭のcはキャラクタデバイスを意味する。

※キャラクタデバイスとは、データを１文字（１バイト）単位で順番に読み書きするデバイス

　対になるもので、「ブロックデバイス（ブロック単位でランダムアクセス）」がある。

### `/dev/null` が役立つ理由

Linuxではコマンドが基本的に出力を必ずどこかに書く設計になっている。

しかし状況によっては、結局いらないということが多い。

そこで捨て場所として `/dev/null` を使う。
